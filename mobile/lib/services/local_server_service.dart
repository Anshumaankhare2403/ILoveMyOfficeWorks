import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

/// Lightweight embedded HTTP server running on 127.0.0.1 (loopback only)
/// to serve the bundled web client assets offline with full WebAssembly,
/// ES Modules, Canvas, and Web Worker capability.
class LocalServerService {
  HttpServer? _server;
  int _port = 0;
  bool _isStarted = false;
  bool _useDevServer = false;
  String _devServerUrl = 'http://10.0.2.2:5173';

  int get port => _port;
  bool get isStarted => _isStarted;
  bool get useDevServer => _useDevServer;
  String get devServerUrl => _devServerUrl;

  void setUseDevServer(bool value, {String? customUrl}) {
    _useDevServer = value;
    if (customUrl != null && customUrl.isNotEmpty) {
      _devServerUrl = customUrl;
    }
  }

  /// Starts the loopback HTTP server
  Future<void> start() async {
    if (_isStarted && _server != null) return;

    try {
      // Bind exclusively to IPv4 loopback for 100% on-device privacy
      _server = await HttpServer.bind(InternetAddress.loopbackIPv4, 0);
      _port = _server!.port;
      _isStarted = true;

      debugPrint('ILoveMyOfficeWorks Local Server started on http://127.0.0.1:$_port');

      _server!.listen(
        _handleRequest,
        onError: (e) {
          debugPrint('LocalServer error: $e');
        },
      );
    } catch (e) {
      debugPrint('Failed to start local server: $e');
      _isStarted = false;
    }
  }

  /// Handles incoming HTTP requests and streams bundled assets
  Future<void> _handleRequest(HttpRequest request) async {
    final response = request.response;

    // Standard CORS headers for local loopback
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', '*');
    response.headers.set('Cache-Control', 'no-cache');

    if (request.method == 'OPTIONS') {
      response.statusCode = HttpStatus.ok;
      await response.close();
      return;
    }

    String path = request.uri.path;
    if (path.isEmpty || path == '/') {
      path = '/index.html';
    }

    // Clean relative path
    final relativePath = path.startsWith('/') ? path.substring(1) : path;
    final assetKey = 'assets/web/$relativePath';

    try {
      ByteData? byteData;

      try {
        byteData = await rootBundle.load(assetKey);
      } catch (_) {
        // Fallback to index.html for Single Page Application client routing
        try {
          byteData = await rootBundle.load('assets/web/index.html');
          path = '/index.html';
        } catch (err) {
          debugPrint('Asset not found: $assetKey ($err)');
        }
      }

      if (byteData == null) {
        response.statusCode = HttpStatus.notFound;
        response.write('Not Found: $path');
        await response.close();
        return;
      }

      // Determine MIME type
      final mimeType = _getMimeType(path);
      response.headers.set('Content-Type', mimeType);
      response.statusCode = HttpStatus.ok;

      // Stream bytes
      final bytes = byteData.buffer.asUint8List(byteData.offsetInBytes, byteData.lengthInBytes);
      response.add(bytes);
      await response.close();
    } catch (e) {
      debugPrint('Error serving $path: $e');
      try {
        response.statusCode = HttpStatus.internalServerError;
        response.write('Internal Server Error');
        await response.close();
      } catch (_) {}
    }
  }

  /// Maps file extensions to accurate MIME types
  String _getMimeType(String path) {
    final lower = path.toLowerCase();
    if (lower.endsWith('.html')) return 'text/html; charset=utf-8';
    if (lower.endsWith('.js') || lower.endsWith('.mjs')) return 'application/javascript; charset=utf-8';
    if (lower.endsWith('.css')) return 'text/css; charset=utf-8';
    if (lower.endsWith('.json')) return 'application/json; charset=utf-8';
    if (lower.endsWith('.png')) return 'image/png';
    if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
    if (lower.endsWith('.webp')) return 'image/webp';
    if (lower.endsWith('.svg')) return 'image/svg+xml';
    if (lower.endsWith('.ico')) return 'image/x-icon';
    if (lower.endsWith('.wasm')) return 'application/wasm';
    if (lower.endsWith('.woff')) return 'font/woff';
    if (lower.endsWith('.woff2')) return 'font/woff2';
    if (lower.endsWith('.ttf')) return 'font/ttf';
    if (lower.endsWith('.bcmap')) return 'application/octet-stream';
    if (lower.endsWith('.docx')) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    if (lower.endsWith('.pptx')) return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    if (lower.endsWith('.xlsx')) return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (lower.endsWith('.pdf')) return 'application/pdf';
    return 'application/octet-stream';
  }

  /// Returns URL for a specific tool or general app
  String getUrl({String? toolId}) {
    if (_useDevServer) {
      final base = _devServerUrl;
      return toolId != null ? '$base/?tool=$toolId' : base;
    }

    final base = 'http://127.0.0.1:$_port/index.html';
    return toolId != null ? '$base?tool=$toolId' : base;
  }

  /// Stops the local server
  Future<void> stop() async {
    if (_server != null) {
      await _server!.close(force: true);
      _server = null;
    }
    _isStarted = false;
  }
}

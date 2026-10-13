import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:file_picker/file_picker.dart';
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'local_storage_service.dart';
import '../widgets/download_success_sheet.dart';

class DocumentBridgeService {
  final BuildContext context;
  final Function(String toolId)? onToolChanged;

  DocumentBridgeService({
    required this.context,
    this.onToolChanged,
  });

  /// Handles incoming JSON messages from the client-side JavaScript engine
  Future<void> handleMessage(String rawJson) async {
    try {
      final Map<String, dynamic> data = jsonDecode(rawJson);
      final String type = data['type'] ?? '';

      switch (type) {
        case 'DOWNLOAD_FILE':
          await _handleDownloadFile(data);
          break;

        case 'SHARE_FILE':
          await _handleShareFile(data);
          break;

        case 'HAPTIC':
          HapticFeedback.lightImpact();
          break;

        case 'TOOL_CHANGED':
          final toolId = data['toolId'];
          if (toolId is String && onToolChanged != null) {
            onToolChanged!(toolId);
          }
          break;

        case 'CONSOLE_LOG':
          debugPrint('[WebLog] ${data['message']}');
          break;

        default:
          debugPrint('Unknown bridge message type: $type');
      }
    } catch (e) {
      debugPrint('Error parsing bridge message: $e\nRaw: $rawJson');
    }
  }

  /// Saves exported document directly to local storage without requiring permissions
  Future<void> _handleDownloadFile(Map<String, dynamic> data) async {
    final String filename = data['filename'] ?? 'document_${DateTime.now().millisecondsSinceEpoch}.pdf';
    final String base64Data = data['base64Data'] ?? '';
    final String mimeType = data['mimeType'] ?? 'application/octet-stream';
    final String? toolName = data['toolName'];

    if (base64Data.isEmpty) {
      _showSnackbar('File export failed: No data received', isError: true);
      return;
    }

    try {
      final bytes = base64Decode(base64Data);

      // Save directly to app-accessible local storage (0 permissions needed)
      final savedInfo = await LocalStorageService().saveFile(
        filename: filename,
        bytes: bytes,
        mimeType: mimeType,
        toolName: toolName,
      );

      HapticFeedback.mediumImpact();

      if (context.mounted) {
        // Display rich celebratory bottom sheet with direct Share & Saved Files actions
        await DownloadSuccessSheet.show(context, savedInfo);
      }
    } catch (e) {
      debugPrint('Error saving local file: $e');
      _showSnackbar('Error saving file: $e', isError: true);
    }
  }

  /// Triggers native Android system share sheet
  Future<void> _handleShareFile(Map<String, dynamic> data) async {
    final String filename = data['filename'] ?? 'shared_document.pdf';
    final String base64Data = data['base64Data'] ?? '';
    final String mimeType = data['mimeType'] ?? 'application/octet-stream';

    if (base64Data.isEmpty) return;

    try {
      final bytes = base64Decode(base64Data);
      final tempDir = await getTemporaryDirectory();
      final tempFile = File('${tempDir.path}/$filename');
      await tempFile.writeAsBytes(bytes);

      HapticFeedback.lightImpact();

      await SharePlus.instance.share(
        ShareParams(
          files: [XFile(tempFile.path, mimeType: mimeType, name: filename)],
          text: 'Processed with ILoveMyOfficeWorks (100% Private)',
        ),
      );
    } catch (e) {
      debugPrint('Error sharing file: $e');
    }
  }

  /// Opens native file picker and forwards picked files to the web engine
  Future<void> pickAndInjectFiles(
    WebViewController controller, {
    List<String>? allowedExtensions,
  }) async {
    try {
      final List<PlatformFile> pickedFiles = await FilePicker.pickFiles(
        type: (allowedExtensions != null && allowedExtensions.isNotEmpty)
            ? FileType.custom
            : FileType.any,
        allowedExtensions: allowedExtensions?.map((e) => e.replaceAll('.', '')).toList(),
      );

      if (pickedFiles.isEmpty) return;

      final List<Map<String, dynamic>> payload = [];

      for (final platformFile in pickedFiles) {
        final Uint8List bytes = await platformFile.xFile.readAsBytes();
        final int size = await platformFile.xFile.length();

        final b64 = base64Encode(bytes);
        final ext = platformFile.extension?.toLowerCase() ?? '';
        String mime = 'application/octet-stream';
        if (ext == 'pdf') {
          mime = 'application/pdf';
        } else if (ext == 'png') {
          mime = 'image/png';
        } else if (ext == 'jpg' || ext == 'jpeg') {
          mime = 'image/jpeg';
        } else if (ext == 'webp') {
          mime = 'image/webp';
        } else if (ext == 'docx') {
          mime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        } else if (ext == 'pptx') {
          mime = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        } else if (ext == 'xlsx') {
          mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        } else if (ext == 'csv') {
          mime = 'text/csv';
        }

        payload.add({
          'name': platformFile.name,
          'size': size,
          'type': mime,
          'data': b64,
        });
      }

      if (payload.isNotEmpty) {
        final jsonStr = jsonEncode(payload);
        final jsCode = '''
          if (window.flutterOpenFiles) {
            window.flutterOpenFiles($jsonStr);
          } else {
            console.log('flutterOpenFiles not yet registered in window');
          }
        ''';
        await controller.runJavaScript(jsCode);
        HapticFeedback.lightImpact();
      }
    } catch (e) {
      debugPrint('Error picking or injecting files: $e');
      _showSnackbar('Could not open file: $e', isError: true);
    }
  }

  void _showSnackbar(String message, {bool isError = false}) {
    if (!context.mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isError ? Colors.red.shade800 : null,
      ),
    );
  }
}

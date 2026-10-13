import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';

/// Represents a locally saved document processed offline
class SavedFileInfo {
  final String id;
  final String filename;
  final String path;
  final int sizeBytes;
  final String mimeType;
  final DateTime savedAt;
  final String? toolName;

  SavedFileInfo({
    required this.id,
    required this.filename,
    required this.path,
    required this.sizeBytes,
    required this.mimeType,
    required this.savedAt,
    this.toolName,
  });

  String get fileExtension {
    final dotIndex = filename.lastIndexOf('.');
    if (dotIndex != -1 && dotIndex < filename.length - 1) {
      return filename.substring(dotIndex + 1).toLowerCase();
    }
    return '';
  }

  String get formattedSize {
    if (sizeBytes <= 0) return '0 B';
    const suffixes = ['B', 'KB', 'MB', 'GB'];
    var i = 0;
    double size = sizeBytes.toDouble();
    while (size >= 1024 && i < suffixes.length - 1) {
      size /= 1024;
      i++;
    }
    return '${size.toStringAsFixed(size < 10 && i > 0 ? 1 : 0)} ${suffixes[i]}';
  }

  Map<String, dynamic> toMap() => {
        'id': id,
        'filename': filename,
        'path': path,
        'sizeBytes': sizeBytes,
        'mimeType': mimeType,
        'savedAt': savedAt.toIso8601String(),
        'toolName': toolName,
      };

  factory SavedFileInfo.fromMap(Map<String, dynamic> map) => SavedFileInfo(
        id: map['id'] ?? '',
        filename: map['filename'] ?? '',
        path: map['path'] ?? '',
        sizeBytes: map['sizeBytes'] ?? 0,
        mimeType: map['mimeType'] ?? 'application/octet-stream',
        savedAt: DateTime.tryParse(map['savedAt'] ?? '') ?? DateTime.now(),
        toolName: map['toolName'],
      );
}

/// Zero-Permission Local File Storage Manager for Android & Mobile.
///
/// Under Android 10+ (API 29–35) Scoped Storage guidelines, writing to app-specific
/// directories (via getExternalStorageDirectories or getApplicationDocumentsDirectory)
/// requires ZERO runtime permissions (neither READ nor WRITE nor MANAGE external storage).
class LocalStorageService {
  static final LocalStorageService _instance = LocalStorageService._internal();
  factory LocalStorageService() => _instance;
  LocalStorageService._internal();

  final ValueNotifier<int> savedFilesCount = ValueNotifier<int>(0);
  static const String _manifestFilename = 'saved_files_manifest.json';

  /// Resolves the optimal local storage directory requiring 0 runtime permissions
  Future<Directory> getDownloadsDirectory() async {
    Directory? baseDir;

    if (Platform.isAndroid) {
      try {
        // App-specific external Download folder: /storage/emulated/0/Android/data/<pkg>/files/Download
        // Requires 0 permissions across Android 10, 11, 12, 13, 14, and 15
        final extDownloads = await getExternalStorageDirectories(type: StorageDirectory.downloads);
        if (extDownloads != null && extDownloads.isNotEmpty) {
          baseDir = extDownloads.first;
        }
      } catch (_) {}

      if (baseDir == null) {
        try {
          baseDir = await getExternalStorageDirectory();
        } catch (_) {}
      }
    }

    baseDir ??= await getApplicationDocumentsDirectory();

    final targetDir = Directory('${baseDir.path}/ILoveMyOfficeWorks');
    if (!await targetDir.exists()) {
      await targetDir.create(recursive: true);
    }
    return targetDir;
  }

  /// Internal path for storing metadata index
  Future<File> _getManifestFile() async {
    final docs = await getApplicationDocumentsDirectory();
    return File('${docs.path}/$_manifestFilename');
  }

  /// Saves document bytes directly to local storage without prompting for permissions
  Future<SavedFileInfo> saveFile({
    required String filename,
    required Uint8List bytes,
    String mimeType = 'application/octet-stream',
    String? toolName,
  }) async {
    final dir = await getDownloadsDirectory();
    final cleanName = _resolveUniqueFilename(dir, filename);
    final filePath = '${dir.path}/$cleanName';

    final file = File(filePath);
    await file.writeAsBytes(bytes, flush: true);

    final info = SavedFileInfo(
      id: '${DateTime.now().millisecondsSinceEpoch}_${bytes.length}',
      filename: cleanName,
      path: filePath,
      sizeBytes: bytes.length,
      mimeType: mimeType,
      savedAt: DateTime.now(),
      toolName: toolName,
    );

    await _recordToManifest(info);
    await refreshCount();

    return info;
  }

  /// Resolves unique filename by appending (1), (2) if a file with same name exists
  String _resolveUniqueFilename(Directory dir, String originalName) {
    var checkFile = File('${dir.path}/$originalName');
    if (!checkFile.existsSync()) {
      return originalName;
    }

    final dotIndex = originalName.lastIndexOf('.');
    final namePart = dotIndex != -1 ? originalName.substring(0, dotIndex) : originalName;
    final extPart = dotIndex != -1 ? originalName.substring(dotIndex) : '';

    int counter = 1;
    while (checkFile.existsSync()) {
      final candidate = '$namePart ($counter)$extPart';
      checkFile = File('${dir.path}/$candidate');
      if (!checkFile.existsSync()) {
        return candidate;
      }
      counter++;
    }
    return originalName;
  }

  /// Records saved file info in manifest
  Future<void> _recordToManifest(SavedFileInfo info) async {
    try {
      final manifestFile = await _getManifestFile();
      List<Map<String, dynamic>> items = [];

      if (await manifestFile.exists()) {
        final content = await manifestFile.readAsString();
        if (content.isNotEmpty) {
          final decoded = jsonDecode(content);
          if (decoded is List) {
            items = List<Map<String, dynamic>>.from(decoded);
          }
        }
      }

      // Add newest file to the beginning
      items.insert(0, info.toMap());

      await manifestFile.writeAsString(jsonEncode(items), flush: true);
    } catch (e) {
      debugPrint('Error updating local storage manifest: $e');
    }
  }

  /// Retrieves list of all locally saved documents (sorted newest first)
  Future<List<SavedFileInfo>> getSavedFiles() async {
    try {
      final manifestFile = await _getManifestFile();
      if (!await manifestFile.exists()) {
        // Fallback: scan downloads directory directly
        return await _scanDirectoryForFiles();
      }

      final content = await manifestFile.readAsString();
      if (content.isEmpty) return [];

      final decoded = jsonDecode(content);
      if (decoded is! List) return [];

      final List<SavedFileInfo> validList = [];
      final List<Map<String, dynamic>> cleanedManifest = [];

      for (final item in decoded) {
        if (item is Map<String, dynamic>) {
          final info = SavedFileInfo.fromMap(item);
          // Verify file still exists on disk
          if (File(info.path).existsSync()) {
            validList.add(info);
            cleanedManifest.add(info.toMap());
          }
        }
      }

      // Keep manifest in sync if any files were deleted externally
      if (cleanedManifest.length != decoded.length) {
        await manifestFile.writeAsString(jsonEncode(cleanedManifest), flush: true);
      }

      savedFilesCount.value = validList.length;
      return validList;
    } catch (e) {
      debugPrint('Error reading saved files: $e');
      return await _scanDirectoryForFiles();
    }
  }

  /// Fallback scanner for documents if manifest is missing
  Future<List<SavedFileInfo>> _scanDirectoryForFiles() async {
    final dir = await getDownloadsDirectory();
    final List<SavedFileInfo> results = [];

    if (await dir.exists()) {
      final entities = dir.listSync();
      for (final entity in entities) {
        if (entity is File && !entity.path.endsWith('.json')) {
          final stat = entity.statSync();
          final name = entity.uri.pathSegments.last;
          results.add(
            SavedFileInfo(
              id: entity.path,
              filename: name,
              path: entity.path,
              sizeBytes: stat.size,
              mimeType: _guessMimeType(name),
              savedAt: stat.modified,
            ),
          );
        }
      }
    }
    results.sort((a, b) => b.savedAt.compareTo(a.savedAt));
    savedFilesCount.value = results.length;
    return results;
  }

  /// Deletes a saved file from disk and updates manifest
  Future<bool> deleteFile(SavedFileInfo info) async {
    try {
      final file = File(info.path);
      if (await file.exists()) {
        await file.delete();
      }

      final manifestFile = await _getManifestFile();
      if (await manifestFile.exists()) {
        final content = await manifestFile.readAsString();
        if (content.isNotEmpty) {
          final decoded = jsonDecode(content);
          if (decoded is List) {
            final updated = decoded.where((item) => item['id'] != info.id && item['path'] != info.path).toList();
            await manifestFile.writeAsString(jsonEncode(updated), flush: true);
          }
        }
      }

      await refreshCount();
      return true;
    } catch (e) {
      debugPrint('Error deleting file: $e');
      return false;
    }
  }

  /// Shares a locally saved file using the system share sheet
  Future<void> shareFile(SavedFileInfo info) async {
    await SharePlus.instance.share(
      ShareParams(
        files: [
          XFile(
            info.path,
            mimeType: info.mimeType,
            name: info.filename,
          )
        ],
        text: 'Processed with ILoveMyOfficeWorks (100% Private Offline)',
      ),
    );
  }

  /// Refreshes badge count
  Future<void> refreshCount() async {
    final files = await getSavedFiles();
    savedFilesCount.value = files.length;
  }

  String _guessMimeType(String filename) {
    final lower = filename.toLowerCase();
    if (lower.endsWith('.pdf')) return 'application/pdf';
    if (lower.endsWith('.docx')) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    if (lower.endsWith('.pptx')) return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    if (lower.endsWith('.xlsx')) return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (lower.endsWith('.zip')) return 'application/zip';
    if (lower.endsWith('.png')) return 'image/png';
    if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
    if (lower.endsWith('.webp')) return 'image/webp';
    if (lower.endsWith('.csv')) return 'text/csv';
    return 'application/octet-stream';
  }
}

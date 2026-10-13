import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../services/local_storage_service.dart';
import '../theme/app_theme.dart';
import '../screens/saved_files_screen.dart';

/// Modal bottom sheet presented upon completing a document conversion/export.
/// Demonstrates that local file download completed with zero storage permissions.
class DownloadSuccessSheet extends StatelessWidget {
  final SavedFileInfo fileInfo;

  const DownloadSuccessSheet({
    super.key,
    required this.fileInfo,
  });

  static Future<void> show(BuildContext context, SavedFileInfo fileInfo) {
    HapticFeedback.mediumImpact();
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => DownloadSuccessSheet(fileInfo: fileInfo),
    );
  }

  IconData _getFileIcon() {
    switch (fileInfo.fileExtension) {
      case 'pdf':
        return Icons.picture_as_pdf_rounded;
      case 'docx':
        return Icons.description_rounded;
      case 'pptx':
        return Icons.slideshow_rounded;
      case 'xlsx':
      case 'csv':
        return Icons.table_chart_rounded;
      case 'zip':
        return Icons.folder_zip_rounded;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'webp':
        return Icons.image_rounded;
      default:
        return Icons.insert_drive_file_rounded;
    }
  }

  Color _getFileColor() {
    switch (fileInfo.fileExtension) {
      case 'pdf':
        return const Color(0xFFC53030);
      case 'docx':
        return const Color(0xFF2B6CB0);
      case 'pptx':
        return const Color(0xFFDD6B20);
      case 'xlsx':
      case 'csv':
        return const Color(0xFF2F855A);
      case 'zip':
        return const Color(0xFFD69E2E);
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'webp':
        return const Color(0xFF805AD5);
      default:
        return AppTheme.primarySage;
    }
  }

  @override
  Widget build(BuildContext context) {
    final fileIcon = _getFileIcon();
    final fileColor = _getFileColor();
    final screenSize = MediaQuery.sizeOf(context);

    return Center(
      child: ConstrainedBox(
        constraints: BoxConstraints(
          maxWidth: 540,
          maxHeight: screenSize.height * 0.90,
        ),
        child: Container(
          decoration: const BoxDecoration(
            color: AppTheme.creamBg,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
            border: Border(
              top: BorderSide(color: AppTheme.borderLight, width: 1.5),
            ),
          ),
          child: SingleChildScrollView(
            padding: EdgeInsets.fromLTRB(
              20,
              12,
              20,
              MediaQuery.of(context).padding.bottom + 20,
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Drag handle
                Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: AppTheme.borderMedium,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
                const SizedBox(height: 16),

                // Success indicator with luxury sage glow
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    color: AppTheme.sageTint,
                    shape: BoxShape.circle,
                    border: Border.all(color: AppTheme.primarySage.withValues(alpha: 0.3), width: 2),
                    boxShadow: [
                      BoxShadow(
                        color: AppTheme.primarySage.withValues(alpha: 0.15),
                        blurRadius: 16,
                        spreadRadius: 2,
                      ),
                    ],
                  ),
                  child: const Icon(
                    Icons.check_rounded,
                    color: AppTheme.primarySage,
                    size: 34,
                  ),
                ),
                const SizedBox(height: 12),

                // Title
                const Text(
                  'Document Ready!',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w800,
                    color: AppTheme.textPrimary,
                    letterSpacing: -0.3,
                  ),
                ),
                const SizedBox(height: 6),

                // Zero-Permission Badge
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppTheme.sageLight,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppTheme.primarySage.withValues(alpha: 0.25)),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.shield_outlined, size: 14, color: AppTheme.forestDark),
                      SizedBox(width: 6),
                      Flexible(
                        child: Text(
                          'Saved to Local Storage • Zero Permissions Needed',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            color: AppTheme.forestDark,
                          ),
                          textAlign: TextAlign.center,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // File Card
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppTheme.borderLight),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.02),
                        blurRadius: 6,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 44,
                            height: 44,
                            decoration: BoxDecoration(
                              color: fileColor.withValues(alpha: 0.12),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Icon(fileIcon, color: fileColor, size: 24),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  fileInfo.filename,
                                  style: const TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
                                    color: AppTheme.textPrimary,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                const SizedBox(height: 3),
                                Text(
                                  '${fileInfo.formattedSize} • ${fileInfo.fileExtension.toUpperCase()}',
                                  style: const TextStyle(
                                    fontSize: 12,
                                    color: AppTheme.textSecondary,
                                    fontFamily: 'monospace',
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      const Divider(height: 1, color: AppTheme.borderLight),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          const Icon(Icons.folder_outlined, size: 14, color: AppTheme.textMuted),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              fileInfo.path,
                              style: const TextStyle(
                                fontSize: 10,
                                color: AppTheme.textMuted,
                                fontFamily: 'monospace',
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          InkWell(
                            onTap: () {
                              Clipboard.setData(ClipboardData(text: fileInfo.path));
                              HapticFeedback.selectionClick();
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('File path copied to clipboard'),
                                  duration: Duration(seconds: 2),
                                ),
                              );
                            },
                            child: const Padding(
                              padding: EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                              child: Text(
                                'Copy',
                                style: TextStyle(
                                  fontSize: 11,
                                  color: AppTheme.primarySage,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 18),

                // Action Buttons with responsive layout
                LayoutBuilder(
                  builder: (context, constraints) {
                    final isNarrow = constraints.maxWidth < 340;
                    if (isNarrow) {
                      return Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          ElevatedButton.icon(
                            onPressed: () {
                              HapticFeedback.lightImpact();
                              LocalStorageService().shareFile(fileInfo);
                            },
                            icon: const Icon(Icons.share_rounded, size: 18),
                            label: const Text('Share / Send File'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppTheme.primarySage,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 13),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                            ),
                          ),
                          const SizedBox(height: 8),
                          OutlinedButton.icon(
                            onPressed: () {
                              Navigator.pop(context);
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (_) => const SavedFilesScreen()),
                              );
                            },
                            icon: const Icon(Icons.folder_rounded, size: 18),
                            label: const Text('Saved Files'),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: AppTheme.forestDark,
                              side: const BorderSide(color: AppTheme.borderMedium),
                              padding: const EdgeInsets.symmetric(vertical: 13),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                            ),
                          ),
                        ],
                      );
                    }
                    return Row(
                      children: [
                        Expanded(
                          flex: 3,
                          child: ElevatedButton.icon(
                            onPressed: () {
                              HapticFeedback.lightImpact();
                              LocalStorageService().shareFile(fileInfo);
                            },
                            icon: const Icon(Icons.share_rounded, size: 18),
                            label: const Text('Share / Send File', overflow: TextOverflow.ellipsis),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppTheme.primarySage,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          flex: 2,
                          child: OutlinedButton.icon(
                            onPressed: () {
                              Navigator.pop(context);
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (_) => const SavedFilesScreen()),
                              );
                            },
                            icon: const Icon(Icons.folder_rounded, size: 18),
                            label: const Text('Saved Files', overflow: TextOverflow.ellipsis),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: AppTheme.forestDark,
                              side: const BorderSide(color: AppTheme.borderMedium),
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                            ),
                          ),
                        ),
                      ],
                    );
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../services/local_storage_service.dart';
import '../theme/app_theme.dart';
import '../widgets/bouncing_card.dart';

/// Screen displaying all locally saved files without requiring any Android storage permissions.
class SavedFilesScreen extends StatefulWidget {
  const SavedFilesScreen({super.key});

  @override
  State<SavedFilesScreen> createState() => _SavedFilesScreenState();
}

class _SavedFilesScreenState extends State<SavedFilesScreen> {
  final LocalStorageService _storageService = LocalStorageService();
  List<SavedFileInfo> _allFiles = [];
  bool _isLoading = true;
  String _searchQuery = '';
  String _selectedExtension = 'all';
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadFiles();
  }

  Future<void> _loadFiles() async {
    setState(() => _isLoading = true);
    final files = await _storageService.getSavedFiles();
    if (mounted) {
      setState(() {
        _allFiles = files;
        _isLoading = false;
      });
    }
  }

  List<SavedFileInfo> get _filteredFiles {
    return _allFiles.where((file) {
      final matchesSearch = _searchQuery.isEmpty ||
          file.filename.toLowerCase().contains(_searchQuery.toLowerCase());

      final ext = file.fileExtension.toLowerCase();
      bool matchesType = true;
      if (_selectedExtension == 'pdf') {
        matchesType = ext == 'pdf';
      } else if (_selectedExtension == 'docx') {
        matchesType = ext == 'docx' || ext == 'doc';
      } else if (_selectedExtension == 'images') {
        matchesType = ['png', 'jpg', 'jpeg', 'webp'].contains(ext);
      } else if (_selectedExtension == 'zip') {
        matchesType = ext == 'zip';
      }

      return matchesSearch && matchesType;
    }).toList();
  }

  int get _totalSizeBytes {
    return _allFiles.fold(0, (acc, file) => acc + file.sizeBytes);
  }

  String _formatTotalSize(int totalBytes) {
    if (totalBytes <= 0) return '0 B';
    const suffixes = ['B', 'KB', 'MB', 'GB'];
    var i = 0;
    double size = totalBytes.toDouble();
    while (size >= 1024 && i < suffixes.length - 1) {
      size /= 1024;
      i++;
    }
    return '${size.toStringAsFixed(1)} ${suffixes[i]}';
  }

  Future<void> _confirmDelete(SavedFileInfo file) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.creamBg,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        title: const Text('Delete Document?', style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold)),
        content: Text('Are you sure you want to delete "${file.filename}" from local storage?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: FilledButton.styleFrom(backgroundColor: const Color(0xFFC53030)),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirm == true) {
      HapticFeedback.lightImpact();
      final success = await _storageService.deleteFile(file);
      if (success && mounted) {
        _loadFiles();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Deleted ${file.filename}'),
            duration: const Duration(seconds: 2),
          ),
        );
      }
    }
  }

  IconData _getFileIcon(String ext) {
    switch (ext) {
      case 'pdf':
        return Icons.picture_as_pdf_rounded;
      case 'docx':
      case 'doc':
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

  Color _getFileColor(String ext) {
    switch (ext) {
      case 'pdf':
        return const Color(0xFFC53030);
      case 'docx':
      case 'doc':
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

  String _formatDate(DateTime dt) {
    final now = DateTime.now();
    final difference = now.difference(dt);

    if (difference.inMinutes < 1) {
      return 'Just now';
    } else if (difference.inHours < 1) {
      return '${difference.inMinutes}m ago';
    } else if (difference.inDays < 1) {
      return '${difference.inHours}h ago';
    } else if (difference.inDays < 7) {
      return '${difference.inDays}d ago';
    } else {
      return '${dt.day}/${dt.month}/${dt.year}';
    }
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _filteredFiles;

    return Scaffold(
      appBar: AppBar(
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Saved Documents',
              style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: AppTheme.textPrimary),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            Text(
              'Local Storage • Zero Permissions Required',
              style: TextStyle(fontSize: 11, color: AppTheme.textSecondary, fontWeight: FontWeight.w500),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded, color: AppTheme.forestDark),
            tooltip: 'Refresh',
            onPressed: () {
              HapticFeedback.lightImpact();
              _loadFiles();
            },
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 720),
            child: Column(
              children: [
                // Storage Summary Card
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                decoration: BoxDecoration(
                  color: AppTheme.sageTint,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppTheme.primarySage.withValues(alpha: 0.2)),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(6),
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.shield_outlined, color: AppTheme.primarySage, size: 16),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        '${_allFiles.length} files saved (${_formatTotalSize(_totalSizeBytes)})',
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: AppTheme.forestDark,
                        ),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: AppTheme.primarySage.withValues(alpha: 0.2)),
                      ),
                      child: const Text(
                        '100% Private',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                          color: AppTheme.forestDark,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Search Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              child: TextField(
                controller: _searchController,
                onChanged: (val) => setState(() => _searchQuery = val),
                decoration: InputDecoration(
                  hintText: 'Search saved files...',
                  hintStyle: const TextStyle(fontSize: 13, color: AppTheme.textMuted),
                  prefixIcon: const Icon(Icons.search_rounded, color: AppTheme.textSecondary, size: 20),
                  suffixIcon: _searchQuery.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.clear_rounded, size: 18),
                          onPressed: () {
                            _searchController.clear();
                            setState(() => _searchQuery = '');
                          },
                        )
                      : null,
                  filled: true,
                  fillColor: Colors.white,
                  contentPadding: const EdgeInsets.symmetric(vertical: 8),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: AppTheme.borderLight),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: AppTheme.borderLight),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: AppTheme.primarySage, width: 1.5),
                  ),
                ),
                style: const TextStyle(fontSize: 13),
              ),
            ),

            // Filter Chips
            SizedBox(
              height: 44,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                children: [
                  _buildTypeChip('All', 'all'),
                  _buildTypeChip('PDF', 'pdf'),
                  _buildTypeChip('Word', 'docx'),
                  _buildTypeChip('Images', 'images'),
                  _buildTypeChip('ZIP', 'zip'),
                ],
              ),
            ),

            // File List
            Expanded(
              child: _isLoading
                  ? const Center(
                      child: CircularProgressIndicator(color: AppTheme.primarySage),
                    )
                  : filtered.isEmpty
                      ? _buildEmptyState()
                      : ListView.separated(
                          padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
                          itemCount: filtered.length,
                          separatorBuilder: (context, index) => const SizedBox(height: 10),
                          itemBuilder: (context, index) {
                            final file = filtered[index];
                            final icon = _getFileIcon(file.fileExtension);
                            final color = _getFileColor(file.fileExtension);

                            return BouncingCard(
                              onTap: () {
                                HapticFeedback.lightImpact();
                                _storageService.shareFile(file);
                              },
                              borderRadius: BorderRadius.circular(16),
                              padding: const EdgeInsets.all(12),
                              child: Row(
                                children: [
                                  Container(
                                    width: 44,
                                    height: 44,
                                    decoration: BoxDecoration(
                                      color: color.withValues(alpha: 0.12),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Icon(icon, color: color, size: 22),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          file.filename,
                                          style: const TextStyle(
                                            fontSize: 13,
                                            fontWeight: FontWeight.bold,
                                            color: AppTheme.textPrimary,
                                          ),
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                        const SizedBox(height: 3),
                                        Wrap(
                                          crossAxisAlignment: WrapCrossAlignment.center,
                                          spacing: 6,
                                          runSpacing: 2,
                                          children: [
                                            Text(
                                              file.formattedSize,
                                              style: const TextStyle(
                                                fontSize: 11,
                                                color: AppTheme.textSecondary,
                                                fontFamily: 'monospace',
                                                fontWeight: FontWeight.w600,
                                              ),
                                            ),
                                            const Text('•', style: TextStyle(color: AppTheme.borderMedium)),
                                            Text(
                                              _formatDate(file.savedAt),
                                              style: const TextStyle(
                                                fontSize: 11,
                                                color: AppTheme.textMuted,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                                  // Quick Share
                                  IconButton(
                                    visualDensity: VisualDensity.compact,
                                    padding: const EdgeInsets.all(6),
                                    constraints: const BoxConstraints(minWidth: 34, minHeight: 34),
                                    icon: const Icon(Icons.share_rounded, size: 19, color: AppTheme.primarySage),
                                    tooltip: 'Share',
                                    onPressed: () {
                                      HapticFeedback.lightImpact();
                                      _storageService.shareFile(file);
                                    },
                                  ),
                                  // Delete
                                  IconButton(
                                    visualDensity: VisualDensity.compact,
                                    padding: const EdgeInsets.all(6),
                                    constraints: const BoxConstraints(minWidth: 34, minHeight: 34),
                                    icon: Icon(Icons.delete_outline_rounded, size: 19, color: Colors.red.shade400),
                                    tooltip: 'Delete',
                                    onPressed: () => _confirmDelete(file),
                                  ),
                                ],
                              ),
                            );
                          },
                        ),
            ),
          ],
        ),
      ),
    ),
  ),
);
  }

  Widget _buildTypeChip(String label, String value) {
    final isSelected = _selectedExtension == value;
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: GestureDetector(
        onTap: () {
          HapticFeedback.selectionClick();
          setState(() => _selectedExtension = value);
        },
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
          decoration: BoxDecoration(
            color: isSelected ? AppTheme.primarySage : Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: isSelected ? AppTheme.primarySage : AppTheme.borderLight,
            ),
          ),
          child: Center(
            child: Text(
              label,
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: isSelected ? Colors.white : AppTheme.forestDark,
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 72,
              height: 72,
              decoration: BoxDecoration(
                color: AppTheme.sageTint,
                shape: BoxShape.circle,
                border: Border.all(color: AppTheme.primarySage.withValues(alpha: 0.2)),
              ),
              child: const Icon(
                Icons.folder_open_rounded,
                size: 36,
                color: AppTheme.primarySage,
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'No Saved Files Yet',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: AppTheme.textPrimary,
              ),
            ),
            const SizedBox(height: 6),
            const Text(
              'Documents you merge, convert, or compress will be saved directly into local storage without requiring permissions.',
              style: TextStyle(fontSize: 12, color: AppTheme.textSecondary, height: 1.35),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

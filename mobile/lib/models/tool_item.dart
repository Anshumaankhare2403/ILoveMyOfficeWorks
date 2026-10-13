import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

enum ToolCategory {
  organize,
  optimize,
  convertToPdf,
  convertFromPdf,
  edit,
  security,
  image,
}

extension ToolCategoryExtension on ToolCategory {
  String get title {
    switch (this) {
      case ToolCategory.organize:
        return 'Organize PDF';
      case ToolCategory.optimize:
        return 'Optimize PDF';
      case ToolCategory.convertToPdf:
        return 'Convert to PDF';
      case ToolCategory.convertFromPdf:
        return 'Convert from PDF';
      case ToolCategory.edit:
        return 'Edit PDF';
      case ToolCategory.security:
        return 'PDF Security';
      case ToolCategory.image:
        return 'Image Tools';
    }
  }

  Color get badgeColor {
    switch (this) {
      case ToolCategory.organize:
        return AppTheme.badgeOrganize;
      case ToolCategory.optimize:
        return AppTheme.badgeOptimize;
      case ToolCategory.convertToPdf:
        return AppTheme.badgeConvert;
      case ToolCategory.convertFromPdf:
        return AppTheme.primarySage;
      case ToolCategory.edit:
        return AppTheme.badgeEdit;
      case ToolCategory.security:
        return AppTheme.badgeSecurity;
      case ToolCategory.image:
        return AppTheme.sageAccent;
    }
  }
}

class ToolItem {
  final String id;
  final String name;
  final ToolCategory category;
  final String description;
  final IconData icon;
  final List<String> supportedExtensions;
  final bool isFeatured;

  const ToolItem({
    required this.id,
    required this.name,
    required this.category,
    required this.description,
    required this.icon,
    this.supportedExtensions = const ['.pdf'],
    this.isFeatured = false,
  });

  static const List<ToolItem> allTools = [
    // 1. Organize PDF
    ToolItem(
      id: 'merge-pdf',
      name: 'Merge PDF',
      category: ToolCategory.organize,
      description: 'Combine multiple PDF documents sequentially with custom page ordering.',
      icon: Icons.layers_rounded,
      isFeatured: true,
    ),
    ToolItem(
      id: 'split-pdf',
      name: 'Split PDF',
      category: ToolCategory.organize,
      description: 'Extract specific page ranges or divide documents into fixed chunks.',
      icon: Icons.content_cut_rounded,
      isFeatured: true,
    ),
    ToolItem(
      id: 'remove-pages',
      name: 'Remove Pages',
      category: ToolCategory.organize,
      description: 'Delete unwanted or blank pages and generate a clean PDF.',
      icon: Icons.delete_outline_rounded,
    ),
    ToolItem(
      id: 'extract-pages',
      name: 'Extract Pages',
      category: ToolCategory.organize,
      description: 'Extract selected pages from any PDF into a brand-new file.',
      icon: Icons.file_download_outlined,
    ),
    ToolItem(
      id: 'organize-pdf',
      name: 'Organize PDF',
      category: ToolCategory.organize,
      description: 'Rearrange, reverse, and duplicate pages in custom order.',
      icon: Icons.swap_vert_rounded,
    ),
    ToolItem(
      id: 'scan-to-pdf',
      name: 'Scan to PDF',
      category: ToolCategory.organize,
      description: 'Convert camera photo scans into clean high-contrast documents.',
      icon: Icons.camera_alt_outlined,
      supportedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
    ),

    // 2. Optimize PDF
    ToolItem(
      id: 'compress-pdf',
      name: 'Compress PDF',
      category: ToolCategory.optimize,
      description: 'Shrink file size with canvas downsampling and stream compression.',
      icon: Icons.compress_rounded,
      isFeatured: true,
    ),
    ToolItem(
      id: 'repair-pdf',
      name: 'Repair PDF',
      category: ToolCategory.optimize,
      description: 'Analyze corrupted or damaged structures and rebuild intact streams.',
      icon: Icons.build_outlined,
    ),
    ToolItem(
      id: 'ocr-pdf',
      name: 'OCR PDF',
      category: ToolCategory.optimize,
      description: 'Recognize text in scanned documents and extract text overlays.',
      icon: Icons.document_scanner_outlined,
    ),

    // 3. Convert to PDF
    ToolItem(
      id: 'jpg-to-pdf',
      name: 'JPG to PDF',
      category: ToolCategory.convertToPdf,
      description: 'Convert photos and images into a single formatted PDF document.',
      icon: Icons.image_outlined,
      supportedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
      isFeatured: true,
    ),
    ToolItem(
      id: 'word-to-pdf',
      name: 'Word to PDF',
      category: ToolCategory.convertToPdf,
      description: 'Convert Microsoft Word documents (.docx) into clean vector PDFs.',
      icon: Icons.description_outlined,
      supportedExtensions: ['.docx'],
    ),
    ToolItem(
      id: 'powerpoint-to-pdf',
      name: 'PowerPoint to PDF',
      category: ToolCategory.convertToPdf,
      description: 'Convert PowerPoint (.pptx) presentations into landscape slides.',
      icon: Icons.slideshow_rounded,
      supportedExtensions: ['.pptx'],
    ),
    ToolItem(
      id: 'excel-to-pdf',
      name: 'Excel to PDF',
      category: ToolCategory.convertToPdf,
      description: 'Convert Excel spreadsheets and CSV tables into PDF tables.',
      icon: Icons.table_chart_outlined,
      supportedExtensions: ['.csv', '.xlsx'],
    ),
    ToolItem(
      id: 'html-to-pdf',
      name: 'HTML to PDF',
      category: ToolCategory.convertToPdf,
      description: 'Convert HTML documents and web pages into printable PDFs.',
      icon: Icons.language_rounded,
      supportedExtensions: ['.html', '.htm', '.txt'],
    ),

    // 4. Convert from PDF
    ToolItem(
      id: 'pdf-to-jpg',
      name: 'PDF to JPG',
      category: ToolCategory.convertFromPdf,
      description: 'Extract pages as high-resolution JPG or PNG images and ZIP archive.',
      icon: Icons.photo_library_outlined,
      isFeatured: true,
    ),
    ToolItem(
      id: 'pdf-to-docx',
      name: 'PDF to Word',
      category: ToolCategory.convertFromPdf,
      description: 'Convert PDF into fully editable Microsoft Word (.docx) documents.',
      icon: Icons.article_outlined,
      isFeatured: true,
    ),
    ToolItem(
      id: 'pdf-to-powerpoint',
      name: 'PDF to PowerPoint',
      category: ToolCategory.convertFromPdf,
      description: 'Convert PDF document pages into PowerPoint presentation slides.',
      icon: Icons.co_present_outlined,
    ),
    ToolItem(
      id: 'pdf-to-excel',
      name: 'PDF to Excel',
      category: ToolCategory.convertFromPdf,
      description: 'Extract tables, numbers, and structured data into CSV spreadsheets.',
      icon: Icons.grid_on_rounded,
    ),
    ToolItem(
      id: 'pdf-to-pdfa',
      name: 'PDF to PDF/A',
      category: ToolCategory.convertFromPdf,
      description: 'Convert PDF documents into ISO-compliant archival standard.',
      icon: Icons.archive_outlined,
    ),

    // 5. Edit PDF
    ToolItem(
      id: 'rotate-pdf',
      name: 'Rotate PDF',
      category: ToolCategory.edit,
      description: 'Rotate all or specific pages clockwise by 90, 180, or 270 degrees.',
      icon: Icons.rotate_right_rounded,
    ),
    ToolItem(
      id: 'add-page-numbers',
      name: 'Add Page Numbers',
      category: ToolCategory.edit,
      description: 'Insert customizable page numbering, headers, and footers.',
      icon: Icons.format_list_numbered_rounded,
    ),
    ToolItem(
      id: 'add-watermark',
      name: 'Add Watermark',
      category: ToolCategory.edit,
      description: 'Stamp custom text or security watermarks across PDF pages.',
      icon: Icons.branding_watermark_outlined,
    ),
    ToolItem(
      id: 'crop-pdf',
      name: 'Crop PDF',
      category: ToolCategory.edit,
      description: 'Trim margins and remove unwanted white borders from pages.',
      icon: Icons.crop_rounded,
    ),

    // 6. Security
    ToolItem(
      id: 'unlock-pdf',
      name: 'Unlock PDF',
      category: ToolCategory.security,
      description: 'Remove password restrictions and unlock printing & copying.',
      icon: Icons.lock_open_rounded,
    ),
    ToolItem(
      id: 'protect-pdf',
      name: 'Protect PDF',
      category: ToolCategory.security,
      description: 'Encrypt your PDF with AES password protection.',
      icon: Icons.lock_outline_rounded,
    ),
    ToolItem(
      id: 'sign-pdf',
      name: 'Sign PDF',
      category: ToolCategory.security,
      description: 'Apply electronic signature badges and date certificates.',
      icon: Icons.draw_outlined,
    ),

    // 7. Image Tools
    ToolItem(
      id: 'merge-images',
      name: 'Merge Images',
      category: ToolCategory.image,
      description: 'Combine unlimited photos into a single PDF or stitched image.',
      icon: Icons.collections_outlined,
      supportedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
    ),
    ToolItem(
      id: 'compress-image',
      name: 'Compress Image',
      category: ToolCategory.image,
      description: 'Shrink image file size with canvas downsampling and re-encoding.',
      icon: Icons.photo_size_select_small_rounded,
      supportedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
    ),
  ];
}

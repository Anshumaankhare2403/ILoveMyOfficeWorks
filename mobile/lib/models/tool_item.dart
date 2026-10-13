import 'package:flutter/material.dart';

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
        return 'ORGANIZE PDF';
      case ToolCategory.optimize:
        return 'OPTIMIZE PDF';
      case ToolCategory.convertToPdf:
        return 'CONVERT TO PDF';
      case ToolCategory.convertFromPdf:
        return 'CONVERT FROM PDF';
      case ToolCategory.edit:
        return 'EDIT PDF';
      case ToolCategory.security:
        return 'PDF SECURITY';
      case ToolCategory.image:
        return 'IMAGE TOOLS';
    }
  }

  String get shortTitle {
    switch (this) {
      case ToolCategory.organize:
        return 'Organize';
      case ToolCategory.optimize:
        return 'Optimize';
      case ToolCategory.convertToPdf:
        return 'To PDF';
      case ToolCategory.convertFromPdf:
        return 'From PDF';
      case ToolCategory.edit:
        return 'Edit';
      case ToolCategory.security:
        return 'Security';
      case ToolCategory.image:
        return 'Images';
    }
  }

  Color get badgeColor {
    switch (this) {
      case ToolCategory.organize:
        return const Color(0xFFE11D48);
      case ToolCategory.optimize:
        return const Color(0xFF059669);
      case ToolCategory.convertToPdf:
        return const Color(0xFFD97706);
      case ToolCategory.convertFromPdf:
        return const Color(0xFF2563EB);
      case ToolCategory.edit:
        return const Color(0xFF4F46E5);
      case ToolCategory.security:
        return const Color(0xFF7C3AED);
      case ToolCategory.image:
        return const Color(0xFF0D9488);
    }
  }

  Color get headerBgColor {
    switch (this) {
      case ToolCategory.organize:
        return const Color(0xFFFFF1F2);
      case ToolCategory.optimize:
        return const Color(0xFFECFDF5);
      case ToolCategory.convertToPdf:
        return const Color(0xFFFFFBEB);
      case ToolCategory.convertFromPdf:
        return const Color(0xFFEFF6FF);
      case ToolCategory.edit:
        return const Color(0xFFEEF2FF);
      case ToolCategory.security:
        return const Color(0xFFF5F3FF);
      case ToolCategory.image:
        return const Color(0xFFF0FDFA);
    }
  }

  IconData get icon {
    switch (this) {
      case ToolCategory.organize:
        return Icons.layers_rounded;
      case ToolCategory.optimize:
        return Icons.compress_rounded;
      case ToolCategory.convertToPdf:
        return Icons.file_upload_outlined;
      case ToolCategory.convertFromPdf:
        return Icons.file_download_outlined;
      case ToolCategory.edit:
        return Icons.edit_note_rounded;
      case ToolCategory.security:
        return Icons.shield_outlined;
      case ToolCategory.image:
        return Icons.photo_library_outlined;
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
  final String? badge;
  final String? subtitle;
  final Color? iconColor;

  const ToolItem({
    required this.id,
    required this.name,
    required this.category,
    required this.description,
    required this.icon,
    this.supportedExtensions = const ['.pdf'],
    this.isFeatured = false,
    this.badge,
    this.subtitle,
    this.iconColor,
  });

  static const List<ToolItem> allTools = [
    // 1. Organize PDF (6 tools)
    ToolItem(
      id: 'merge-pdf',
      name: 'Merge PDF',
      category: ToolCategory.organize,
      description: 'Combine unlimited PDF documents sequentially with custom page ordering.',
      icon: Icons.layers_rounded,
      isFeatured: true,
      badge: 'Multi-PDF',
      subtitle: 'Combine',
      iconColor: Color(0xFFE11D48),
    ),
    ToolItem(
      id: 'split-pdf',
      name: 'Split PDF',
      category: ToolCategory.organize,
      description: 'Extract custom page ranges or break large documents into fixed chunks.',
      icon: Icons.content_cut_rounded,
      isFeatured: true,
      badge: 'Extractor',
      subtitle: 'Split',
      iconColor: Color(0xFFD97706),
    ),
    ToolItem(
      id: 'remove-pages',
      name: 'Remove pages',
      category: ToolCategory.organize,
      description: 'Delete unwanted or blank pages from your PDF document and download a clean file.',
      icon: Icons.delete_outline_rounded,
      subtitle: 'Delete',
      iconColor: Color(0xFFDC2626),
    ),
    ToolItem(
      id: 'extract-pages',
      name: 'Extract pages',
      category: ToolCategory.organize,
      description: 'Select specific pages or ranges from a PDF and extract them into a brand-new PDF.',
      icon: Icons.file_download_outlined,
      subtitle: 'Extract',
      iconColor: Color(0xFFEA580C),
    ),
    ToolItem(
      id: 'organize-pdf',
      name: 'Organize PDF',
      category: ToolCategory.organize,
      description: 'Reorder, reverse, rearrange, or duplicate pages in custom order sequence.',
      icon: Icons.swap_vert_rounded,
      subtitle: 'Reorder',
      iconColor: Color(0xFF4F46E5),
    ),
    ToolItem(
      id: 'scan-to-pdf',
      name: 'Scan to PDF',
      category: ToolCategory.organize,
      description: 'Convert captured camera photos and document scans into high-contrast clean PDF files.',
      icon: Icons.camera_alt_outlined,
      subtitle: 'Scan',
      iconColor: Color(0xFF059669),
      supportedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
    ),

    // 2. Optimize PDF (3 tools)
    ToolItem(
      id: 'compress-pdf',
      name: 'Compress PDF',
      category: ToolCategory.optimize,
      description: 'Shrink document size with smart image downsampling and bloat purging.',
      icon: Icons.compress_rounded,
      isFeatured: true,
      badge: 'Optimizer',
      subtitle: 'Optimize',
      iconColor: Color(0xFF059669),
    ),
    ToolItem(
      id: 'repair-pdf',
      name: 'Repair PDF',
      category: ToolCategory.optimize,
      description: 'Analyze corrupted, unreadable, or malformed structures and rebuild intact streams.',
      icon: Icons.build_outlined,
      subtitle: 'Repair',
      iconColor: Color(0xFF0D9488),
    ),
    ToolItem(
      id: 'ocr-pdf',
      name: 'OCR PDF',
      category: ToolCategory.optimize,
      description: 'Convert scanned PDF documents into searchable files with selectable text.',
      icon: Icons.document_scanner_outlined,
      subtitle: 'OCR Text',
      iconColor: Color(0xFF0284C7),
    ),

    // 3. Convert to PDF (5 tools)
    ToolItem(
      id: 'jpg-to-pdf',
      name: 'JPG to PDF',
      category: ToolCategory.convertToPdf,
      description: 'Convert photos and images into a single formatted PDF document.',
      icon: Icons.image_outlined,
      supportedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
      isFeatured: true,
      badge: 'Images',
      subtitle: 'Images to PDF',
      iconColor: Color(0xFFD97706),
    ),
    ToolItem(
      id: 'word-to-pdf',
      name: 'Word to PDF',
      category: ToolCategory.convertToPdf,
      description: 'Convert Microsoft Word documents (.docx) into clean vector PDFs.',
      icon: Icons.description_outlined,
      supportedExtensions: ['.docx'],
      subtitle: 'Word to PDF',
      iconColor: Color(0xFF2563EB),
    ),
    ToolItem(
      id: 'powerpoint-to-pdf',
      name: 'PowerPoint to PDF',
      category: ToolCategory.convertToPdf,
      description: 'Convert PowerPoint (.pptx) presentations into landscape slide PDFs.',
      icon: Icons.slideshow_rounded,
      supportedExtensions: ['.pptx'],
      subtitle: 'PPT to PDF',
      iconColor: Color(0xFFEA580C),
    ),
    ToolItem(
      id: 'excel-to-pdf',
      name: 'Excel to PDF',
      category: ToolCategory.convertToPdf,
      description: 'Convert Excel spreadsheets and CSV tables into formatted PDF reports.',
      icon: Icons.table_chart_outlined,
      supportedExtensions: ['.csv', '.xlsx'],
      subtitle: 'Excel to PDF',
      iconColor: Color(0xFF16A34A),
    ),
    ToolItem(
      id: 'html-to-pdf',
      name: 'HTML to PDF',
      category: ToolCategory.convertToPdf,
      description: 'Convert HTML documents and web pages into printable PDF pages.',
      icon: Icons.language_rounded,
      supportedExtensions: ['.html', '.htm', '.txt'],
      subtitle: 'HTML to PDF',
      iconColor: Color(0xFF4F46E5),
    ),

    // 4. Convert from PDF (5 tools)
    ToolItem(
      id: 'pdf-to-docx',
      name: 'PDF to WORD',
      category: ToolCategory.convertFromPdf,
      description: 'Convert PDF documents into fully editable Microsoft Word (.docx) files.',
      icon: Icons.article_outlined,
      isFeatured: true,
      badge: 'OpenXML',
      subtitle: 'Word (.docx)',
      iconColor: Color(0xFF2563EB),
    ),
    ToolItem(
      id: 'pdf-to-jpg',
      name: 'PDF to JPG',
      category: ToolCategory.convertFromPdf,
      description: 'Extract pages as high-resolution JPG or PNG images and ZIP archives.',
      icon: Icons.photo_library_outlined,
      subtitle: 'Extract Images',
      iconColor: Color(0xFF7C3AED),
    ),
    ToolItem(
      id: 'pdf-to-powerpoint',
      name: 'PDF to PowerPoint',
      category: ToolCategory.convertFromPdf,
      description: 'Convert PDF document pages into PowerPoint presentation slides.',
      icon: Icons.co_present_outlined,
      subtitle: 'PDF to PPT',
      iconColor: Color(0xFFEA580C),
    ),
    ToolItem(
      id: 'pdf-to-excel',
      name: 'PDF to Excel',
      category: ToolCategory.convertFromPdf,
      description: 'Extract tables, numbers, and structured data into CSV spreadsheets.',
      icon: Icons.grid_on_rounded,
      subtitle: 'PDF to CSV',
      iconColor: Color(0xFF16A34A),
    ),
    ToolItem(
      id: 'pdf-to-pdfa',
      name: 'PDF to PDF/A',
      category: ToolCategory.convertFromPdf,
      description: 'Convert PDF documents into ISO-compliant archival standard.',
      icon: Icons.archive_outlined,
      subtitle: 'Archival PDF/A',
      iconColor: Color(0xFF4B5563),
    ),

    // 5. Edit PDF (4 tools)
    ToolItem(
      id: 'rotate-pdf',
      name: 'Rotate PDF',
      category: ToolCategory.edit,
      description: 'Rotate all or specific pages clockwise by 90, 180, or 270 degrees.',
      icon: Icons.rotate_right_rounded,
      subtitle: 'Rotate',
      iconColor: Color(0xFF4F46E5),
    ),
    ToolItem(
      id: 'add-page-numbers',
      name: 'Add Page Numbers',
      category: ToolCategory.edit,
      description: 'Insert customizable page numbering, headers, and footers.',
      icon: Icons.format_list_numbered_rounded,
      subtitle: 'Page Numbers',
      iconColor: Color(0xFF0284C7),
    ),
    ToolItem(
      id: 'add-watermark',
      name: 'Add Watermark',
      category: ToolCategory.edit,
      description: 'Stamp custom text or security watermarks across PDF pages.',
      icon: Icons.branding_watermark_outlined,
      subtitle: 'Watermark',
      iconColor: Color(0xFF059669),
    ),
    ToolItem(
      id: 'crop-pdf',
      name: 'Crop PDF',
      category: ToolCategory.edit,
      description: 'Trim margins and remove unwanted white borders from pages.',
      icon: Icons.crop_rounded,
      subtitle: 'Crop Margins',
      iconColor: Color(0xFFD97706),
    ),

    // 6. Security (3 tools)
    ToolItem(
      id: 'unlock-pdf',
      name: 'Unlock PDF',
      category: ToolCategory.security,
      description: 'Remove password restrictions and unlock printing & copying.',
      icon: Icons.lock_open_rounded,
      subtitle: 'Remove Password',
      iconColor: Color(0xFF16A34A),
    ),
    ToolItem(
      id: 'protect-pdf',
      name: 'Protect PDF',
      category: ToolCategory.security,
      description: 'Encrypt your PDF with standard AES password protection.',
      icon: Icons.lock_outline_rounded,
      subtitle: 'Encrypt AES',
      iconColor: Color(0xFFDC2626),
    ),
    ToolItem(
      id: 'sign-pdf',
      name: 'Sign PDF',
      category: ToolCategory.security,
      description: 'Apply electronic signature badges and date certificates.',
      icon: Icons.draw_outlined,
      subtitle: 'E-Sign Badge',
      iconColor: Color(0xFF7C3AED),
    ),

    // 7. Image Tools (2 tools)
    ToolItem(
      id: 'merge-images',
      name: 'Merge Images',
      category: ToolCategory.image,
      description: 'Combine unlimited photos into a single PDF or stitched image.',
      icon: Icons.collections_outlined,
      subtitle: 'Stitch Photos',
      iconColor: Color(0xFF0D9488),
      supportedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
    ),
    ToolItem(
      id: 'compress-image',
      name: 'Compress Image',
      category: ToolCategory.image,
      description: 'Shrink image file size with canvas downsampling and re-encoding.',
      icon: Icons.photo_size_select_small_rounded,
      subtitle: 'Compress Image',
      iconColor: Color(0xFF0284C7),
      supportedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
    ),
  ];
}

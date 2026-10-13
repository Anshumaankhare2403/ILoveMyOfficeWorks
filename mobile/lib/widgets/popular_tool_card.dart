import 'package:flutter/material.dart';
import '../models/tool_item.dart';
import '../theme/app_theme.dart';
import 'bouncing_card.dart';

/// Prominent popular tool card matching user's design reference (Image 1 & Image 2)
class PopularToolCard extends StatelessWidget {
  final ToolItem tool;
  final VoidCallback onTap;

  const PopularToolCard({
    super.key,
    required this.tool,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final bool isDocx = tool.id == 'pdf-to-docx';
    final Color iconBoxColor = isDocx ? const Color(0xFF2563EB) : const Color(0xFF455835);

    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      child: BouncingCard(
        onTap: onTap,
        scaleFactor: 0.96,
        borderRadius: BorderRadius.circular(18),
        padding: const EdgeInsets.all(16),
        backgroundColor: Colors.white,
        border: Border.all(color: AppTheme.borderLight, width: 1.2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Row: Icon Container + Badge Pill
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // Deep Forest/Blue Icon Box with White Icon
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: iconBoxColor,
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [
                      BoxShadow(
                        color: iconBoxColor.withValues(alpha: 0.25),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Icon(tool.icon, color: Colors.white, size: 22),
                ),

                // Top Right Pill Badge (e.g. Multi-PDF, Extractor, Optimizer, OpenXML)
                if (tool.badge != null)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF1F5EC),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFFDDE5D6), width: 0.8),
                    ),
                    child: Text(
                      tool.badge!,
                      style: const TextStyle(
                        fontSize: 10.5,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF3F4D32),
                        letterSpacing: 0.2,
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 14),

            // Tool Title
            Text(
              tool.name,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w800,
                color: AppTheme.textPrimary,
                letterSpacing: -0.2,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 4),

            // Tool Description
            Text(
              tool.description,
              style: const TextStyle(
                fontSize: 12.5,
                color: AppTheme.textSecondary,
                height: 1.35,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 14),

            // Divider
            const Divider(height: 1, thickness: 0.8, color: Color(0xFFF0EBE4)),
            const SizedBox(height: 12),

            // Footer: "Open Tool ->"
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: const [
                Text(
                  'Open Tool',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                    color: AppTheme.primarySage,
                  ),
                ),
                Icon(
                  Icons.arrow_forward_rounded,
                  size: 16,
                  color: AppTheme.primarySage,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

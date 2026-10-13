import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../models/tool_item.dart';
import '../theme/app_theme.dart';
import 'bouncing_card.dart';

/// Grouped category accordion card matching user's design reference (Image 1 & Image 3)
class CategorySectionCard extends StatefulWidget {
  final ToolCategory category;
  final List<ToolItem> tools;
  final Function(ToolItem) onSelectTool;
  final bool initiallyExpanded;

  const CategorySectionCard({
    super.key,
    required this.category,
    required this.tools,
    required this.onSelectTool,
    this.initiallyExpanded = true,
  });

  @override
  State<CategorySectionCard> createState() => _CategorySectionCardState();
}

class _CategorySectionCardState extends State<CategorySectionCard> {
  late bool _isExpanded;

  @override
  void initState() {
    super.initState();
    _isExpanded = widget.initiallyExpanded;
  }

  @override
  Widget build(BuildContext context) {
    if (widget.tools.isEmpty) return const SizedBox.shrink();

    final cat = widget.category;
    final catColor = cat.badgeColor;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.borderLight, width: 1.2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: [
          // Header Bar
          Material(
            color: cat.headerBgColor,
            child: InkWell(
              onTap: () {
                HapticFeedback.selectionClick();
                setState(() => _isExpanded = !_isExpanded);
              },
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                decoration: BoxDecoration(
                  border: Border(
                    bottom: _isExpanded
                        ? BorderSide(color: catColor.withValues(alpha: 0.15), width: 1)
                        : BorderSide.none,
                  ),
                ),
                child: Row(
                  children: [
                    // Icon Box
                    Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        color: catColor.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Icon(cat.icon, color: catColor, size: 20),
                    ),
                    const SizedBox(width: 12),

                    // Title
                    Expanded(
                      child: Text(
                        cat.title,
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w800,
                          color: AppTheme.textPrimary,
                          letterSpacing: 0.3,
                        ),
                      ),
                    ),

                    // Count Badge
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2.5),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppTheme.borderLight, width: 0.8),
                      ),
                      child: Text(
                        widget.tools.length.toString(),
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w800,
                          color: catColor,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),

                    // Chevron
                    AnimatedRotation(
                      turns: _isExpanded ? 0.5 : 0.0,
                      duration: const Duration(milliseconds: 200),
                      child: Icon(
                        Icons.keyboard_arrow_down_rounded,
                        color: catColor,
                        size: 22,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Collapsible Tool List
          AnimatedCrossFade(
            firstChild: ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              padding: EdgeInsets.zero,
              itemCount: widget.tools.length,
              separatorBuilder: (context, index) => const Divider(
                height: 1,
                thickness: 0.8,
                color: Color(0xFFF3EFEA),
                indent: 62,
                endIndent: 16,
              ),
              itemBuilder: (context, index) {
                final tool = widget.tools[index];
                final itemColor = tool.iconColor ?? catColor;

                return BouncingCard(
                  onTap: () => widget.onSelectTool(tool),
                  scaleFactor: 0.98,
                  borderRadius: BorderRadius.zero,
                  backgroundColor: Colors.transparent,
                  border: const Border(),
                  boxShadow: const [],
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
                  child: Row(
                    children: [
                      // Tool Icon Box
                      Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          color: itemColor.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Icon(tool.icon, color: itemColor, size: 19),
                      ),
                      const SizedBox(width: 14),

                      // Tool Title & Subtitle
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              tool.name,
                              style: const TextStyle(
                                fontSize: 13.5,
                                fontWeight: FontWeight.w700,
                                color: AppTheme.textPrimary,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            if (tool.subtitle != null) ...[
                              const SizedBox(height: 2),
                              Text(
                                tool.subtitle!,
                                style: const TextStyle(
                                  fontSize: 11,
                                  color: AppTheme.textSecondary,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),

                      // Right Arrow
                      const Icon(
                        Icons.arrow_forward_rounded,
                        size: 16,
                        color: Color(0xFF9EAA94),
                      ),
                    ],
                  ),
                );
              },
            ),
            secondChild: const SizedBox.shrink(),
            crossFadeState: _isExpanded ? CrossFadeState.showFirst : CrossFadeState.showSecond,
            duration: const Duration(milliseconds: 220),
          ),
        ],
      ),
    );
  }
}

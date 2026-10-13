import 'package:flutter/material.dart';
import '../constants/app_constants.dart';
import '../theme/app_theme.dart';

/// Privacy & Architecture guarantee cards section matching user's reference (Image 4)
class PrivacyGuaranteeSection extends StatelessWidget {
  final VoidCallback? onVerifyAudit;

  const PrivacyGuaranteeSection({
    super.key,
    this.onVerifyAudit,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Card 1: 100% Client-Side
        _buildInfoCard(
          icon: Icons.shield_outlined,
          title: '100% Client-Side',
          description: 'Documents never leave your phone. All memory buffers stay in your local offline sandbox.',
        ),
        const SizedBox(height: 10),

        // Card 2: Native High Speed
        _buildInfoCard(
          icon: Icons.bolt_rounded,
          title: 'Native High Speed',
          description: 'Powered by native WebAssembly, Canvas rendering, pdf-lib, and OpenXML docx engines.',
        ),
        const SizedBox(height: 10),

        // Card 3: Zero Tracking or Cloud
        _buildInfoCard(
          icon: Icons.lock_outline_rounded,
          title: 'Zero Tracking or Cloud',
          description: 'Zero cookies, zero telemetry, zero cloud uploads. Completely private, offline, and secure.',
        ),
        const SizedBox(height: 10),

        // Card 4: Verification Summary with Audit Button
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: AppTheme.borderLight, width: 1.2),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.02),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Column(
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Icon(Icons.verified_user_outlined, color: AppTheme.primarySage, size: 22),
                  SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'All 35 tools run entirely client-side with zero external telemetry or cloud storage.',
                      style: TextStyle(
                        fontSize: 12.5,
                        color: AppTheme.forestDark,
                        height: 1.35,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
              if (onVerifyAudit != null) ...[
                const SizedBox(height: 12),
                OutlinedButton.icon(
                  onPressed: onVerifyAudit,
                  icon: const Icon(Icons.shield_outlined, size: 16),
                  label: const Text('Verify Offline Privacy Audit'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppTheme.forestDark,
                    side: const BorderSide(color: AppTheme.borderMedium),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  ),
                ),
              ],
            ],
          ),
        ),
        const SizedBox(height: 20),

        // Status Strip
        const Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircleAvatar(radius: 3.5, backgroundColor: AppTheme.primarySage),
            SizedBox(width: 8),
            Flexible(
              child: Text(
                '${AppConstants.appName} ${AppConstants.fullVersion} Engine Ready • 100% Client-Side',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.textSecondary,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
        const SizedBox(height: 24),
      ],
    );
  }

  Widget _buildInfoCard({
    required IconData icon,
    required String title,
    required String description,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppTheme.borderLight, width: 1.2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: AppTheme.sageTint,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: AppTheme.primarySage, size: 20),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w800,
                    color: AppTheme.textPrimary,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  description,
                  style: const TextStyle(
                    fontSize: 11.5,
                    color: AppTheme.textSecondary,
                    height: 1.3,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

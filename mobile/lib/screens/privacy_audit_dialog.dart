import 'package:flutter/material.dart';
import '../constants/app_constants.dart';
import '../theme/app_theme.dart';

class PrivacyAuditDialog extends StatelessWidget {
  final VoidCallback? onConfigureServer;

  const PrivacyAuditDialog({
    super.key,
    this.onConfigureServer,
  });

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.sizeOf(context);

    return Dialog(
      backgroundColor: AppTheme.creamBg,
      surfaceTintColor: Colors.transparent,
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: const BorderSide(color: AppTheme.borderLight),
      ),
      child: ConstrainedBox(
        constraints: BoxConstraints(
          maxWidth: 520,
          maxHeight: screenSize.height * 0.88,
        ),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: AppTheme.primarySage.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(
                      Icons.shield_rounded,
                      color: AppTheme.primarySage,
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: 14),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '100% Private & Offline',
                          style: TextStyle(
                            fontSize: 16.5,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.textPrimary,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        Text(
                          '${AppConstants.appName} ${AppConstants.fullVersion} • Offline Architecture',
                          style: TextStyle(
                            fontSize: 12,
                            color: AppTheme.textSecondary,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppTheme.borderLight),
                ),
                child: Column(
                  children: [
                    _buildAuditItem(
                      icon: Icons.cloud_off_rounded,
                      title: 'Zero Cloud Transmission',
                      desc: 'Your documents never leave this device. No remote servers or cloud processing APIs are ever queried.',
                    ),
                    const Divider(height: 20, color: AppTheme.borderLight),
                    _buildAuditItem(
                      icon: Icons.memory_rounded,
                      title: 'On-Device Wasm & Canvas Engines',
                      desc: 'Merging, splitting, compression, and conversions run directly via WebAssembly and HTML5 Canvas in local memory.',
                    ),
                    const Divider(height: 20, color: AppTheme.borderLight),
                    _buildAuditItem(
                      icon: Icons.router_rounded,
                      title: 'Loopback-Only Server (127.0.0.1)',
                      desc: 'Internal asset serving binds strictly to loopback IPv4. No outside network interfaces are exposed.',
                    ),
                    const Divider(height: 20, color: AppTheme.borderLight),
                    _buildAuditItem(
                      icon: Icons.no_accounts_rounded,
                      title: 'Zero Tracking & No Accounts',
                      desc: 'No login required, no third-party telemetry, and no cookies stored.',
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 18),
              Wrap(
                alignment: WrapAlignment.spaceBetween,
                crossAxisAlignment: WrapCrossAlignment.center,
                spacing: 8,
                runSpacing: 8,
                children: [
                  if (onConfigureServer != null)
                    TextButton.icon(
                      onPressed: onConfigureServer,
                      icon: const Icon(Icons.settings_outlined, size: 16, color: AppTheme.textSecondary),
                      label: const Text(
                        'Server Settings',
                        style: TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                      ),
                    ),
                  FilledButton(
                    onPressed: () => Navigator.pop(context),
                    style: FilledButton.styleFrom(
                      backgroundColor: AppTheme.primarySage,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: const Text('Verified & Secure'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAuditItem({
    required IconData icon,
    required String title,
    required String desc,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, color: AppTheme.primarySage, size: 20),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: AppTheme.textPrimary,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                desc,
                style: const TextStyle(
                  fontSize: 11,
                  height: 1.35,
                  color: AppTheme.textSecondary,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:webview_flutter/webview_flutter.dart';
import '../constants/app_constants.dart';
import '../services/local_server_service.dart';
import '../services/document_bridge_service.dart';
import '../services/local_storage_service.dart';
import '../theme/app_theme.dart';
import 'saved_files_screen.dart';
import 'privacy_audit_dialog.dart';

/// Main mobile application screen embedding the exact offline web engine (HomeScreen.jsx)
/// with native Android zero-permission downloads, system share sheet, and tactile navbar.
class HomeHubScreen extends StatefulWidget {
  final LocalServerService serverService;

  const HomeHubScreen({
    super.key,
    required this.serverService,
  });

  @override
  State<HomeHubScreen> createState() => _HomeHubScreenState();
}

class _HomeHubScreenState extends State<HomeHubScreen> {
  late final WebViewController _controller;
  late final DocumentBridgeService _bridgeService;
  final LocalStorageService _storageService = LocalStorageService();

  double _loadProgress = 0.0;
  bool _isLoading = true;
  int _currentNavIndex = 0;

  bool get _isTestEnvironment => Platform.environment.containsKey('FLUTTER_TEST');

  @override
  void initState() {
    super.initState();
    _storageService.refreshCount();

    _bridgeService = DocumentBridgeService(
      context: context,
    );

    if (!_isTestEnvironment) {
      _initWebView();
    } else {
      _isLoading = false;
    }
  }

  void _initWebView() {
    final url = widget.serverService.getUrl();

    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(AppTheme.creamBg)
      ..addJavaScriptChannel(
        'FlutterBridge',
        onMessageReceived: (JavaScriptMessage msg) {
          _bridgeService.handleMessage(msg.message);
        },
      )
      ..setNavigationDelegate(
        NavigationDelegate(
          onProgress: (int progress) {
            if (mounted) {
              setState(() {
                _loadProgress = progress / 100.0;
                if (progress >= 100) {
                  _isLoading = false;
                }
              });
            }
          },
          onPageStarted: (String url) {
            if (mounted) {
              setState(() => _isLoading = true);
            }
          },
          onPageFinished: (String url) {
            if (mounted) {
              setState(() => _isLoading = false);
            }
            _injectBridgeHelper();
          },
          onWebResourceError: (WebResourceError error) {
            debugPrint('WebResourceError: ${error.errorCode} - ${error.description}');
          },
        ),
      )
      ..loadRequest(Uri.parse(url));
  }

  /// Injects helper scripts into the web environment for native integration
  Future<void> _injectBridgeHelper() async {
    const js = '''
      (function() {
        window.isMobileApp = true;
        
        // Listen for files passed from Flutter native picker
        window.flutterOpenFiles = function(files) {
          if (window.dispatchEvent) {
            var event = new CustomEvent('flutter-files-received', { detail: files });
            window.dispatchEvent(event);
          }
        };

        // Notify Flutter on tool navigation
        var originalPushState = history.pushState;
        history.pushState = function() {
          originalPushState.apply(this, arguments);
          if (window.FlutterBridge) {
            var hash = window.location.hash.replace('#', '');
            if (hash) {
              window.FlutterBridge.postMessage(JSON.stringify({ type: 'TOOL_CHANGED', toolId: hash }));
            }
          }
        };

        // Intercept any download clicks across the web application
        document.addEventListener('click', function(e) {
          var target = e.target.closest('a[download]');
          if (target && target.href && window.FlutterBridge) {
            var href = target.href;
            var filename = target.getAttribute('download') || 'downloaded_document.pdf';
            if (href.startsWith('blob:') || href.startsWith('data:')) {
              e.preventDefault();
              fetch(href).then(function(res) { return res.blob(); }).then(function(blob) {
                var reader = new FileReader();
                reader.onloadend = function() {
                  var base64 = (reader.result || '').split(',')[1];
                  if (base64) {
                    window.FlutterBridge.postMessage(JSON.stringify({
                      type: 'DOWNLOAD_FILE',
                      filename: filename,
                      base64Data: base64,
                      mimeType: blob.type || 'application/octet-stream'
                    }));
                  }
                };
                reader.readAsDataURL(blob);
              }).catch(function(err) {
                console.error('Bridge download interception error:', err);
              });
            }
          }
        }, true);
      })();
    ''';
    try {
      await _controller.runJavaScript(js);
    } catch (_) {}
  }

  Future<void> _handleBackPress() async {
    try {
      // If web app has an active tool open, navigate back to home screen
      final result = await _controller.runJavaScriptReturningResult(
        "Boolean(window.getAppTab && window.getAppTab() !== 'home');",
      );
      if (result == true || result.toString() == 'true') {
        await _controller.runJavaScript("if (window.setAppTab) window.setAppTab('home');");
        return;
      }
    } catch (_) {}

    if (await _controller.canGoBack()) {
      await _controller.goBack();
    } else {
      if (mounted) {
        SystemNavigator.pop();
      }
    }
  }

  void _navigateToHome() {
    HapticFeedback.lightImpact();
    setState(() => _currentNavIndex = 0);
    _controller.runJavaScript(
      "if (window.setAppTab) { window.setAppTab('home'); } else { window.location.href = '/?mobile=true'; }",
    );
  }

  void _openSavedFiles() {
    HapticFeedback.lightImpact();
    setState(() => _currentNavIndex = 1);
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => const SavedFilesScreen()),
    ).then((_) {
      _storageService.refreshCount();
      if (mounted) setState(() => _currentNavIndex = 0);
    });
  }

  void _openFullStudio() {
    HapticFeedback.lightImpact();
    setState(() => _currentNavIndex = 2);
    _controller.runJavaScript(
      "if (window.setAppTab) { window.setAppTab('merge-pdf'); } else { window.location.href = '/?tool=merge-pdf&mobile=true'; }",
    );
  }

  void _openPrivacyAudit() {
    HapticFeedback.lightImpact();
    setState(() => _currentNavIndex = 3);
    showDialog(
      context: context,
      builder: (_) => PrivacyAuditDialog(
        onConfigureServer: () {
          Navigator.pop(context);
          _showDevServerSettings();
        },
      ),
    ).then((_) {
      if (mounted) setState(() => _currentNavIndex = 0);
    });
  }

  void _showDevServerSettings() {
    final devUrlController = TextEditingController(text: widget.serverService.devServerUrl);
    bool useDev = widget.serverService.useDevServer;

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) => AlertDialog(
          backgroundColor: AppTheme.creamBg,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Text('Server Configuration', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          content: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 480),
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SwitchListTile(
                    contentPadding: EdgeInsets.zero,
                    activeThumbColor: AppTheme.primarySage,
                    title: const Text('Use Dev Server', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                    subtitle: const Text('Connect to Vite dev server on host machine', style: TextStyle(fontSize: 12)),
                    value: useDev,
                    onChanged: (val) {
                      setDialogState(() => useDev = val);
                    },
                  ),
                  if (useDev) ...[
                    const SizedBox(height: 10),
                    TextField(
                      controller: devUrlController,
                      decoration: const InputDecoration(
                        labelText: 'Dev Server URL',
                        hintText: 'http://10.0.2.2:5173',
                        border: OutlineInputBorder(),
                        contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                      ),
                      style: const TextStyle(fontSize: 13),
                    ),
                  ],
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppTheme.sageLight,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      useDev
                          ? 'Connected to local host network for live HMR development.'
                          : '${AppConstants.appName} ${AppConstants.fullVersion} running 100% offline from bundled loopback server (port ${widget.serverService.port}). Zero cloud transmission.',
                      style: const TextStyle(fontSize: 11, color: AppTheme.forestDark, height: 1.3),
                    ),
                  ),
                ],
              ),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () {
                setState(() {
                  widget.serverService.setUseDevServer(useDev, customUrl: devUrlController.text);
                });
                Navigator.pop(ctx);
                _controller.loadRequest(Uri.parse(widget.serverService.getUrl()));
              },
              style: FilledButton.styleFrom(backgroundColor: AppTheme.primarySage),
              child: const Text('Apply'),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) async {
        if (didPop) return;
        await _handleBackPress();
      },
      child: Scaffold(
        body: SafeArea(
          bottom: false,
          child: Stack(
            children: [
              _isTestEnvironment
                  ? const Center(child: Text('ILoveMyOfficeWorks Web Engine'))
                  : WebViewWidget(controller: _controller),
              if (_isLoading)
                Positioned(
                  top: 0,
                  left: 0,
                  right: 0,
                  child: LinearProgressIndicator(
                    value: _loadProgress > 0 ? _loadProgress : null,
                    backgroundColor: Colors.transparent,
                    valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.primarySage),
                    minHeight: 2.5,
                  ),
                ),
            ],
          ),
        ),

        // Bottom Navigation Bar / Navbar
        bottomNavigationBar: Container(
          decoration: BoxDecoration(
            color: Colors.white,
            border: const Border(top: BorderSide(color: AppTheme.borderLight, width: 1)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.05),
                blurRadius: 10,
                offset: const Offset(0, -3),
              ),
            ],
          ),
          child: NavigationBar(
            selectedIndex: _currentNavIndex,
            onDestinationSelected: (index) {
              if (index == 0) _navigateToHome();
              if (index == 1) _openSavedFiles();
              if (index == 2) _openFullStudio();
              if (index == 3) _openPrivacyAudit();
            },
            backgroundColor: Colors.white,
            indicatorColor: AppTheme.sageTint,
            elevation: 0,
            height: 64,
            labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
            destinations: [
              const NavigationDestination(
                icon: Icon(Icons.home_outlined),
                selectedIcon: Icon(Icons.home_rounded, color: AppTheme.primarySage),
                label: 'Home',
              ),
              NavigationDestination(
                icon: ValueListenableBuilder<int>(
                  valueListenable: _storageService.savedFilesCount,
                  builder: (context, count, _) => Badge(
                    isLabelVisible: count > 0,
                    label: Text(count.toString()),
                    backgroundColor: AppTheme.primarySage,
                    child: const Icon(Icons.folder_shared_outlined),
                  ),
                ),
                selectedIcon: const Icon(Icons.folder_shared_rounded, color: AppTheme.primarySage),
                label: 'Saved Files',
              ),
              const NavigationDestination(
                icon: Icon(Icons.dashboard_customize_outlined),
                selectedIcon: Icon(Icons.dashboard_customize_rounded, color: AppTheme.primarySage),
                label: 'Studio',
              ),
              const NavigationDestination(
                icon: Icon(Icons.shield_outlined),
                selectedIcon: Icon(Icons.shield_rounded, color: AppTheme.primarySage),
                label: 'Privacy',
              ),
            ],
          ),
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:webview_flutter/webview_flutter.dart';
import '../models/tool_item.dart';
import '../services/local_server_service.dart';
import '../services/document_bridge_service.dart';
import '../theme/app_theme.dart';

class ToolWorkspaceScreen extends StatefulWidget {
  final ToolItem? tool;
  final LocalServerService serverService;

  const ToolWorkspaceScreen({
    super.key,
    this.tool,
    required this.serverService,
  });

  @override
  State<ToolWorkspaceScreen> createState() => _ToolWorkspaceScreenState();
}

class _ToolWorkspaceScreenState extends State<ToolWorkspaceScreen> {
  late final WebViewController _controller;
  late final DocumentBridgeService _bridgeService;
  double _loadProgress = 0.0;
  bool _isLoading = true;
  String _currentToolTitle = '';

  @override
  void initState() {
    super.initState();
    _currentToolTitle = widget.tool?.name ?? 'Studio Workspace';
    _bridgeService = DocumentBridgeService(
      context: context,
      onToolChanged: (toolId) {
        final match = ToolItem.allTools.firstWhere(
          (t) => t.id == toolId,
          orElse: () => ToolItem(
            id: toolId,
            name: toolId,
            category: ToolCategory.organize,
            description: '',
            icon: Icons.description,
          ),
        );
        setState(() {
          _currentToolTitle = match.name;
        });
      },
    );

    _initWebView();
  }

  void _initWebView() {
    final url = widget.serverService.getUrl(toolId: widget.tool?.id);

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
      })();
    ''';
    try {
      await _controller.runJavaScript(js);
    } catch (_) {}
  }

  Future<void> _handleBackPress() async {
    if (await _controller.canGoBack()) {
      await _controller.goBack();
    } else {
      if (mounted) {
        Navigator.pop(context);
      }
    }
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
        appBar: AppBar(
          leading: IconButton(
            icon: const Icon(Icons.arrow_back_rounded),
            onPressed: _handleBackPress,
            tooltip: 'Back',
          ),
          title: Row(
            children: [
              Flexible(
                child: Text(
                  _currentToolTitle,
                  style: const TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.textPrimary,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              if (widget.tool != null) ...[
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                  decoration: BoxDecoration(
                    color: widget.tool!.category.badgeColor.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    widget.tool!.category.title.split(' ')[0],
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w700,
                      color: widget.tool!.category.badgeColor,
                    ),
                  ),
                ),
              ],
            ],
          ),
          actions: [
            // Native Document Picker
            IconButton(
              icon: const Icon(Icons.folder_open_rounded, color: AppTheme.forestDark),
              tooltip: 'Pick File from Device',
              onPressed: () {
                _bridgeService.pickAndInjectFiles(
                  _controller,
                  allowedExtensions: widget.tool?.supportedExtensions,
                );
              },
            ),
            // Reload page
            IconButton(
              icon: const Icon(Icons.refresh_rounded, color: AppTheme.forestDark),
              tooltip: 'Reload',
              onPressed: () {
                HapticFeedback.lightImpact();
                _controller.reload();
              },
            ),
            const SizedBox(width: 4),
          ],
          bottom: _isLoading
              ? PreferredSize(
                  preferredSize: const Size.fromHeight(2),
                  child: LinearProgressIndicator(
                    value: _loadProgress > 0 ? _loadProgress : null,
                    backgroundColor: AppTheme.borderLight,
                    valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.primarySage),
                    minHeight: 2,
                  ),
                )
              : null,
        ),
        body: SafeArea(
          child: WebViewWidget(controller: _controller),
        ),
      ),
    );
  }
}

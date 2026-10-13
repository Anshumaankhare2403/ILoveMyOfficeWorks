import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'services/local_server_service.dart';
import 'screens/home_hub_screen.dart';
import 'theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Set system UI navigation and status bar style
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
      systemNavigationBarColor: AppTheme.creamBg,
      systemNavigationBarIconBrightness: Brightness.dark,
    ),
  );

  // Initialize and start embedded offline loopback server
  final serverService = LocalServerService();
  await serverService.start();

  runApp(ILoveMyOfficeWorksApp(serverService: serverService));
}

class ILoveMyOfficeWorksApp extends StatefulWidget {
  final LocalServerService serverService;

  const ILoveMyOfficeWorksApp({
    super.key,
    required this.serverService,
  });

  @override
  State<ILoveMyOfficeWorksApp> createState() => _ILoveMyOfficeWorksAppState();
}

class _ILoveMyOfficeWorksAppState extends State<ILoveMyOfficeWorksApp> {
  @override
  void dispose() {
    widget.serverService.stop();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ILoveMyOfficeWorks',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.theme,
      home: HomeHubScreen(serverService: widget.serverService),
    );
  }
}

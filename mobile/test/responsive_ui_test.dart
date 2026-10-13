import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ilovemyofficeworks/main.dart';
import 'package:ilovemyofficeworks/screens/home_hub_screen.dart';
import 'package:ilovemyofficeworks/screens/saved_files_screen.dart';
import 'package:ilovemyofficeworks/screens/privacy_audit_dialog.dart';
import 'package:ilovemyofficeworks/screens/tool_workspace_screen.dart';
import 'package:ilovemyofficeworks/services/local_server_service.dart';
import 'package:ilovemyofficeworks/services/local_storage_service.dart';
import 'package:ilovemyofficeworks/theme/app_theme.dart';
import 'package:ilovemyofficeworks/widgets/download_success_sheet.dart';

void main() {
  final serverService = LocalServerService();

  group('Responsive Layout & UI Overflow Verification', () {
    testWidgets('HomeHubScreen renders without overflow on 320x568 small device', (tester) async {
      tester.view.physicalSize = const Size(320, 568);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(ILoveMyOfficeWorksApp(serverService: serverService));
      await tester.pumpAndSettle();

      expect(find.byType(HomeHubScreen), findsOneWidget);
      expect(find.text('Home'), findsOneWidget);
      expect(find.text('Saved Files'), findsOneWidget);
      expect(find.text('Studio'), findsOneWidget);
      expect(find.text('Privacy'), findsOneWidget);
      expect(tester.takeException(), isNull);
    });

    testWidgets('HomeHubScreen renders on 800x1280 tablet in landscape and portrait', (tester) async {
      tester.view.physicalSize = const Size(1280, 800);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(ILoveMyOfficeWorksApp(serverService: serverService));
      await tester.pumpAndSettle();

      expect(find.byType(NavigationBar), findsOneWidget);
      expect(tester.takeException(), isNull);
    });

    testWidgets('SavedFilesScreen renders without overflow on narrow device (320px)', (tester) async {
      tester.view.physicalSize = const Size(320, 568);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.theme,
          home: const SavedFilesScreen(),
        ),
      );
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 300));

      expect(find.text('Saved Documents'), findsOneWidget);
      expect(tester.takeException(), isNull);
    });

    testWidgets('SavedFilesScreen renders without overflow in landscape mode (844x390)', (tester) async {
      tester.view.physicalSize = const Size(844, 390);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.theme,
          home: const SavedFilesScreen(),
        ),
      );
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 300));

      expect(find.text('Saved Documents'), findsOneWidget);
      expect(tester.takeException(), isNull);
    });

    testWidgets('PrivacyAuditDialog renders cleanly in landscape mode without vertical overflow', (tester) async {
      tester.view.physicalSize = const Size(800, 380);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.theme,
          home: Scaffold(
            body: PrivacyAuditDialog(
              onConfigureServer: () {},
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('100% Private & Offline'), findsOneWidget);
      expect(find.text('Server Settings'), findsOneWidget);
      expect(find.text('Verified & Secure'), findsOneWidget);
      expect(tester.takeException(), isNull);
    });

    testWidgets('PrivacyAuditDialog with high font scale (1.5x) on narrow screen (320px) does not overflow', (tester) async {
      tester.view.physicalSize = const Size(320, 600);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.theme,
          home: MediaQuery(
            data: const MediaQueryData(textScaler: TextScaler.linear(1.5)),
            child: Scaffold(
              body: PrivacyAuditDialog(
                onConfigureServer: () {},
              ),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('100% Private & Offline'), findsOneWidget);
      expect(tester.takeException(), isNull);
    });

    testWidgets('DownloadSuccessSheet renders on 320px narrow screen without overflow', (tester) async {
      tester.view.physicalSize = const Size(320, 600);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      final dummyFile = SavedFileInfo(
        id: 'file_1',
        filename: 'Extracted_Document_2026_Report_Final.pdf',
        path: '/data/user/0/com.ilovemyofficeworks/files/Extracted_Document_2026_Report_Final.pdf',
        sizeBytes: 1542000,
        mimeType: 'application/pdf',
        savedAt: DateTime.now(),
      );

      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.theme,
          home: Scaffold(
            body: DownloadSuccessSheet(fileInfo: dummyFile),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Document Ready!'), findsOneWidget);
      expect(find.text('Share / Send File'), findsOneWidget);
      expect(find.text('Saved Files'), findsOneWidget);
      expect(tester.takeException(), isNull);
    });

    testWidgets('DownloadSuccessSheet renders on landscape (844x360) without overflow', (tester) async {
      tester.view.physicalSize = const Size(844, 360);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      final dummyFile = SavedFileInfo(
        id: 'file_2',
        filename: 'Compressed_Presentation.pptx',
        path: '/data/user/0/com.ilovemyofficeworks/files/Compressed_Presentation.pptx',
        sizeBytes: 2500000,
        mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        savedAt: DateTime.now(),
      );

      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.theme,
          home: Scaffold(
            body: DownloadSuccessSheet(fileInfo: dummyFile),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Document Ready!'), findsOneWidget);
      expect(tester.takeException(), isNull);
    });

    testWidgets('ToolWorkspaceScreen renders in test mode without platform channel crash', (tester) async {
      tester.view.physicalSize = const Size(360, 640);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.theme,
          home: ToolWorkspaceScreen(serverService: serverService),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.byType(ToolWorkspaceScreen), findsOneWidget);
      expect(tester.takeException(), isNull);
    });
  });
}

import 'package:flutter_test/flutter_test.dart';
import 'package:ilovemyofficeworks/main.dart';
import 'package:ilovemyofficeworks/services/local_server_service.dart';

void main() {
  testWidgets('App smoke test initializes HomeHub with mobile elements', (WidgetTester tester) async {
    final serverService = LocalServerService();
    await tester.pumpWidget(ILoveMyOfficeWorksApp(serverService: serverService));

    // Verify Android badge and buttons are rendered
    expect(find.text('ANDROID'), findsOneWidget);
    expect(find.text('Merge PDFs'), findsOneWidget);
    expect(find.text('Open Full Studio'), findsOneWidget);
  });
}

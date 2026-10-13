import 'package:flutter_test/flutter_test.dart';
import 'package:ilovemyofficeworks/main.dart';
import 'package:ilovemyofficeworks/services/local_server_service.dart';

void main() {
  testWidgets('App smoke test initializes HomeHub with mobile elements', (WidgetTester tester) async {
    final serverService = LocalServerService();
    await tester.pumpWidget(ILoveMyOfficeWorksApp(serverService: serverService));

    // Verify web engine container and bottom navigation destinations are rendered
    expect(find.text('ILoveMyOfficeWorks Web Engine'), findsOneWidget);
    expect(find.text('Home'), findsOneWidget);
    expect(find.text('Saved Files'), findsOneWidget);
    expect(find.text('Studio'), findsOneWidget);
    expect(find.text('Privacy'), findsOneWidget);
  });
}

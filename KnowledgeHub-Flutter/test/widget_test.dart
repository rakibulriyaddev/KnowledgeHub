import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:knowledgehub/main.dart';

void main() {
  testWidgets('Home screen loads and shows the search field', (WidgetTester tester) async {
    await tester.pumpWidget(const KnowledgeHubApp());
    // Vault asset loading does real file IO, which the test's FakeAsync zone
    // won't advance on its own — run it through runAsync so it resolves.
    await tester.runAsync(() => Future<void>.delayed(const Duration(milliseconds: 200)));
    await tester.pump();
    await tester.pump();

    expect(find.text('Your knowledge, organized.'), findsOneWidget);
    expect(find.byType(TextField), findsOneWidget);
  });
}

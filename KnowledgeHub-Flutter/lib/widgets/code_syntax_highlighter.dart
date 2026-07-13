import 'package:flutter/material.dart';
import 'package:flutter_highlight/themes/atom-one-dark.dart';
import 'package:flutter_highlight/themes/github.dart';
import 'package:flutter_markdown_plus/flutter_markdown_plus.dart';
import 'package:highlight/highlight.dart' show highlight, Node;

/// Renders fenced code blocks via Shiki-equivalent syntax highlighting on
/// Flutter: package:highlight (auto-detected language) themed with a
/// light/dark pairing analogous to the github-light/github-dark pairing
/// rehype-pretty-code uses in lib/markdown.ts, switching with the app's
/// brightness.
class AppCodeSyntaxHighlighter extends SyntaxHighlighter {
  AppCodeSyntaxHighlighter({required this.isDark});

  final bool isDark;

  @override
  TextSpan format(String source) {
    final theme = isDark ? atomOneDarkTheme : githubTheme;
    final result = highlight.parse(source, autoDetection: true);
    final nodes = result.nodes ?? [];
    return TextSpan(
      style: const TextStyle(fontFamily: 'monospace', fontSize: 13),
      children: _convert(nodes, theme),
    );
  }

  List<TextSpan> _convert(List<Node> nodes, Map<String, TextStyle> theme) {
    final spans = <TextSpan>[];
    for (final node in nodes) {
      spans.add(_visit(node, theme));
    }
    return spans;
  }

  TextSpan _visit(Node node, Map<String, TextStyle> theme) {
    if (node.value != null) {
      return TextSpan(
        text: node.value,
        style: node.className == null ? null : theme[node.className!],
      );
    }
    if (node.children != null) {
      return TextSpan(
        style: node.className == null ? null : theme[node.className!],
        children: node.children!.map((n) => _visit(n, theme)).toList(),
      );
    }
    return const TextSpan(text: '');
  }
}

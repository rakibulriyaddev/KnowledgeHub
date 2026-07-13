import 'package:flutter/material.dart';
import 'package:flutter_markdown_plus/flutter_markdown_plus.dart';
import 'package:go_router/go_router.dart';
import 'package:markdown/markdown.dart' as md;

import 'code_syntax_highlighter.dart';

/// Renders a topic panel's markdown body. Mirrors
/// components/MarkdownViewer.tsx: GFM (tables, strikethrough, etc. — see
/// lib/markdown.ts's remarkGfm) plus syntax-highlighted code blocks.
class MarkdownView extends StatelessWidget {
  const MarkdownView({super.key, required this.body});

  final String body;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final textColor = theme.colorScheme.onSurface;
    final mutedColor = isDark ? const Color(0xFFA3A3A3) : const Color(0xFF737373);
    final codeBg = isDark ? const Color(0xFF171717) : const Color(0xFFF5F5F5);

    return MarkdownBody(
      data: body,
      selectable: true,
      extensionSet: md.ExtensionSet.gitHubFlavored,
      syntaxHighlighter: AppCodeSyntaxHighlighter(isDark: isDark),
      imageBuilder: (uri, title, alt) => _buildImage(uri, alt),
      onTapLink: (text, href, title) async {
        if (href == null) return;
        // Internal topic cross-links (e.g. "/topic/acid") route within the
        // app instead of opening a browser.
        final match = RegExp(r'^/topic/([\w-]+)').firstMatch(href);
        if (match != null) {
          context.push('/topic/${match.group(1)}');
        }
      },
      styleSheet: MarkdownStyleSheet(
        p: theme.textTheme.bodyMedium?.copyWith(color: textColor, height: 1.6),
        h1: theme.textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.bold, color: textColor),
        h2: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold, color: textColor),
        h3: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold, color: textColor),
        h4: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold, color: textColor),
        listBullet: theme.textTheme.bodyMedium?.copyWith(color: textColor),
        blockquotePadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        blockquoteDecoration: BoxDecoration(
          border: Border(left: BorderSide(color: theme.colorScheme.primary, width: 3)),
        ),
        blockquote: theme.textTheme.bodyMedium?.copyWith(color: mutedColor, fontStyle: FontStyle.italic),
        code: TextStyle(
          fontFamily: 'monospace',
          fontSize: 13,
          backgroundColor: codeBg,
          color: textColor,
        ),
        codeblockDecoration: BoxDecoration(
          color: codeBg,
          borderRadius: BorderRadius.circular(8),
        ),
        codeblockPadding: const EdgeInsets.all(12),
        tableBorder: TableBorder.all(color: theme.dividerColor),
        tableHead: theme.textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.bold, color: textColor),
        tableBody: theme.textTheme.bodyMedium?.copyWith(color: textColor),
        tableCellsPadding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
        a: TextStyle(color: theme.colorScheme.primary, decoration: TextDecoration.underline),
        horizontalRuleDecoration: BoxDecoration(
          border: Border(top: BorderSide(color: theme.dividerColor)),
        ),
      ),
    );
  }

  /// Resolves an image reference from a Markdown body. Topic images are
  /// authored as absolute `/vault/<topic>/<file>` links (see
  /// assets/vault_images/) and bundled into the app at that same relative
  /// path; anything else falls back to a plain network image.
  static final _vaultImagePath = RegExp(r'^/vault/([^/]+)/(.+)$');

  Widget _buildImage(Uri uri, String? alt) {
    if (uri.scheme == 'http' || uri.scheme == 'https') {
      return Image.network(
        uri.toString(),
        errorBuilder: (context, error, stackTrace) => _imageFallback(alt),
      );
    }

    final match = _vaultImagePath.firstMatch(uri.path);
    if (match != null) {
      return Image.asset(
        'assets/vault_images/${match.group(1)}/${match.group(2)}',
        errorBuilder: (context, error, stackTrace) => _imageFallback(alt),
      );
    }

    return _imageFallback(alt);
  }

  Widget _imageFallback(String? alt) => Builder(
    builder: (context) => Text(
      alt?.isNotEmpty == true ? '[image: $alt]' : '[image]',
      style: Theme.of(context).textTheme.bodySmall?.copyWith(
        color: Theme.of(context).colorScheme.onSurfaceVariant,
        fontStyle: FontStyle.italic,
      ),
    ),
  );
}

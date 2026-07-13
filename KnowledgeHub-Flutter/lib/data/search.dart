import '../models/vault_models.dart';

/// Max results shown in the live search dropdown (mirrors lib/search.ts).
const int kMaxSearchResults = 10;

/// Fuzzy search over [SearchIndexEntry], matching on title (weight 0.7) and
/// tags (weight 0.3) — a lightweight, dependency-free stand-in for Fuse.js
/// tuned to the same fields and weighting as lib/search.ts.
class VaultSearch {
  VaultSearch(this._entries);

  final List<SearchIndexEntry> _entries;

  List<SearchIndexEntry> search(String query, {int limit = kMaxSearchResults}) {
    final trimmed = query.trim().toLowerCase();
    if (trimmed.isEmpty) return const [];

    final scored = <_ScoredEntry>[];
    for (final entry in _entries) {
      final titleScore = _fieldScore(entry.title.toLowerCase(), trimmed);
      var tagScore = 0.0;
      for (final tag in entry.tags) {
        final s = _fieldScore(tag.toLowerCase(), trimmed);
        if (s > tagScore) tagScore = s;
      }
      final score = titleScore * 0.7 + tagScore * 0.3;
      if (score > 0) scored.add(_ScoredEntry(entry, score));
    }

    scored.sort((a, b) => b.score.compareTo(a.score));
    return scored.take(limit).map((s) => s.entry).toList();
  }

  /// 1.0 for an exact match, ~0.8 for a substring match (anywhere in the
  /// string, per Fuse's `ignoreLocation`), ~0.5 for an in-order fuzzy
  /// subsequence match, 0 for no match.
  double _fieldScore(String field, String query) {
    if (field.isEmpty) return 0;
    if (field == query) return 1.0;
    if (field.contains(query)) return 0.8;
    if (_isSubsequence(query, field)) return 0.5;
    return 0;
  }

  bool _isSubsequence(String query, String field) {
    var qi = 0;
    for (var fi = 0; fi < field.length && qi < query.length; fi++) {
      if (field[fi] == query[qi]) qi++;
    }
    return qi == query.length;
  }
}

class _ScoredEntry {
  final SearchIndexEntry entry;
  final double score;
  _ScoredEntry(this.entry, this.score);
}

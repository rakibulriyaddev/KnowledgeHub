# Task Recipes

Reusable playbooks for common changes in this repo, so a new AI session
doesn't have to rediscover the right sequence of steps each time. Link back
here from chat instead of re-deriving these from scratch.

## "Add a vault topic"

Use `/add-topic <name>` (see `.claude/commands/add-topic.md`). Don't hand-rewrite
its logic inline — it already reads `KnowledgeVault/CLAUDE.md` live and
handles slug derivation, collision checks, and bidirectionality.

If the topic needs an image, follow the "Add a topic image" recipe below
too — images are not part of the `/add-topic` flow.

## "Add a topic image"

1. Drop the file under `KnowledgeHub-Flutter/assets/vault_images/<topic-id>/`.
2. Add its path as a new line in `KnowledgeHub-Flutter/pubspec.yaml`'s
   `assets:` list.
3. Reference it from the Markdown body as `/vault/<topic-id>/<file>`.
4. Re-run `dart run tool/build_vault_data.dart` and rebuild.

See ADR-007 in [DECISIONS.md](DECISIONS.md) for why it works this way.

## "Change the vault frontmatter schema"

Follow the ordered checklist in [WORKFLOWS.md](WORKFLOWS.md) under
"Changing the vault frontmatter schema" — schema changes touch the vault
docs, the Dart bake script, the Dart models, and this doc set; skipping
steps leaves the app's data model out of sync with the vault.

## "Make a UI or logic change to the app"

1. Read the relevant screen/widget end to end — don't guess behavior from
   the file name.
2. Make the change, keeping to the conventions in
   [CODING_STANDARDS.md](CODING_STANDARDS.md) (minimal state management,
   business logic out of widgets, Android-only assumptions).
3. Verify: `flutter analyze && flutter test && flutter build apk --debug`.
   Use a real device/emulator to check UI when one is available; a clean
   build alone only proves it compiles.
4. If you made a new tradeoff or introduced a divergence from existing
   patterns, add an ADR to [DECISIONS.md](DECISIONS.md).

## "Regenerate the baked vault asset after a content change"

```bash
cd KnowledgeHub-Flutter && dart run tool/build_vault_data.dart
```

Always required before the app will reflect a `KnowledgeVault/` edit —
there is no live filesystem access at runtime (ADR-002).

## "I'm not sure this repo needs a backend/database for X"

It almost certainly doesn't — re-read ADR-002 in [DECISIONS.md](DECISIONS.md)
first. This architecture's entire value is "content is git, render is
static, nothing to run except the app itself." Raise it with the user
before introducing one.

## "I found a reference to KnowledgeHub-Client somewhere"

That subproject was removed (ADR-009) — any lingering reference in code,
docs, or `.claude/` config is stale and should be updated/removed, not
treated as active guidance.

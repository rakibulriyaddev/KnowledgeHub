# Workflows

## Add or edit vault content

Preferred: the `/add-topic` slash command (Claude Code) —
`.claude/commands/add-topic.md`. It derives the slug, checks for
collisions, asks title/parent/children/tags in one message, writes a
complete `_index.md`, and fixes parent↔child bidirectionality
automatically. Reads `KnowledgeVault/CLAUDE.md` live, so that file is always
the current source of truth for the rules it follows.

Manual alternative: create/edit files directly in `KnowledgeVault/`,
following `KnowledgeVault/CLAUDE.md`'s validation checklist before saving.

**After any vault content change**, the app is stale until you rebuild its
baked asset — see below.

## Run the app

```bash
cd KnowledgeHub-Flutter
dart run tool/build_vault_data.dart   # regenerate assets/vault_data.json from ../KnowledgeVault
flutter run                            # needs an Android device/emulator attached
```

**Run the first command after every vault content change** — the app has no
live filesystem access; without a fresh bake it'll keep showing stale data.

Build an APK without a device attached (this is the practical verification
step when no emulator is available):

```bash
flutter build apk --debug
```

## Verify before calling a change done

```bash
flutter analyze
flutter test
flutter build apk --debug
```

If a device/emulator genuinely is available, prefer running the app and
exercising the actual screen you changed over trusting analyze/build alone
— they catch compile errors, not UX regressions.

## Adding a new topic image

1. Drop the file under `KnowledgeHub-Flutter/assets/vault_images/<topic-id>/`.
2. Add its path as a new line in `KnowledgeHub-Flutter/pubspec.yaml`'s
   `assets:` list (images are listed individually, not as a folder — see
   [DATA_MODEL.md](DATA_MODEL.md)).
3. Reference it from the topic's Markdown body as
   `/vault/<topic-id>/<file>`.
4. Re-run `dart run tool/build_vault_data.dart` and rebuild.

## Changing the vault frontmatter schema

1. `KnowledgeVault/CLAUDE.md` — the schema table and validation checklist
2. `KnowledgeHub-Flutter/tool/build_vault_data.dart` — the normalization logic
3. `KnowledgeHub-Flutter/lib/models/vault_models.dart` — the `Frontmatter` class
4. `docs/DATA_MODEL.md` — this doc set
5. Re-run the bake script against the real vault to confirm nothing broke

## Deployment

No deployment pipeline exists yet. APKs are built locally
(`flutter build apk`); there's no Play Store listing or CI release flow.

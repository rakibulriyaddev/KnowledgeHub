Build release APK from latest vault content, copied to a tracked path.

---

## Step 1 — Bake latest vault content

```bash
cd KnowledgeHub-Flutter
dart run tool/build_vault_data.dart
```

Regenerates `assets/vault_data.json` from `../KnowledgeVault`. Fails loudly if
the vault has schema errors — stop and report if so, don't proceed to build.

## Step 2 — Build release APK (arm64-v8a only)

```bash
flutter build apk --release --target-platform android-arm64 --dart-define=API_BASE_URL=https://knowledgehub.ttzs.live
```

arm64-v8a covers virtually all real Android phones since 2018; armeabi-v7a/
x86/x86_64 in a universal build only bloat size for emulators/legacy
devices. Output: `KnowledgeHub-Flutter/build/app/outputs/flutter-apk/app-release.apk`.

`--dart-define=API_BASE_URL` is required — without it the app falls back to
the emulator-only default (`http://10.0.2.2:5270`), which is unreachable
from a real device and makes every status/mark-read call fail silently.

## Step 3 — Copy APK to a tracked path

`build/` is gitignored (Flutter default), so the raw output never gets
committed as-is. Copy it to a stable, tracked location instead of fighting
the gitignore:

```bash
mkdir -p KnowledgeHub-Flutter/releases
cp KnowledgeHub-Flutter/build/app/outputs/flutter-apk/app-release.apk KnowledgeHub-Flutter/releases/app-release.apk
```

One fixed filename, overwritten each run — not versioned per-build. If the
user wants versioned filenames (e.g. `app-release-1.2.0.apk`) instead, ask
before diverging from this default.

Report the final APK path and size when done.

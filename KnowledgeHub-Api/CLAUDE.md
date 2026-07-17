# KnowledgeHub-Api

.NET 10 minimal API backing per-user "topic read" tracking for the Flutter
app. Read [`../CLAUDE.md`](../CLAUDE.md) first for the whole-repo picture.

There is no auth — the app identifies a user by the email they entered once
on the entry screen (see `KnowledgeHub-Flutter/lib/screens/entry_screen.dart`),
and that email is sent as plain payload on every call.

## Endpoints

- `GET /api/topic-status?topicId=...&email=...` → `{ "status": true|false }`
- `POST /api/topic-status/mark-read` body `{ "topicId": "...", "email": "..." }`
  → upserts a document and returns `{ "status": true }`

Both read and write lowercase the email before touching Mongo (see
`Services/TopicStatusService.cs`), so lookups are case-insensitive regardless
of what the client sends.

## Data

Single Mongo collection `topic_status`. Document `_id` is
`"{lowercase email}_{topicId}"` — naturally unique per user per topic, no
separate email field or compound index needed. Connection string / database
name come from the `Mongo` section of `appsettings.json` — point it at your
own MongoDB instance.

## Running locally

```bash
dotnet run
```

Defaults to `http://localhost:5270` (see `Properties/launchSettings.json`).
The Flutter app must be built with `--dart-define=API_BASE_URL=...` pointing
at wherever this is reachable from the device/emulator — see
[`../docs/WORKFLOWS.md`](../docs/WORKFLOWS.md).

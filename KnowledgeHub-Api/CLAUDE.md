# KnowledgeHub-Api

.NET 10 API (controller-based) backing per-user "topic read" tracking for
the Flutter app. Read [`../CLAUDE.md`](../CLAUDE.md) first for the whole-repo
picture.

There is no auth — the app identifies a user by the email they entered once
on the entry screen (see `KnowledgeHub-Flutter/lib/screens/entry_screen.dart`),
and that email is sent as plain payload on every call.

## Endpoints

- `GET /api/topic-status?email=...` → `{ "topicIds": ["...", ...] }` — every
  topic id this user has marked read
- `POST /api/topic-status/mark-read` body `{ "topicId": "...", "email": "..." }`
  → adds the id to the user's read set (upsert) and returns `{ "status": true }`
- `POST /api/topic-status/mark-unread` body `{ "topicId": "...", "email": "..." }`
  → removes the id from the user's read set and returns `{ "status": false }`
- `GET /health` → `{ "status": "ok" }` — liveness check, available in every
  environment including after deployment (`Controllers/HealthController.cs`)

All three live in `Controllers/TopicStatusController.cs`, backed by
`Services/TopicStatusService.cs`. Read and write both lowercase the email
before touching Mongo, so lookups are case-insensitive regardless of what the
client sends.

## Data

Single Mongo collection `topic_status`, one document per user. Document
`_id` is the lowercase email; `ReadTopicIds` is the full list of topic ids
that user has read (`Models/UserTopicStatusDocument.cs`). Mark-read/unread
use `$addToSet`/`$pull` against that array, upserting the document if it
doesn't exist yet. Connection string / database name come from the `Mongo`
section of config.

`appsettings.json` hardcodes `mongodb://localhost:27017` as the local-dev
default — fine to keep tracked in git since it's not a real credential.
`appsettings.Production.json` deliberately omits the `Mongo` section: ASP.NET
Core's default config providers let environment variables override
`appsettings.json` using the `Section__Key` convention, so production sets
`Mongo__ConnectionString` and `Mongo__Database` as env vars (e.g. in the
systemd unit) instead of committing a real connection string. Set
`ASPNETCORE_ENVIRONMENT=Production` wherever this runs in production so
`appsettings.Production.json` gets picked up.

## Running locally

```bash
dotnet run
```

Defaults to `http://localhost:5270` (see `Properties/launchSettings.json`).
The Flutter app must be built with `--dart-define=API_BASE_URL=...` pointing
at wherever this is reachable from the device/emulator — see
[`../docs/WORKFLOWS.md`](../docs/WORKFLOWS.md).

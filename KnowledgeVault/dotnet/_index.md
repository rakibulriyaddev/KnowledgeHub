---
id: dotnet
title: ".NET"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, framework, csharp]
parent: null
children: []
status: draft
---

## Overview
.NET is Microsoft's open-source, cross-platform development platform for building web, desktop, mobile, cloud, and IoT applications. It unifies the former separate .NET Framework, .NET Core, and Xamarin lineages into a single runtime and SDK starting with .NET 5, with C# as its primary language.

## Key Concepts
- CLR (Common Language Runtime) — manages memory, JIT compilation, exception handling, GC
- CIL/IL and the "any language, one runtime" model (C#, F#, VB.NET all compile to IL)
- BCL (Base Class Library) — standardized APIs across all app types
- ASP.NET Core — web/API framework built on top of the runtime
- Assemblies, NuGet packages, and the SDK/project (`.csproj`) model
- Self-contained vs framework-dependent deployment

## Core Knowledge
- .NET Framework (Windows-only, legacy) vs .NET (Core-based, cross-platform, actively developed) — new work targets .NET, not Framework
- GC is generational and non-deterministic; `IDisposable`/`using` needed for deterministic cleanup of unmanaged resources
- JIT compiles IL to native code at runtime; AOT (Ahead-of-Time) compilation available for startup-sensitive or trimmed deployments
- Dependency injection and configuration are built into the framework, not bolted-on libraries
- Async/await is pervasive; blocking on async code (`.Result`, `.Wait()`) risks deadlocks in synchronization-context-bound apps
- Strong versioning via Target Framework Moniker (TFM, e.g. `net8.0`) controls API surface and language features available
- LTS (Long Term Support) releases (even-numbered, e.g. .NET 8) get 3 years support; STS releases get 18 months
- Cross-platform: runs on Windows, Linux, macOS via the same runtime and SDK

## Interview Questions
**Q:** What's the difference between .NET Framework and .NET (Core)?
**A:** .NET Framework is Windows-only and in maintenance mode; .NET (5+) is the cross-platform, actively developed, higher-performance successor.

**Q:** What is the CLR and what does it do?
**A:** The runtime that executes IL code — handles JIT compilation, garbage collection, type safety, and exception handling.

**Q:** When would you choose AOT compilation over JIT?
**A:** When fast startup and small footprint matter more than peak throughput, e.g. CLI tools, serverless functions, containers.

**Q:** Why can `.Result` on a Task cause a deadlock?
**A:** It blocks the calling thread while the continuation may need that same thread's synchronization context to resume.

## Scenario
A team building a new internal API needs it to run in Linux containers in Kubernetes, with fast cold-start and low memory footprint. They choose ASP.NET Core targeting a current LTS release, publish as a self-contained or trimmed deployment, and rely on built-in DI and configuration to keep the app portable across environments without code changes.

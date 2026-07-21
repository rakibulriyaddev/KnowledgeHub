---
id: dotnet
title: ".NET"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, framework, csharp]
parent: null
children: []
status: draft
---

## Overview
.NET is Microsoft's open-source, cross-platform platform for building web, desktop, mobile, cloud, and IoT apps. Starting with .NET 5, it brought together the older, separate .NET Framework, .NET Core, and Xamarin lines into one runtime and SDK, with C# as its main language.

## Key Concepts
- CLR (Common Language Runtime) — manages memory, JIT compilation, exception handling, GC
- CIL/IL and the "any language, one runtime" model (C#, F#, VB.NET all compile to IL)
- BCL (Base Class Library) — a standard set of APIs used across all app types
- ASP.NET Core — web/API framework built on top of the runtime
- Assemblies, NuGet packages, and the SDK/project (`.csproj`) model
- Self-contained vs framework-dependent deployment

## Core Knowledge
- .NET Framework (Windows-only, no longer actively improved) vs .NET (based on Core, cross-platform, still actively developed) — new projects should target .NET, not Framework
- The garbage collector (GC) works in generations and runs at times you cannot predict; `IDisposable`/`using` is needed to clean up unmanaged resources at a fixed, known time
- JIT turns IL into native code while the app runs; AOT (Ahead-of-Time) compilation is available when startup speed or a small deployment size matters
- Dependency injection and configuration come built into the framework, not as extra add-on libraries
- Async/await is used everywhere; blocking on async code with `.Result` or `.Wait()` can cause deadlocks in apps tied to a synchronization context
- Versioning is strict, through a Target Framework Moniker (TFM, e.g. `net8.0`), which controls which APIs and language features are available
- LTS (Long Term Support) releases (even-numbered, e.g. .NET 8) get 3 years of support; STS releases get 18 months
- Cross-platform: runs on Windows, Linux, macOS via the same runtime and SDK

## Interview Questions
**Q:** What's the difference between .NET Framework and .NET (Core)?
**A:** .NET Framework is Windows-only and only gets small maintenance updates now; .NET (5 and later) is the cross-platform, actively developed successor, and it performs better.

**Q:** What is the CLR and what does it do?
**A:** The runtime that runs IL code — it handles JIT compilation, garbage collection, type safety, and exception handling.

**Q:** When would you choose AOT compilation over JIT?
**A:** When fast startup and a small footprint matter more than top speed under heavy load — for example, CLI tools, serverless functions, or containers.

**Q:** Why can `.Result` on a Task cause a deadlock?
**A:** It blocks the calling thread, but the code that runs after the await may need that same thread's synchronization context to continue — so it gets stuck waiting for itself.

## Scenario
A team building a new internal API needs it to run in Linux containers on Kubernetes, with fast cold-start time and low memory use. They choose ASP.NET Core, targeting a current LTS release, and publish it as a self-contained or trimmed deployment. They rely on the built-in DI and configuration to keep the app portable across environments without changing any code.

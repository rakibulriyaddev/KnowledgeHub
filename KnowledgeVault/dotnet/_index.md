---
id: dotnet
title: ".NET"
created: 2026-06-18
modified: 2026-06-19
tags: [programming, framework, microsoft]
parent: framework
children: []
---

# .NET

**.NET** is Microsoft's free, open-source, cross-platform developer platform for building web, desktop, cloud, mobile, and IoT applications. Originally shipped as the Windows-only .NET Framework in 2002, it was reimagined as .NET Core and unified into ".NET" starting with version 5 (2020). It supports multiple languages — primarily C#, F#, and VB.NET — compiled to a common intermediate language (CIL) and executed by the CLR.

## Key concepts

- **CLR (Common Language Runtime)** — the runtime VM; handles JIT compilation, garbage collection, and memory safety
- **BCL (Base Class Library)** — the standard library covering collections, I/O, networking, threading, and more
- **C#** — the dominant language; statically typed, object-oriented, with first-class `async`/`await` support
- **ASP.NET Core** — the web framework for REST APIs, MVC apps, gRPC services, and Blazor UIs
- **NuGet** — the package manager for discovering and consuming .NET libraries
- **`dotnet` CLI** — the unified toolchain for creating, building, testing, and publishing projects

## Minimal example

```csharp
var names = new[] { "Ada", "Linus", "Grace" };

foreach (var name in names)
{
    Console.WriteLine($"Hello, {name}!");
}
```

Run with `dotnet run` from any `.csproj` project.

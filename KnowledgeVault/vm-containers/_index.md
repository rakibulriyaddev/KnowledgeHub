---
id: vm-containers
title: "VMs and Containers"
created: 2026-07-11
modified: 2026-07-11
tags: [infrastructure, virtualization, devops, cloud-computing]
parent: reliability-security
children: []
status: draft
---

## Overview

Virtual machines and containers are the two dominant ways to package and isolate workloads on shared hardware. A VM is like renting a whole separate house — its own OS, kernel, and resources; a container is like an apartment in a shared building — isolated but sharing the host's kernel and core infrastructure.

## Key Concepts

- Hypervisor — the layer connecting VMs to hardware (Type 1 bare-metal vs Type 2 hosted).
- Containers — share the host OS kernel via Linux namespaces (isolation) and cgroups (resource limits).
- Docker — standardized the image/container/registry model that made containers mainstream.
- Kubernetes (K8s) — orchestrates containers at scale: auto-scaling, self-healing, rolling deployment, service discovery.
- Hybrid deployment — containers running inside VMs is the modern cloud-native default.
- Isolation tradeoff — VMs offer stronger isolation; containers are lighter and faster but share more risk surface.

## Core Knowledge

A **VM** runs a full guest OS on top of a hypervisor (Type 1/bare-metal like VMware ESXi and Hyper-V, or Type 2/hosted like VirtualBox), giving strong isolation and the ability to run different OS families side by side — at the cost of GB-scale images, multi-minute boot times, and real resource overhead. A **container** instead shares the host's OS kernel and isolates only the process, filesystem, and configuration, using Linux namespaces for isolation and cgroups for resource control — resulting in MB-scale images, second-scale boot, and much more efficient density, but weaker isolation (a Linux container can't run natively on a Windows kernel without WSL) and a larger shared-kernel attack surface.

**Docker** (2013) popularized containers with a standard image format and tooling: an **image** is a read-only template built from a **Dockerfile**, a **container** is a running instance of that image, and a **registry** (Docker Hub, ECR, GCR) stores images for distribution. Running containers at real production scale (hundreds to thousands) by hand is untenable, which is what **Kubernetes** solves — auto-scaling, self-healing (restarting crashed containers), rolling zero-downtime deployments, load balancing, and service discovery, organized around Pods (the smallest deployable unit), Nodes, Clusters, Deployments, Services, and Ingress.

Choosing between them depends on the use case: VMs suit multi-OS requirements, strong multi-tenant isolation, legacy applications, and long-running stable workloads; containers suit microservices, CI/CD, fast elastic scaling, and cloud-native DevOps workflows. **Note:** the standard modern pattern is actually hybrid — a Kubernetes node itself runs inside a VM, and Kubernetes schedules containers on top of it, capturing benefits from both layers. **Caution:** because containers share a kernel, security requires extra discipline — minimal images (Alpine/distroless), non-root users, read-only filesystems where possible, image vulnerability scanning, and runtime detection tools (like Falco) — hypervisor escapes on VMs are comparatively rare, but container escapes and kernel exploits are a real, more common risk.

## Interview Questions

**Q: What is the fundamental architectural difference between a VM and a container?**
A: A VM virtualizes hardware and runs a complete guest OS with its own kernel on top of a hypervisor. A container virtualizes at the OS level, sharing the host kernel and isolating only the process/filesystem/config via namespaces and cgroups — which is why containers are far lighter and faster to start, but offer weaker isolation.

**Q: Why can't you run a Linux container natively on a Windows host without something like WSL?**
A: Because a container shares the host's kernel rather than bringing its own — a Linux container needs Linux kernel features (namespaces, cgroups) to run, which a native Windows kernel doesn't provide directly. WSL (Windows Subsystem for Linux) works around this by running an actual Linux kernel.

**Q: Why do modern cloud deployments typically run containers inside VMs rather than choosing one exclusively?**
A: It captures the strengths of both layers — the VM boundary provides strong isolation and multi-tenant security at the infrastructure level, while Kubernetes-managed containers on top give fast, lightweight, elastic application deployment. AWS EC2 (VM) running EKS (Kubernetes/containers) is a typical example.

## Scenario

A startup building a microservices platform needs to deploy dozens of services with fast, elastic scaling and frequent CI/CD releases. They containerize each service with Docker, using multi-stage builds and Alpine base images to keep images small, then deploy onto a Kubernetes cluster where nodes are themselves VMs on AWS EC2. Kubernetes handles auto-scaling under load, restarts crashed pods automatically, and performs rolling deployments with zero downtime — while the underlying VM layer still provides strong tenant isolation between the cluster and other workloads on the same cloud infrastructure.

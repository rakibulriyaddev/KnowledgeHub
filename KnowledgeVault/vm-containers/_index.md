---
id: vm-containers
title: "VMs and Containers"
created: 2026-07-11
modified: 2026-07-22
tags: [infrastructure, virtualization, devops, cloud-computing]
parent: reliability-security
children: []
status: draft
---

## Overview

Virtual machines and containers are the two main ways to package and isolate workloads on shared hardware. A VM is like renting a whole separate house — its own OS, kernel, and resources; a container is like an apartment in a shared building — isolated but sharing the host's kernel and core setup.

## Key Concepts

- Hypervisor — the layer connecting VMs to hardware (Type 1 bare-metal vs Type 2 hosted).
- Containers — share the host OS kernel using Linux namespaces (isolation) and cgroups (resource limits).
- Docker — made the image/container/registry model standard and brought containers into the mainstream.
- Kubernetes (K8s) — manages containers at scale: auto-scaling, self-healing, rolling deployment, service discovery.
- Hybrid deployment — containers running inside VMs is the modern cloud-native default.
- Isolation tradeoff — VMs give stronger isolation; containers are lighter and faster but share more risk.

## Core Knowledge

A **VM** runs a full guest OS on top of a hypervisor (Type 1/bare-metal like VMware ESXi and Hyper-V, or Type 2/hosted like VirtualBox), giving strong isolation and the ability to run different OS families side by side — at the cost of GB-size images, boot times of several minutes, and real resource overhead. A **container** instead shares the host's OS kernel and isolates only the process, filesystem, and settings, using Linux namespaces for isolation and cgroups for resource control — this gives MB-size images, boot times of seconds, and much better efficiency, but weaker isolation (a Linux container can't run directly on a Windows kernel without WSL) and a bigger shared-kernel risk surface.

**Docker** (2013) made containers popular with a standard image format and tools: an **image** is a read-only template built from a **Dockerfile**, a **container** is a running copy of that image, and a **registry** (Docker Hub, ECR, GCR) stores images so they can be shared. Running containers at real production scale (hundreds to thousands) by hand doesn't work, which is what **Kubernetes** solves — auto-scaling, self-healing (restarting crashed containers), rolling zero-downtime deployments, load balancing, and service discovery, built around Pods (the smallest deployable unit), Nodes, Clusters, Deployments, Services, and Ingress.

Choosing between them depends on the use case: VMs suit needs for multiple OSes, strong isolation between tenants, older applications, and long-running steady workloads; containers suit microservices, CI/CD, fast flexible scaling, and cloud-native DevOps work. **Note:** the standard modern pattern is actually a mix — a Kubernetes node itself runs inside a VM, and Kubernetes places containers on top of it, getting benefits from both layers. **Caution:** since containers share a kernel, security needs extra care — small images (Alpine/distroless), non-root users, read-only filesystems where possible, scanning images for known flaws, and runtime detection tools (like Falco) — hypervisor escapes on VMs are fairly rare, but container escapes and kernel exploits are a real, more common risk.

## Interview Questions

**Q: What is the basic structural difference between a VM and a container?**
A: A VM virtualizes hardware and runs a full guest OS with its own kernel on top of a hypervisor. A container virtualizes at the OS level, sharing the host kernel and isolating only the process/filesystem/settings through namespaces and cgroups — which is why containers are far lighter and faster to start, but give weaker isolation.

**Q: Why can't you run a Linux container directly on a Windows host without something like WSL?**
A: Because a container shares the host's kernel instead of bringing its own — a Linux container needs Linux kernel features (namespaces, cgroups) to run, which a plain Windows kernel doesn't give directly. WSL (Windows Subsystem for Linux) works around this by running an actual Linux kernel.

**Q: Why do modern cloud setups usually run containers inside VMs instead of picking just one?**
A: It captures the strengths of both layers — the VM boundary gives strong isolation and multi-tenant security at the infrastructure level, while Kubernetes-managed containers on top give fast, light, flexible app deployment. AWS EC2 (VM) running EKS (Kubernetes/containers) is a common example.

## Scenario

A startup building a microservices platform needs to deploy dozens of services with fast, flexible scaling and frequent CI/CD releases. They put each service in a Docker container, using multi-stage builds and Alpine base images to keep images small, then deploy onto a Kubernetes cluster where nodes are themselves VMs on AWS EC2. Kubernetes handles auto-scaling under load, restarts crashed pods on its own, and does rolling deployments with zero downtime — while the VM layer underneath still gives strong isolation between the cluster and other workloads on the same cloud setup.

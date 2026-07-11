---
title: "VMs and Containers — Deep Dive"
---

You want to rent a place to live. Two options: (1) a completely separate house - your own electric, water, kitchen, bathroom. (2) an apartment in a big building - separate but with shared resources. The first is a VM, the second is a container. Both have their place - which one, when?

## What is a Virtual Machine (VM)?

A **VM** means running multiple "virtual" computers on a single physical server. Each VM has its own OS, kernel, libraries, and applications.

### Structure

```
[Physical Server (Hardware)]
        ↓
[Hypervisor (VMware, KVM, Hyper-V)]
        ↓
[VM 1: Linux] [VM 2: Windows] [VM 3: Linux]
      ↓              ↓              ↓
   [App 1]        [App 2]        [App 3]
```

### Hypervisor

Connects the VMs to the hardware.

- **Type 1 (Bare-metal):** Runs directly on hardware - VMware ESXi, Xen, Hyper-V.
- **Type 2 (Hosted):** Runs on top of an OS - VirtualBox, VMware Workstation.

### Advantages

- Strong isolation - increased security.
- Can run different OSes.
- Mature technology.
- Hardware-level virtualization.

### Disadvantages

- Heavy - a full OS per VM.
- Slow boot (minutes).
- Resource overhead.
- OS license cost.

## What is a Container?

A **Container** is a lightweight, isolated process unit that shares the host's OS kernel but runs with its own filesystem, libraries, and config.

### Structure

```
[Physical Server / VM]
        ↓
[Host OS + Kernel]
        ↓
[Container Runtime (Docker, containerd)]
        ↓
[Container 1] [Container 2] [Container 3]
   App + libs    App + libs    App + libs
```

### Core technology

- **Linux Namespaces:** Process isolation.
- **Cgroups:** Resource control (CPU, memory).
- **Layered filesystem:** Efficient storage for images.

### Advantages

- Lightweight - KB/MB scale.
- Fast boot (seconds).
- Efficient resource use.
- "Build once, run anywhere."
- DevOps-friendly.

### Disadvantages

- Shares the same OS kernel - a Linux container doesn't run directly on Windows (without WSL).
- Weaker isolation than a VM.
- Stateful workloads are challenging.

## VM vs Container - detailed comparison

**Virtual Machine:** Full OS per VM; GB scale; boot in minutes; strong isolation; hypervisor; multiple OS support; heavy resource use.

**Container:** Shared OS kernel; MB scale; boot in seconds; process-level isolation; container runtime; same OS family; lightweight.

## Docker - the popularization of containers

Docker (2013) made containers mainstream. A standard format plus tooling.

### Docker terminology

- **Image:** A read-only template. App plus dependencies.
- **Container:** A running instance of an image.
- **Dockerfile:** Instructions for building an image.
- **Registry:** Image storage (Docker Hub, ECR, GCR).
- **Compose:** Multi-container orchestration (dev).

### Sample Dockerfile

```
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

## Kubernetes - Container Orchestration

Managing 100-1000 containers manually in production is impossible. **Kubernetes (K8s)** solves this problem.

### Features

- **Auto-scaling:** Container count adjusts to load.
- **Self-healing:** Restarts crashed containers.
- **Rolling deployment:** Zero-downtime updates.
- **Load balancing:** In front of a service.
- **Service discovery:** Finds a container's IP.
- **Config management:** ConfigMap, Secret.

### Core concepts

- **Pod:** Smallest unit - one or more containers.
- **Node:** A physical/virtual machine.
- **Cluster:** Multiple nodes.
- **Deployment:** Manages pod replicas.
- **Service:** A stable network endpoint for pods.
- **Ingress:** Entry point for external traffic.

## Which one, when?

### VM is good when

- You need multiple OSes (Linux + Windows).
- You need strong isolation (multi-tenant).
- Legacy applications.
- Long-running, stable workloads.
- Specific hardware emulation.

### Container is good when

- Microservice deployment.
- CI/CD pipelines.
- Fast scaling.
- DevOps culture.
- Cloud-native apps.

### Hybrid: Container in VM

Standard in today's cloud - a Kubernetes node runs in a VM, and K8s deploys containers on it. The benefits of both.

## Security Considerations

- **VM:** Hypervisor escape is rare; strong isolation.
- **Container:** Shares the kernel - kernel exploit risk. Use minimal images.
- **Image scanning:** Detects vulnerable dependencies.
- **Runtime security:** Falco, runtime detection.
- **Read-only filesystem:** Avoid unnecessary writes in containers.
- **Non-root user:** Running a container as root is a security risk.

## Real-world examples

- **Google:** Borg (2003 - the ancestor of K8s).
- **Netflix:** AWS EC2 (VM) plus container hybrid.
- **Spotify:** Kubernetes-on-GCP.
- **WhatsApp:** Erlang processes in FreeBSD VMs.

## Common misconceptions

1. **"Container = lightweight VM":** No - they're fundamentally different (shared kernel).
2. **"Container is always better":** Depends on the use case.
3. **"K8s is for small projects too":** Overkill - plain Docker with a single container is enough.
4. **"Container security equals VM security":** No - weaker isolation.

## Best Practices

- Keep container images minimal (Alpine, distroless).
- Multi-stage build - keeps the final image small.
- Run as a non-root user.
- Don't put secrets in environment variables - mount them instead.
- Health check plus liveness/readiness probe.
- Set resource limits.
- Automate image scanning.

## Chapter Summary

- VM = full OS, hypervisor; heavy but strong isolation.
- Container = shared kernel; lightweight, fast.
- Docker made it mainstream; Kubernetes handles orchestration.
- Modern cloud - containers inside VMs (hybrid).
- Security: minimal images, non-root, scanning.

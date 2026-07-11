---
title: "VMs and Containers — Q&A"
---

**Q: What is the main difference between a VM and a Container?**
A: VM has a full OS; Container shares the kernel — A VM has a separate OS; a container uses the host kernel.

**Q: What is a Hypervisor?**
A: The layer between VMs and hardware — A hypervisor exists to run multiple VMs.

**Q: Example of a Type 1 hypervisor?**
A: VMware ESXi, Xen, Hyper-V — Bare-metal - runs directly on hardware.

**Q: What scale are containers typically?**
A: MB scale — Lightweight - much smaller than a VM.

**Q: Container boot time?**
A: Seconds (or less) — Fast like starting a process.

**Q: Core technology of Linux containers?**
A: Namespaces + Cgroups — Namespace = isolation; Cgroup = resource control.

**Q: What is Docker?**
A: Container platform - image, runtime, registry — Docker made containers mainstream.

**Q: What does Kubernetes do?**
A: Container orchestration - scaling, healing, networking — K8s manages containers in production.

**Q: What is a Pod?**
A: Kubernetes' smallest unit - one or more containers — A pod groups closely-coupled containers together.

**Q: A Container gives stronger isolation than a VM.**
A: False — Shared kernel - weaker isolation than a VM.

**Q: Does a Linux container run directly on a Windows host?**
A: No - different kernel (without WSL) — It requires shared, same-OS-family kernel features - like Linux kernel features.

**Q: A startup wants to deploy microservices - fast scaling. What should they use?**
A: Container + K8s — Container + orchestration is the cloud-native standard.

**Q: A multi-tenant SaaS needs strong customer isolation. What should they use?**
A: VM (better isolation) — The strong isolation of a VM is valuable for multi-tenant security.

**Q: What is the standard pattern in modern cloud?**
A: Container in VM (hybrid) — AWS EC2 (VM) + EKS (container) is typical.

**Q: Container security best practice?**
A: Non-root user, minimal image, scanning — Reduces attack surface.

**Q: What is Kubernetes' self-healing?**
A: Automatic restart of a crashed pod — Liveness probe + restart policy = auto recovery.

**Q: Technique for keeping a Docker image small?**
A: Multi-stage build + Alpine/distroless — Build artifacts go into the final image - dev tools are excluded.

**Q: Which company managed containers under the name Borg?**
A: Google (K8s ancestor) — Borg was the inspiration for open-source Kubernetes.

**Q: Hypervisor-escape attacks are rare on VMs.**
A: True — Hypervisor security is mature; container escapes are comparatively more common.

**Q: Why is a container's "build once, run anywhere" possible?**
A: The app + dependencies are in the image - it runs if the host has the same OS family — A standardized image format makes it portable.

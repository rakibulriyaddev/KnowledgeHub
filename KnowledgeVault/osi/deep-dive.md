---
title: "OSI Model — Deep Dive"
---

![OSI vs TCP/IP layers](/vault/osi/OSI_TCP_IP_layers_comparison_diagram.jpeg)

Imagine you're sending a letter from Dhaka to New York. The letter first goes from your house to the post office, then the city's post office, then the national postal service, then a plane, then the destination country's post office - at each step, a different person does a different job. Each stage has its own rules.

Sending data over the internet works exactly the same way - it's divided into many layers. The **OSI Model** was created to understand those layers systematically.

## What is the OSI Model?

**OSI** means *Open Systems Interconnection*. It's a conceptual framework created in 1984 by **ISO** (International Organization for Standardization), which divides network communication into **7 layers**.

**Note:** An easy way to remember, from the top layer down - *"All People Seem To Need Data Processing"* - Application, Presentation, Session, Transport, Network, Data Link, Physical.

## Why is the OSI Model important?

- **Easy to isolate problems:** If you know which layer has the issue, debugging becomes easier.
- **Standardization:** Devices from different companies can work together.
- **Modular design:** Changing one layer doesn't affect the others.
- **Helps learning:** Complex networking can be learned step by step.

## The 7 layers in detail

### Layer 7 - Application Layer
The layer closest to the user. This is where the apps you use (browser, email client) operate.
- **Protocols:** HTTP, HTTPS, FTP, SMTP, DNS
- **Example:** Browsing google.com with Chrome

### Layer 6 - Presentation Layer
Data formatting, encryption, compression are this layer's job. It converts data into the right format before sending it over the network.
- **Example:** SSL/TLS encryption, JPEG/PNG image format, ASCII/Unicode conversion

### Layer 5 - Session Layer
This layer is responsible for starting, maintaining, and ending a session between two devices.
- **Example:** Establishing and maintaining a connection between two people on a video call
- **Protocols:** NetBIOS, RPC

### Layer 4 - Transport Layer
Splitting data into small segments and ensuring end-to-end delivery is this layer's job.
- **Protocols:** TCP (reliable), UDP (fast)
- **Job:** Using port numbers, error detection, flow control

### Layer 3 - Network Layer
Packet routing - determines which path the data will take.
- **Protocols:** IP, ICMP, OSPF
- **Device:** Router
- **Example:** Which route a packet takes from Dhaka to New York

### Layer 2 - Data Link Layer
Direct communication between two devices on the same network. Uses MAC addresses.
- **Protocols:** Ethernet, Wi-Fi (802.11), PPP
- **Device:** Switch, Bridge
- **Example:** Direct communication between an office laptop and printer

### Layer 1 - Physical Layer
The lowest layer. Sending 0s and 1s through physical media like cables, radio signals, fiber optics.
- **Example:** Ethernet cable, fiber optic, Wi-Fi signal
- **Device:** Hub, Repeater, NIC

## How data travels layer by layer

You typed google.com in Chrome and pressed Enter. Let's see what happens:

1. **Layer 7 (Application):** Chrome creates an HTTP request.
2. **Layer 6 (Presentation):** Data gets encrypted with SSL.
3. **Layer 5 (Session):** A session opens with Google.
4. **Layer 4 (Transport):** Data is split into TCP segments, port 443 is used.
5. **Layer 3 (Network):** It becomes an IP packet, source and destination IP get added.
6. **Layer 2 (Data Link):** It becomes a frame, MAC address gets added.
7. **Layer 1 (Physical):** It's sent as 0s and 1s over wire/Wi-Fi.

When it reaches the Google server, this process runs in reverse - from Physical up to Application.

**Note:** This process is called *encapsulation* (while sending) and *decapsulation* (while receiving).

## OSI vs TCP/IP Model

In reality, the internet uses the **TCP/IP model**, which is a simplified 4-layer version of OSI:

```
OSI (7 layers)        TCP/IP (4 layers)
─────────────────────────────────────
Application      ┐
Presentation     ├→  Application
Session          ┘
Transport        →   Transport
Network          →   Internet
Data Link        ┐
Physical         ├→  Network Access
```

## Real-world examples

- **Wi-Fi problem?** Check Layer 1 (Physical) - whether there's a signal.
- **Not getting an IP?** Layer 3 (Network) problem.
- **Website won't open but ping works?** Layer 7 (Application) problem.

## Common misconceptions

1. **"OSI actually runs in real life":** No, it's just a conceptual model. TCP/IP is what actually runs.
2. **"Each layer is independent of the others":** No, they're connected to each other - the upper layer uses the services of the layer below it.
3. **"A switch is a Layer 3 device":** No, a regular switch is Layer 2. Though Layer 3 switches do exist.

## The importance of OSI in system design

- **Load Balancer:** Knowing OSI is essential to understand the difference between Layer 4 (TCP) and Layer 7 (HTTP) load balancers.
- **Firewall:** Filters at different layers - port, IP, application.
- **Troubleshooting:** Identifying which layer a problem is in leads to faster resolution.

## Chapter Summary

- The OSI Model divides network communication into 7 layers.
- From top to bottom: Application, Presentation, Session, Transport, Network, Data Link, Physical.
- Each layer has specific jobs and protocols.
- In practice, the TCP/IP (4-layer) model is used.
- Knowing OSI matters in system design for load balancers, firewalls, and troubleshooting.

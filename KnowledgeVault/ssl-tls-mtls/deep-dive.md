---
title: "SSL, TLS, mTLS — Deep Dive"
---

You're typing your password into the bKash app. That password travels from your phone all the way to bKash's server - passing through the wifi router, the ISP, and several hops along the way. If someone intercepted that traffic - could your password be stolen? Modern web has eliminated this risk with **TLS**. Behind every HTTPS site is this technology.

## Problem: the trouble with plain HTTP

- **Eavesdropping:** Anyone on the network can read the data.
- **Tampering:** The data can be modified.
- **Impersonation:** A fake server can pretend to be the real one.

## SSL and TLS

### SSL (Secure Sockets Layer)

Created by Netscape (1995) - an old protocol. SSL 2.0 and 3.0 are vulnerable and **deprecated**.

### TLS (Transport Layer Security)

The successor to SSL (1999). The current standard.

- TLS 1.0, 1.1 - deprecated.
- TLS 1.2 - widely used.
- TLS 1.3 - modern, faster, more secure (2018).

**Note:** The term "SSL certificate" is still common - but it's actually TLS being used. The name is a legacy holdover.

## TLS's three goals

- **Confidentiality:** Data is encrypted - eavesdropping is impossible.
- **Integrity:** Tampering with data is detectable.
- **Authentication:** Server identity is verified (client too, in mTLS).

## TLS Handshake (Simplified)

1. **ClientHello:** The client sends the supported TLS version, cipher suites, and a random number.
2. **ServerHello + Certificate:** The server's choice plus its certificate (public key).
3. **Verify certificate:** The client's browser checks it against a CA.
4. **Key exchange:** A symmetric key is established between the parties - via Diffie-Hellman.
5. **Finished:** Encrypted communication begins.

```
Client → Server: Hello + ciphers
Server → Client: Hello + certificate
Client: verify cert with CA
[Key exchange]
Both: derive shared symmetric key
Now: all data encrypted with symmetric key
```

### TLS 1.3 Improvements

- 1-RTT handshake (TLS 1.2 was 2-RTT).
- 0-RTT resumption - repeat connections are even faster.
- Weak ciphers removed.
- Forward secrecy is mandatory.

## Certificate

A certificate is a digital ID card that proves a server's identity.

### Components

- **Subject:** The domain name (example.com).
- **Public Key:** Used for encryption.
- **Issuer:** Signed by a Certificate Authority (CA).
- **Validity:** Start and expiry dates.
- **Signature:** The CA's digital signature.

### Certificate Authority (CA)

- A trusted entity - DigiCert, Let's Encrypt, GlobalSign.
- Verifies domain ownership before issuing a certificate.
- Browsers ship with a pre-installed list of root CAs.

### Let's Encrypt

A free, automated CA (2016+). Today it powers the majority of the web's HTTPS.

## Symmetric vs Asymmetric

- **Asymmetric (RSA, ECDSA):** Public + private key. Slow. Used for key exchange during the handshake.
- **Symmetric (AES):** A single shared key. Fast. Used for actual data encryption.

TLS uses both - asymmetric to establish a symmetric key during the handshake, then symmetric for the data.

## Mutual TLS (mTLS)

In standard TLS the client verifies the server. In mTLS **both sides** verify each other.

### Why is it needed?

- Service-to-service authentication in microservices.
- API security - for example in banking.
- IoT device authentication.
- Zero-trust networks.

### How it works

1. The server presents its certificate (normal TLS).
2. The server requests a certificate from the client.
3. The client presents its client certificate.
4. The server verifies whether it's a known/trusted client.

### Use cases

- Service mesh (Istio enables mTLS by default).
- Banking API integrations.
- Internal microservices.

## SSL vs TLS vs mTLS

**SSL:** Old (1995); deprecated; vulnerable; don't use.

**TLS:** Modern; server auth only; HTTPS standard; public web.

**mTLS:** TLS + client auth; both verify; microservice, API; zero-trust.

## Real-world examples

- **HTTPS websites:** All of the modern web - TLS.
- **Email (SMTP/IMAP STARTTLS):** TLS.
- **VPN:** TLS-based.
- **Service mesh (Istio):** automatic mTLS.
- **Banking integrations:** mTLS is standard.
- **Kubernetes etcd:** mTLS internally.

## Performance Considerations

- The handshake is CPU-intensive - connection reuse matters.
- TLS 1.3 is 1-RTT (TLS 1.2 is 2-RTT).
- Session resumption - makes repeat connections fast.
- HTTP/2 + TLS is standard.
- SSL termination - decrypting at the reverse proxy.

## Common Pitfalls

- Expired certificates - can take a site down (the Microsoft Teams 2020 incident).
- Self-signed certs in production - trigger browser warnings.
- Weak cipher suites.
- Mixed content (an HTTP asset on an HTTPS page).
- Missing HSTS - opens the door to downgrade attacks.

## Common misconceptions

1. **"SSL = TLS":** No - TLS is the replacement; SSL is deprecated.
2. **"HTTPS = secure":** It's only encryption; XSS, SQL injection, and other app-level issues are separate.
3. **"Cert renewal is manual":** Let's Encrypt automates it.
4. **"mTLS is overkill":** It's a default trend in modern microservices.

## Best Practices

- HTTPS everywhere - enable HSTS.
- TLS 1.2 minimum, prefer 1.3.
- Strong cipher suites - disable weak ones.
- Auto-renew certificates (Let's Encrypt).
- Certificate transparency monitoring.
- Use mTLS for internal services.
- Run an SSL Labs test (aim for grade A).

## Chapter Summary

- SSL is deprecated; TLS is the modern standard.
- TLS = encryption + server auth + integrity.
- mTLS = both sides authenticated.
- Certificates come from a CA - Let's Encrypt is free and automated.
- TLS 1.3 is the fastest and most secure.

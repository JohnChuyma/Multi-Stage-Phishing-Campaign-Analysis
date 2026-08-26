# Analysis: Arlento Proof-of-Work Verification Infrastructure

## Overview

Analysis of the Arlento client-side JavaScript found a custom proof-of-work (PoW) verification system used to control access to further content hosted behind the infrastructure. Unlike other phishing workflows that rely on CAPTCHA services or simple landing pages, Arlento required visitors to perform computational work before being validated.

Since the backend was inaccessible during the investigation, analysis was limited to the client-side implementation.

---

## Key Findings

### Server-Controlled Computational Challenge

The verification process begins with a request to:

```text
GET /c4a8b2
```

The server responds with challenge parameters including:

* Nonce
* Difficulty value
* Client identifier
* Hashing rounds

These parameters are used to generate a proof-of-work solution that must be submitted for validation.
This design allows the creator to adjust requirements without changing the client code.

---

### Multi-Core Proof-of-Work Processing

The script automatically creates a worker pool based on:

```javascript
navigator.hardwareConcurrency
```

This enables the challenge to utilize all available CPU cores on the victim system.

Work is divided across browser Web Workers, allowing multiple proof-of-work calculations to execute simultaneously until a valid solution is discovered.

---

### SHA-256 Hash-Based Validation

The proof-of-work mechanism relies on repeated SHA-256 hashing through the browser's Web Crypto API.

A candidate solution is repeatedly hashed and compared against a threshold derived from the server-provided difficulty value. The process continues until a valid result is found.

The implementation resembles cryptocurrency-style proof-of-work systems and is substantially more complex than conventional CAPTCHA-based access controls.

---

### Deliberate Execution Delay

After a valid solution is discovered, the script enforces a minimum execution time of approximately three seconds before continuing.

This behavior appears intentional and may serve several purposes:

* Standardizing client behavior
* Discouraging automation
* Increasing computational cost for bulk requests
* Obscuring actual solution time

The delay occurs regardless of how quickly the challenge is solved.

---

### Backend-Gated Workflow

Successful verification requires submission of a proof-of-work solution to:

```text
POST /v9f3e1
```

Only after a successful response does the infrastructure reveal the next destination through either:

```text
redirect
```

values returned by the backend or requests to:

```text
GET /get-session
```

This design prevents analysts from determining the post-verification workflow without access to a valid challenge and backend validation process.

---

## Assessment

Arlento differs significantly from the credential harvesting and malware delivery infrastructure observed elsewhere in the campaign. Rather than immediately presenting phishing content or downloading malware, the infrastructure employs a custom proof-of-work system that increases the cost of automated access and hinders analysis.

The combination of dynamic challenge issuance, multi-core SHA-256 computation, enforced execution timing, and backend-controlled redirection suggests the primary purpose of the mechanism was to restrict access to subsequent content and reduce automated interaction with the platform. However, because backend services remained inaccessible throughout the investigation, the ultimate purpose of the post-verification content could not be determined.

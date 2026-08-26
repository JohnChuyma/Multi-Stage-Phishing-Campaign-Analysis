# Arlento Infrastructure Analysis Report

## Executive Summary

During the investigation of the phishing campaign, infrastructure associated with `partylillianrsvp.icu` was observed redirecting to `https://arlento.vu/gate`. Unlike previously analyzed campaign infrastructure, only limited analysis was possible because backend resources became inaccessible behind Cloudflare protections.

Static analysis of the client-side JavaScript identified a custom verification workflow that implements a proof-of-work (PoW) challenge rather than using Google's reCAPTCHA service. However, requests required to complete the verification process consistently returned HTTP 403 Forbidden responses, preventing further analysis of the intended post-verification workflow.

No credential collection pages, malware delivery mechanisms, or backend functionality could be confirmed from the available evidence.

---

# Scope of Investigation

## Observed Infrastructure

**Redirect Domain**

```
partylillianrsvp.icu
```

**Landing Page**

```
https://arlento.vu/gate
```

---

# Technical Analysis

## Client-Side Verification Workflow

The landing page contained heavily minified JavaScript responsible for handling the verification process.

Analysis identified the following sequence:

1. A random identifier is generated and displayed to the user.
2. A request is made to the endpoint:

```
GET /c4a8b2
```

3. The expected response appears to contain:

* Challenge nonce
* Difficulty value
* Number of hashing rounds
* Client identifier (CID)

4. Browser Web Workers perform a SHA-256 proof-of-work calculation using the Web Crypto API.

5. Upon finding a valid solution, the browser submits:

```
POST /v9f3e1
```

containing:

```
cid
pow
```

6. If verification succeeds, the application appears capable of redirecting the user to another page or retrieving a session through:

```
GET /get-session
```

before navigating to the next stage.

---

## Proof-of-Work Implementation

Unlike previous campaign infrastructure that relied on legitimate Google reCAPTCHA services, Arlento implements a custom browser-based proof-of-work mechanism.

Observed characteristics include:

* SHA-256 hashing
* Multiple Web Workers
* Difficulty-based validation
* Adjustable hashing rounds
* Server-issued nonce
* Client-side computation prior to page progression

This mechanism likely serves to slow automated requests and increase the cost of large-scale scanning or abuse.

---

# Network Observations

Attempts to retrieve the initial challenge failed.

Observed request:

```
GET /c4a8b2
```

Observed response:

```
HTTP/1.1 403 Forbidden
Server: Cloudflare
```

Because the initial challenge could not be retrieved, the remaining verification workflow could not be completed.

No responses from:

```
POST /v9f3e1
GET /get-session
```

were obtainable during the investigation.

---

# Assessment

The available evidence confirms that Arlento employed a custom verification workflow that differs significantly from the infrastructure previously observed on VGUVI.

However, Cloudflare protections prevented successful interaction with backend services. As a result, it was not possible to determine:

* Whether credentials were collected.
* Whether malware was delivered.
* What content users would receive after successful verification.
* Whether additional phishing pages existed behind the verification process.

The observed JavaScript indicates that additional stages were intended after successful proof-of-work verification, but those stages could not be reconstructed from the available evidence.

---

# Conclusion

Analysis of the Arlento infrastructure was limited by backend inaccessibility and Cloudflare protections. Static examination of the client-side JavaScript identified a custom proof-of-work verification mechanism intended to gate access to subsequent content.

Although additional endpoints and redirect logic were identified within the client-side code, the backend consistently returned HTTP 403 Forbidden responses, preventing reconstruction of the complete workflow. Consequently, no credential harvesting, malware delivery, or post-verification behavior could be confirmed.

Based on the available evidence, Arlento should be considered related campaign infrastructure whose full functionality could not be determined at the time of analysis.

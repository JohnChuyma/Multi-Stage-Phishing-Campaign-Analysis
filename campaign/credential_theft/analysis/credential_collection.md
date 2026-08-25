# Credential Collection Evidence

## Overview

Analysis of network traffic identified a credential collection workflow hosted on `vguvi.vu`.

The phishing kit used a sequence of PHP pages to collect victim credentials and move users along an authentication process:

```text
login.php
    ↓
password.php
    ↓
waiting.php
```

Each stage used server-side redirects and session tracking to maintain the victim's progress through the workflow.

---

## Observed Requests

### Email Collection Stage

Request:

```http
POST /google/rsvp/pages/login.php
```

Response:

```http
HTTP/2 302 Found
Location: password.php
```

### Password Collection Stage

Request:

```http
POST /google/rsvp/pages/password.php
```

Response:

```http
HTTP/2 302 Found
Location: waiting.php
```

---

## Key Observations

- User input was submitted using HTTP POST requests.
- The application used HTTP 302 redirects to move victims between stages.
- Credential collection was divided into separate email and password pages.
- PHP session tracking remained active throughout the workflow.
- Traffic was proxied through Cloudflare infrastructure.
- Small POST payloads (approximately 10–12 bytes) were observed during password submission.

---

## Session Management

Observed session artifacts included:

```text
PHPSESSID=<redacted>
session_id=<redacted>
```

These identifiers persisted across multiple requests and allowed the application to associate activity with a specific victim session.

---

## Request Origin

Observed request headers indicated that submissions originated from the phishing application's own pages.

Examples:

```text
Referer: pages/login.php
Referer: pages/password.php
```

Additional header:

```text
sec-fetch-site: same-origin
```

These values indicate that requests were generated within the site's authentication workflow.

---

## Credential Collection Workflow

Observed redirect sequence:

```text
Victim opens login page
           ↓
Enters email address
           ↓
POST login.php
           ↓
302 Redirect
           ↓
password.php
           ↓
Enters password
           ↓
POST password.php
           ↓
302 Redirect
           ↓
waiting.php
```

The workflow separates credential collection into multiple stages while maintaining session continuity between pages.

---

## Behavioral Analysis

The credential collection workflow appeared to be tightly integrated with the remainder of the phishing infrastructure.

Several characteristics suggest that submitted credentials were acted upon immediately after submission:

- A JavaScript-based delay was introduced prior to form submission.
- Victims were redirected through a dedicated `waiting.php` page.
- Session activity was continuously monitored through `update_online.php`.
- A Google-themed 2-Step Verification page followed the password submission stage.

During analysis, the 2-Step Verification page did not contain a field for entering one-time passwords or backup codes. Instead, it instructed users to check their device for a verification request.

This workflow suggests that harvested credentials were likely being used in near real time to initiate authentication attempts against the victim's legitimate Google account.

---

## Assessment

Traffic analysis confirmed that credential collection functionality was active at the time of investigation.

Direct evidence demonstrated:

- Email and password submission stages.
- Server-side PHP processing.
- Session-based victim tracking.
- Redirect-controlled workflow progression.
- Artificial delays designed to slow user progression.

The observed workflow is consistent with a phishing operation that uses harvested credentials immediately after submission. The combination of JavaScript delays, heartbeat monitoring, a dedicated waiting page, and a fake Google 2-Step Verification page suggests that attackers were attempting authentication against legitimate Google accounts while victims progressed through the phishing flow.

Rather than directly collecting MFA codes, the final verification page appears intended to keep victims engaged while a legitimate Google authentication prompt was delivered to the victim's trusted device. By approving the legitimate Google verification request, the victim would unknowingly authorize the attacker's concurrent login attempt.

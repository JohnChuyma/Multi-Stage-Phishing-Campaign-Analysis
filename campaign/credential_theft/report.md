# Phishing Incident Investigation Report

## Executive Summary

An investigation was conducted into the domain **vguvi.vu**, which was found to be hosting a Google-themed credential-phishing kit designed to harvest account credentials and make login attempts against the user's accounts in real time. A fake 2fa page would convince victims to approve a 2fa request as authentication attempts were made against their Google accounts. The 2fa page, followed by a real 2fa authentication request on the user's device, aided in deceiving the user that this was a real login page.

The phishing workflow used legitimate Google reCAPTCHA resources and was protected by Cloudflare infrastructure. The phishing kit also used session tracking, staged redirects, artificial delays, and victim monitoring.


---

## Scope of Investigation

### Primary URLs Identified

- `https://vguvi.vu/google/rsvp/`
- `https://vguvi.vu/google/rsvp/pages/login.php`
- `https://vguvi.vu/google/rsvp/pages/password.php`
- `https://vguvi.vu/google/rsvp/pages/waiting.php`
- `https://vguvi.vu/google/rsvp/pages/sign_in_request.php`

---

### Observed Delivery Chain

```text
Phishing Email
        ↓
nct0pyi.s.gy/<victim-specific-path>
        ↓
vguvi.vu/google/rsvp/
        ↓
CAPTCHA Verification Page
        ↓
login.php
        ↓
password.php
        ↓
waiting.php
        ↓
sign_in_request.php
```

## Incident Summary

The domain `vguvi.vu` hosted a PHP-based phishing kit designed to imitate Google's authentication workflow.

Observed behavior suggests the following attack sequence:

1. A victim receives a phishing email containing a shortened RSVP-themed URL.
2. The victim clicks a personalized tracking link.
3. The victim is redirected to a CAPTCHA-gated phishing workflow.
4. The victim is redirected to a fake Google login page.
5. The victim enters an email address.
6. The victim enters a password.
7. Submitted credentials are processed by the phishing application as the victim observes the built-in delay.
8. The victim is redirected to a Google 2FA themed page.
9. Authentication attempts are made against the legitimate Google account using the harvested credentials.
10. Google issues a legitimate authentication prompt to the victim's trusted device.
11. The victim is encouraged to approve the authentication request.
12. If approved, the attacker gains access using the previously harvested credentials.

The phishing infrastructure used Cloudflare services to hide backend systems, used Google reCAPTCHA resources to make itself more credible, and added in session tracking that allowed attackers to monitor victim activity throughout the authentication process.

---

# Attack Flow Analysis

```text
Phishing Email
        │
        ▼
Short.io Tracking Link
(nct0pyi.s.gy)
        │
        ▼
vguvi.vu/google/rsvp/
        │
        ▼
Google reCAPTCHA
        │
        ▼
login.php
        │
        ▼
password.php
        │
        ▼
waiting.php
        │
        ▼
sign_in_request.php
```


## Initial Access – CAPTCHA Verification Page

Before reaching the credential collection workflow, victims were presented with a CAPTCHA verification page.

Observed behavior included:

- Generation of a random request ID.
- CAPTCHA validation before progression.
- JavaScript-controlled redirects.
- Session-aware navigation into the phishing workflow.

Upon successful completion, victims were redirected to:

```text
/pages/login.php?session_id=<Redacted>
```

The CAPTCHA page used real Google reCAPTCHA services and Cloudflare protections. This was likely in place to stop automated tools and bots from identifying the site. 

---

## Stage 1 – Email Collection

**Page:** `login.php`

Functionality:

- Mimics Google's email entry page.
- Collects email addresses.
- Maintains victim-specific session identifiers.
- Initiates credential collection workflow.

---

## Stage 2 – Password Collection

**Page:** `password.php`

Functionality:

- Mimics Google's password entry page.
- Receives credential submissions through HTTP POST requests.
- Uses small form-encoded request bodies.
- Maintains active session tracking.

Observed JavaScript:

```javascript
event.preventDefault();
card.classList.add('submitting');

setTimeout(() => {
    event.target.submit();
}, 2000);
```

This introduced an artificial delay prior to submission.

---

## Stage 3 – Verification Delay

**Page:** `waiting.php`

Functionality:

- Displays a verification-themed loading screen.
- Delays victim progression.
- Maintains the illusion of ongoing authentication activity.

The page appears designed to provide time for authentication attempts against the victim's real Google account.

---

## Stage 4 – Fake 2-Step Verification Workflow

**Page:** `sign_in_request.php`

Functionality:

- Mimics Google's 2-Step Verification process.
- Instructs users to check their device.
- Uses familiar Google branding and language.
- Keeps victims engaged during authentication activity.

There was no MFA code entry field observed during analysis. Instead, victims were encouraged to approve a Google authentication prompt generated by the attacker's login.

---

## Observed Credential Collection

Burp Suite traffic confirmed that password data was submitted directly to the phishing application.

Observed request:

```http
POST /google/rsvp/pages/password.php?session_id=<redacted>
```

Observed payload:

```text
password=<redacted>
```

Key observations:

- Password submissions were accepted by `password.php`.
- Requests used `application/x-www-form-urlencoded`.
- Small payload sizes (10–12 bytes) were observed.
- Requests remained tied to victim-specific session identifiers.

Because credential processing occurred server-side and backend systems were hidden behind Cloudflare, the final storage destination of harvested credentials could not be directly observed.
---

## Victim Tracking and Session Monitoring

Observed endpoint:

```text
/google/rsvp/update_online.php?session_id=<Redacted>
```

Observed characteristics:

- HTTP GET requests.
- HTTP 200 responses.
- Session-specific tracking.
- Repeated requests every three seconds.

Associated JavaScript:

```javascript
setInterval(function() {
    fetch('../update_online.php?session_id=<redacted>');
}, 3000);
```

This functionality acted as a heartbeat mechanism, allowing victim activity to be monitored in near real time.

---

## Session Management

Observed session artifacts included:

```text
PHPSESSID=<redacted>
session_id=<redacted>
```

Session identifiers persisted across multiple stages of the workflow and were used to maintain continuity between phishing pages.

---

## Cloudflare Infrastructure Usage

The phishing site was hosted behind Cloudflare services.

Observed indicators included:

- Cloudflare reverse proxying.
- Cloudflare analytics resources.
- Cloudflare clearance tokens.
- HTTPS delivery through Cloudflare infrastructure.

Benefits to the operators likely included:

- Origin server concealment.
- TLS certificate provisioning.
- Improved availability.
- Additional legitimacy through HTTPS.

Cloudflare presence does not indicate that a website is trustworthy.

---

## Anti-Analysis Characteristics

The phishing infrastructure used several techniques that complicated automated analysis and detection.  
| Characteristic | Description | 
|---------|--------------------|
| Captcha-Based Gating | Access to the phishing workflow required successful completion of a CAPTCHA challenge. Which prevented many automated tools from reaching the credential collection pages. |
| Navigation Requirements | The phishing workflow required sequential progression through multiple pages. Automated tools that failed to complete intermediary stages were unable to observe the complete workflow. |
| Session-Aware Access Control | Observed behavior relied heavily on PHPSESSID, and session_id. The phishing application expected valid session creation and continuity across all stages. |
| Obfuscated Redirect Logic | The CAPTCHA page contained lightly obfuscated JavaScript responsible for redirecting users after successful CAPTCHA completion. |

### Operational Impact  

The combination of CAPTCHA validation, session-aware navigation, and redirect gating likely reduced the effectiveness of automated systems. As a result, manual interaction was required to fully observe the credential harvesting workflow.  

---

# Conclusion

The investigation confirmed that `vguvi.vu` hosted an active Google-themed phishing kit designed to harvest user credentials and facilitate unauthorized account access.

Technical evidence confirmed:
- Credential collection through `password.php`
- Session management through PHP sessions
- Active victim monitoring through `update_online.php`
- Cloudflare-based infrastructure concealment
- Legitimate Google reCAPTCHA integration
- Artificial delays and staged redirects

The observed workflow suggests harvested credentials were used immediately against legitimate Google accounts while victims were guided through verification-themed pages. Victims approving the 2fa prompt after trying to login would unknowingly authorize the attacker's login attempt.
Any credentials entered into the site should be considered compromised and remediated immediately.

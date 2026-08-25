# CAPTCHA Page Analysis

## Overview

Analysis of the CAPTCHA page identified JavaScript responsible for generating a fake request identifier and redirecting victims into the phishing workflow after CAPTCHA completion.

The page creates the appearance of a verification step before directing users to the credential collection pages.

---

## Observed Functionality

### Request ID Generation

The page generates a random identifier using JavaScript:

```javascript
generateRequestId()
```

The generated value is displayed to the user through:

```javascript
document.getElementById('request-id').textContent
```

The request ID appears to serve a cosmetic purpose and was not observed being transmitted as part of subsequent requests.

---

### CAPTCHA Success Handler

When CAPTCHA validation succeeds, the following function executes:

```javascript
function onCaptchaSuccess(captchaToken) {
    const redirectUrl =
        'pages/login.php?session_id=<Redacted>';

    const redirectDelayMs = 1000;

    setTimeout(() => {
        window.location.href = redirectUrl;
    }, redirectDelayMs);
}
```

Observed behavior:

- Redirect occurs after successful CAPTCHA completion.
- The user is forwarded to `login.php`.
- A session identifier is appended to the URL.
- A one-second delay occurs before redirection.

---

## Obfuscation Analysis

The original script used light obfuscation techniques:

```javascript
var _0x2efe = [
    'pages/login.php?session_id=<Redacted>',
    '1000'
];
```

The obfuscated code ultimately resolves to:

```javascript
window.location.href =
    'pages/login.php?session_id=<Redacted>';
```

The obfuscation does not conceal complex functionality and appears intended primarily to discourage casual inspection of the page source.

---

## Session Tracking Integration

The CAPTCHA page redirects users using a predefined session identifier:

```text
pages/login.php?session_id=<Redacted>
```

This behavior aligns with additional findings elsewhere in the phishing kit, including:

- PHP session tracking
- Heartbeat monitoring through `update_online.php`
- Session-aware redirects
- Multi-stage authentication workflows

The session identifier allows activity to be associated with a specific victim throughout the phishing process.

---
## Use of Legitimate Third-Party Services

The CAPTCHA page incorporated legitimate external resources from both Google and Cloudflare.

Observed resources included:

- Google reCAPTCHA assets
- Cloudflare protection mechanisms
- Cloudflare analytics components

Examples:

```text
https://www.google.com/recaptcha/api2/reload
https://www.google.com/recaptcha/api2/payload
https://static.cloudflareinsights.com/beacon.min.js
```  

The use of legitimate third-party services increased the appearance of authenticity while complicating automated analysis.  

Purpose:

- Increase credibility.
- Mimic legitimate Google workflows.
- Reduce automated scanning.
- Restrict automated access.

These requests originated from Google's legitimate infrastructure but were embedded within a malicious site.  

---

## Anti-Analysis Characteristics

Several characteristics made the phishing page more difficult to analyze using automated systems:

- Google reCAPTCHA requirements restricted automated interaction.
- Cloudflare protections limited access from automated scanners and sandbox environments.
- Session tracking tied activity to individual visitors.
- Session identifiers were required for progression through the phishing workflow.
- Direct access to later pages was not always possible without following the intended redirect sequence.

During testing, some automated analysis environments were unable to progress through the CAPTCHA stage or reach the credential collection pages without first satisfying the page's verification requirements.

Observed behavior included:  

- CAPTCHA validation before progression.  
- JavaScript callbacks tied to verification events.  
- Redirects triggered only after successful completion.  

---

## Legitimacy Indicators

The phishing kit incorporated multiple elements intended to increase user trust, including:

- Legitimate Google reCAPTCHA services.
- Official Google branding.
- Inline SVG icons that visually replicated Google's user interface.
- HTTPS delivered through Cloudflare infrastructure.

Observed inline assets included:

```text
data:image/svg+xml;base64,...
```

These SVG elements were used to reproduce visual components of Google's authentication pages and improve the overall appearance of legitimacy.

No evidence was found that the SVG assets themselves performed credential collection or data exfiltration functions.

---

## Behavioral Analysis

The CAPTCHA page appears to function as an entry point into the phishing workflow.

Observed sequence:

```text
Victim accesses phishing URL
           ↓
CAPTCHA displayed
           ↓
CAPTCHA completed
           ↓
1-second delay
           ↓
Redirect to login.php
           ↓
Session tracking begins
```

The inclusion of a CAPTCHA likely serves multiple purposes:

- Increase legitimacy.
- Mimic real verification workflows.
- Reduce automated scanning.
- Filter automated bots before presenting credential collection pages.

---

## Assessment

Analysis confirmed that the CAPTCHA page serves as the initial gateway into the phishing workflow.

Upon successful CAPTCHA completion, victims are redirected into a session-tracked authentication sequence beginning with `login.php`.

The use of JavaScript-obfuscated redirects, session identifiers, and delayed navigation demonstrates a deliberate effort to manage victim progression through the phishing process while maintaining session continuity across multiple stages.

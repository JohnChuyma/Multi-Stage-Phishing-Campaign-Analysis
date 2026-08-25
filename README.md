# Multi-Stage Phishing Campaign Investigation

## Overview

This repository documents the investigation of a multi-stage phishing campaign that targeted multiple organizations before later spreading to a university community.

Over the course of the investigation, the campaign was observed evolving from Google credential harvesting to custom verification infrastructure and ultimately malware delivery.

As the investigation progressed, it became clear that individual domains represented campaign stages rather than standalone incidents. The repository has since been organized by campaign function rather than specific infrastructure names, which allowed additional domains and infrastructure to be incorporated as they were identified.

## Campaign Components

### Credential Theft

The earliest observed campaign stage focused on harvesting Google account credentials.

The primary observed infrastructure was hosted on `vguvi.vu`, which imitated Google's authentication workflow using legitimate Google reCAPTCHA resources, staged PHP pages, session-aware victim tracking, heartbeat monitoring, and Cloudflare-protected infrastructure. Personalized Short.io tracking links were used to direct victims into the phishing workflow.

### Unknown Infrastructure

Infrastructure reached through `partylillianrsvp.icu` that redirected victims to `arlento.vu`.

Unlike the credential harvesting infrastructure, this stage implemented a custom browser-based proof-of-work verification mechanism using JavaScript Web Workers and SHA-256 hashing. Backend services became inaccessible behind Cloudflare protections during the investigation, preventing reconstruction of the post-verification workflow.

At present, the ultimate purpose of this infrastructure remains undetermined.

### Malware

The final observed campaign stage represented a transition from credential theft to malware delivery.

The primary observed infrastructure was hosted on `krishimarket.com`. Victims were presented with a fake CAPTCHA page. When the captcha was clicked, the website would profile visitors by collecting public IP and geolocation information before sending notifications to an attacker-controlled Telegram bot. The page would then redirect the victim to a page where an automatic install would download a signed copy of MSP360 Remote Monitoring and Management (RMM) software hosted on Cloudflare R2 object storage.

## Repository Structure

```text id="w4zzha"
README.md
Campaign_Report.md
campaign_analysis.md

campaign/
├── credential_theft/
├── unknown/
└── payload_dropper/
```

Each campaign stage directory contains:

* **README.md** — Investigation overview.
* **report.md** — Detailed technical analysis.
* **analysis/** — Supporting investigative notes.
* **evidence/** — Screenshots, extracted JavaScript, reverse engineering artifacts, and supporting evidence.
* **raw/** — Original captures, network traffic, and collected data.

## Key Findings

* A single phishing campaign evolved over multiple observed stages rather than relying on a static phishing kit.
* Activity was observed targeting multiple organizations before later spreading to a university community.
* Multiple compromised organizational accounts were used to distribute phishing emails, though accounts were never reused.
* Personalized Short.io tracking links were generated from names of compromised accounts.
* Google-themed credential harvesting infrastructure actively collected victim credentials.
* Session-aware victim tracking and heartbeat monitoring supported real-time phishing operations.
* Three distinct verification mechanisms were observed throughout the campaign:

  * Legitimate Google reCAPTCHA (VGUVI)
  * Custom browser-based proof-of-work (Arlento)
  * Fake CAPTCHA (Krishimarket)
* Cloudflare services consistently protected attacker infrastructure.
* Malware delivery infrastructure leveraged Cloudflare R2 object storage and a signed Living-off-the-Land Remote Monitoring and Management (LOLRMM) application.
* Telegram Bot API and IPInfo services were used for victim profiling during the malware delivery stage.
* The delivered MSP360 payload was observed under numerous filenames outside the university environment, indicating the campaign predates its observed activity within the university community.

## Related Documentation

* **[Campaign_Report.md](Campaign_Report.md)** — Executive campaign report summarizing the investigation.
* **[campaign_analysis.md](campaign_analysis.md)** — Campaign timeline, infrastructure evolution, and operational assessment.
* **[campaign/](campaign)** — Technical analysis organized by campaign stage rather than individual domains or infrastructure names.

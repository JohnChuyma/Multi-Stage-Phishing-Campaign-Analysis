# Campaign Assessment

Some of the infrastructure that was used in this campaign was used against other oganizations in the past.  
An interesting finding was that the observed MSP360 installer hash has been distributed under __99__ different filenames. This shows that the payload may have been reused across multiple phishing campaigns or targeting waves. This also shows that the malware was not made specifically for the university environment but instead was aimed for a broad audience.

# Campaign Timeline

| Date | Infrastructure | Event |
|--------|--------|--------|
| Prior to University Targeting | Unknown | Campaign infrastructure was observed targeting organizations outside the university environment. The MSP360 payload later delivered through Krishimarket had already been distributed under dozens of distinct filenames, indicating prior operational use. |
| June 24, 2026 | VGUVI | First observed phishing email sent from a compromised faculty account. RSVP-themed lure redirected victims to the Google-themed credential harvesting kit hosted on `vguvi.vu`. |
| June 25, 2026 | VGUVI | Additional phishing emails distributed from another compromised university account using the same credential harvesting workflow. |
| June 30, 2026 | Arlento | New phishing wave redirected victims through `partylillianrsvp.icu` to `arlento.vu`, which implemented a custom proof-of-work verification system. |
| June 30, 2026 | Defensive Response | University issued a phishing advisory warning users about RSVP-themed phishing emails being distributed from compromised accounts followed by a subsequent email the same day mandating users enable 2fa. |
| July 3, 2026 | Krishimarket | Campaign infrastructure shifted from credential harvesting to malware delivery. Victims encountered an RSVP themed phishing email that took them to a fake CAPTCHA workflow that profiled visitors and notified operators through Telegram while a Signed MSP360 RMM installer automatically downloaded from Cloudflare R2 object storage and delivered through a customized NSIS wrapper. |
| July 6, 2026 | Krishimarket | yet another phishing email was sent out pointing to krishimarket but the body of the email was supposedly from "The Adobe Document Cloud Team" compelling users to click a link to view a document |
| July 8, 2026 | Defensive Response | University send another adivsory warning users about rsvp themed phishing emails and urging users to set up 2fa |
| July 9, 2026 | Krishimarket | yet another phishing email was sent out pointing to krishimarket, This time the RSVP theme was kept in the body like what would be expected though the lnik no longer used s.gy shortner and isntead was the full krishimarket link of krishimarket<.>com/rsvp/invitation/ |

---

## Use of Compromised Accounts

The campaign relied heavily on trusted accounts to distribute phishing messages.

Every observed phishing email originated from a legitimate university account that had been previously compromised. Over the course of the campaign, different faculty and student accounts were used to deliver new phishing waves.  
Below is the observed attack sequence:

```text
Victim receives phishing email
        │
        ▼
Credentials harvested
        │
        ▼
University account compromised
        │
        ▼
Account used to distribute additional phishing emails
        │
        ▼
Campaign propagates through trusted university accounts
```

The use of legitimate accounts provided several advantages:

* Increased trust and email deliverability.
* Reduced likelihood of spam filtering.
* Improved click-through rates.
* Ability to exploit existing social and professional relationships.

While the initial compromise vector for the first university account remains unknown. the most likely event would have been a phishing email from another compromised institution, organization, or trusted contact.
## Infrastructure Adaptation

The campaign progressed from:

```text
Credential Harvesting
        │
        ▼
Protected / Gated Infrastructure
        │
        ▼
Malware Delivery
```

This evolution suggests that attackers were actively managing the campaign and adapting tactics over time.

## Operational Characteristics

Several characteristics were consistently observed across the campaign:

* Use of compromised accounts for email distribution.
* Cloudflare-protected infrastructure.
* Individualized tracking links.
* Victim monitoring and profiling.
* Rapid infrastructure turnover.
* Reliance on legitimate third-party services.
* Use of trusted software to achieve objectives.

## Personalized Tracking Links

Every observed phishing email contained a unique shortened URL generated through the **Short.io** platform using the `s.gy` domain.

Examples included:

```text
https://nct0pyi.s.gy/<UID>04
https://nct0pyi.s.gy/<UID>O2
https://nct0pyi.s.gy/<UID>
```

The unique path component seems to be made with a combination of the compromised sender's first and sometimes even last names. Though none follow the exact same pattern.

For example:

```text
https://nct0pyi.s.gy/john04
or
https://nct0pyi.s.gy/johdo
```

corresponding with the victim **John Doe**.

### Operational Advantages

The shortened links provided the attacker with several benefits:

* Individual victim tracking
* Click monitoring
* Campaign analytics
* Attribution of successful phishing attempts
* Ability to disable or modify individual links without affecting the entire campaign

---

## Change of objective

The biggest development observed during the investigation was the switch from credential theft to malware deployment.

The VGUVI infrastructure focused on harvesting Google credentials and encouraging approval of legitimate authentication prompts. By contrast, the Krishimarket infrastructure eliminated the credential theft stage entirely and instead delivered remote administration software capable of providing direct access to victim systems. This transition in the campaign happened approximately three days after the university issued a phishing advisory warning users about the RSVP-themed emails. While it cannot be determined whether the transition was a direct response to the advisory, the timing is notable.

## Overall Assessment

The evidence found, points to a phishing operation that predates its observed activity within the university environment. The campaign leveraged compromised accounts, tracked victim activity, and ultimately delivered legitimate remote administration software under attacker control.

Rather than a collection of unrelated phishing sites, VGUVI, Arlento, and Krishimarket appear to represent different stages of the same phishing campaign. The consistent use of RSVP-themed lures, compromised-account propagation, Cloudflare-protected infrastructure, and shared operational characteristics strongly indicate centralized management by the same threat actor.

The university was likely one target within a broader campaign that has continued to evolve over time, adapting both infrastructure and payload delivery methods while maintaining a consistent social engineering strategy.

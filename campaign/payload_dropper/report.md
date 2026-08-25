# Malware Analysis Report: Krishimarket Drive-by Download Campaign

## Executive Summary

On July 3, 2026, the phishing campaign transitioned from credential harvesting to malware delivery through infrastructure hosted on `krishimarket.com`.

Unlike the previously observed Google-themed phishing kit, this infrastructure presented victims with a fake CAPTCHA page. When the captcha was interacted with, the page would perform background victim profiling before redirecting and automatically starting a download for a signed Remote Monitoring and Management (RMM) installer.

There were three observed stages:

1. Victim profiling through client-side JavaScript.
2. Automatic malware delivery from Cloudflare R2 object storage.
3. Installation of a modified NSIS wrapper around a legitimately signed MSP360 RMM Agent installer.

This part of the campaign combines social engineering, legitimate cloud infrastructure, and Living-off-the-Land Remote Monitoring and Management (LOLRMM) techniques to achieve remote access.

---
## Attack Flow
```
Phishing Email  
        │  
        ▼  
krishimarket.com   
        │  
        ▼  
Fake CAPTCHA  
        │  
        ├── Collect Public IP  
        ├── Query IPInfo  
        ├── Send Telegram Notification  
        │  
        ▼  
Redirect (3 seconds)  
        │  
        ▼  
dload.html  
        │  
        ▼  
Automatic Download  
        │  
        ▼  
Cloudflare R2  
        │  
        ▼  
Signed MSP360 Installer  
        │  
        ▼  
Modified NSIS Wrapper  
        │  
        ▼  
Remote Administration Software  

```
---

# Scope of Investigation

## Primary Infrastructure

**Phishing Domain**

```text
krishimarket.com
```

**Landing Path**

```text
/rsvp/invitation/
```

**Malware Delivery Page**

```text
dload.html
```

---

# Attack Chain Analysis

## Initial Access – Fake CAPTCHA

Victims arriving at the phishing site are presented with a fake CAPTCHA interface designed to imitate.
Unlike the Google reCAPTCHA implementation observed on VGUVI, this CAPTCHA is entirely implemented in client-side JavaScript.
When the victim clicks the verification checkbox, the page immediately:

* Displays a loading animation.
* Collects victim network information.
* Sends profiling information to an attacker-controlled Telegram bot.
* Redirects the victim to the malware download page after a three-second delay.

### Victim Profiling

JavaScript analysis identified the following collection process:

1. Public IP address retrieved from:

```text
https://api64.ipify.org
```

2. Geographic information retrieved using:

```text
https://ipinfo.io
```

Collected metadata includes:

* Public IP address
* City
* Country
* Internet Service Provider (ISP)

The collected information is formatted into a Telegram message before being transmitted to attacker infrastructure.

### Telegram Logging

The page contains a hardcoded Telegram Bot API token and chat identifier.

Observed artifacts:

```text
Bot Token:
8892723652:AAHzlqOzjviiYXE08ygioj7N1WdZ1prdRNg

Chat ID:
7683234319
```

The JavaScript submits victim information directly through:

```text
https://api.telegram.org/bot<TOKEN>/sendMessage
```

This provides the attacker with near real-time notification that a victim has interacted with the page.

---

## Stage 2 – Automatic Malware Delivery

Following the three-second delay, victims are redirected to:

```text
dload.html
```

When the page loads, JavaScript immediately creates a temporary anchor element and starts a download without requiring further interaction.

Observed payload:

```text
VIP_INVITATION_E_CARD_rmm_v2_5_0_67_oidca3c87b7_a585_4f32_8343_6ca8a8aade3a.exe
```

Hosted at:

```text
https://pub-626480847b854b77889f6730d12642ee.r2.dev/
```

The malware was distributed directly from Cloudflare R2 object storage.

---

# Malware Analysis

## File Metadata

Filename

```text
VIP_INVITATION_E_CARD_rmm_v2_5_0_67_oidca3c87b7_a585_4f32_8343_6ca8a8aade3a.exe
```

File Size

```text
17,896,424 bytes (17.07 MB)
```

Installer

```text
Nullsoft Scriptable Install System (NSIS) v2.51
```

SHA-256

```text
108ef7e628d7a20bd6241a5b57149e27a6061f467123eb64061975559f8f73dc
```

---

## Digital Signature

The embedded application carries a valid code-signing certificate issued to MSPBytes Corp for the MSP360 Remote Monitoring and Management platform.

The only thing different from the original I could observe was the NSIS wrapper.  

## NSIS Wrapper Analysis  

Deobfuscation of the installer script found some odd behaviours including:  
- ### Process Suppression  
  The installer repeatedly checks for the existence of a target process before executing:  
                ```
                taskkill /F /IM <process> /T
                ```  
  This loop continues until the process no longer exists.
  
- ### Temporary Staging Directory

   Rather than installing directly into Program Files, the wrapper creates a working directory inside:  
                ```
                %TEMP%
                ```  
    before redirecting the installer path to that location.

- ### Installation Log Relocation

     The wrapper moves the generated installation log into the staging directory:  
                ```
               %TEMP%\install.log %TEMP%\...
                ```  
     Centralizing installation artifacts inside a temporary directory may reduce the visibility of installer activity if the directory is later removed.

# Installation/running the program  
At this point I Switched over to [JoeSandbox](https://www.joesandbox.com/analysis/1925086/0/html#deviceScreen) to see if it was previously documented to make my life easier and to avoid running this on my own system. Through their sandbox analysis we can see that: 
- the RMM installs with various parameters
- sets up persistence, modifies Windows firewall rules to allow UDP traffic on port 48678
- cleans up some of its installation files afterwards

---

# Living-off-the-Land RMM Technique

The campaign delivers a legitimately signed MSP360 RMM Agent rather than a traditional malware family.

Using commercially available remote administration software may allow attackers to blend malicious activity with software commonly encountered in enterprise environments.

Once installed and enrolled under attacker control, such software could provide capabilities including:

* Remote desktop access
* Remote command execution
* File transfer
* System administration
* Deployment of additional payloads

---

# Conclusion

The Krishimarket infrastructure represents a significant change in the observed campaign, transitioning from credential harvesting to malware deployment.

Rather than attempting to steal credentials directly, the campaign profiles victims through a fake CAPTCHA interface, notifies the operator through Telegram, and automatically delivers a signed MSP360 RMM installer hosted on Cloudflare R2.


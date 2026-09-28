# AstraOS Security Workstation · Guided Local Lab

AstraOS 0.2.0-alpha is a development source build for learning defensive security, application analysis, network visibility, and digital forensics. The public 0.1.1 ISO is still the previous desktop and does not include these additions. Do not describe this tool set as released until a new ISO has been built and validated.

## Scope and safety

- Practice on your own computer, disposable virtual machine, or a target covered by written authorization.
- The built-in practice site is static and binds only to 127.0.0.1:8765; it is not a production web server.
- Start and stop it from AstraOS Security Toolkit. The toolkit copies examples; it does not run commands on your behalf.
- Do not scan public, school, workplace, or third-party systems without written permission and a clearly defined scope.
- Do not guess passwords, capture other people's traffic, or run disruptive tests.
- Treat packet captures, traces, and forensic images as sensitive data. Store them securely and remove them when the exercise ends.
- Read a command before using sudo. A command can change system state or expose private information.

## 1. Start the local target

Open AstraOS Security Toolkit from the Welcome window or XFCE applications menu. Click Start local lab, then Open lab site. The sample site is served at:

    http://127.0.0.1:8765

The built-in server serves only the files under /usr/share/astraos/lab-site and listens on loopback. It stops when you stop it in the Toolkit or close the Toolkit.

If you prefer a terminal, the same local-only target can be started manually:

    python3 -m http.server 8765 --bind 127.0.0.1 --directory /usr/share/astraos/lab-site

Press Ctrl+C in that terminal to stop the manual server.

## 2. Network visibility · Nmap and Gobuster

Inspect one known port on the local training target:

    nmap -sV -p 8765 127.0.0.1

Find sample paths on that same loopback site:

    gobuster dir -u http://127.0.0.1:8765 -w /usr/share/astraos/lab-wordlist.txt

These examples are scoped to 127.0.0.1. Do not substitute an address you do not own or have written permission to assess.

## 3. Observe your own packets · tcpdump and Wireshark

With the local site running, make a request in the browser and view only its loopback traffic:

    sudo tcpdump -i lo -nn port 8765

Stop with Ctrl+C. In Wireshark choose the lo interface and use this display filter:

    tcp.port == 8765

A packet capture can contain sensitive data. Keep this exercise on your own machine and discard the capture when it is no longer needed.

## 4. Linux defense · Lynis, UFW, Fail2ban, auditd

Use Lynis to review local hardening recommendations:

    sudo lynis audit system --quick

Read your firewall state without changing it:

    sudo ufw status verbose

If the Fail2ban service is installed and running, inspect its status:

    sudo fail2ban-client status

If auditd is configured and has recorded events, view a local summary:

    sudo aureport --summary

A finding is a prompt to investigate, not proof of compromise. Do not enable firewall rules, jails, or audit settings on a remote system without authorization and a recovery plan.

## 5. Application and binary analysis · Bandit, GDB, strace, ltrace, Binwalk

Review Python source code that you wrote or may assess:

    bandit -r ./your-python-project

For programs you own, inspect a debugger or runtime trace:

    gdb ./your-own-program
    strace -f -o ./trace.txt ./your-own-program
    ltrace ./your-own-program

Trace files can include private file paths and process data. Review and store them carefully.

Inspect a firmware file you own or are allowed to analyze:

    binwalk ./owned-firmware.bin

Do not flash modified firmware to a device as part of this introductory exercise.

## 6. Forensics foundations · YARA, The Sleuth Kit, Foremost

Use only training samples and disk images you own or have explicit permission to examine. Do not download, execute, or redistribute malware samples for this guide.

Apply the included harmless marker rule to its plain-text training sample:

    yara /usr/share/astraos/lab-rules/harmless-marker.yar /usr/share/astraos/lab-samples/harmless-sample.txt

Inspect a forensic training image and recover files into a separate folder:

    mmls ./owned-lab-image.dd
    foremost -i ./owned-lab-image.dd -o ./recovered

Keep an untouched source image. Work on a copy and record the file hash and steps you took.

## Tool map

| Track | Tools | Learning goal |
| --- | --- | --- |
| Network visibility | Nmap, Gobuster, Wireshark, tcpdump | Inspect the built-in loopback site and traffic you generate |
| Linux defense | Lynis, UFW, Fail2ban, auditd | Review hardening and local system events |
| Application analysis | Bandit, GDB, strace, ltrace, Binwalk | Review your code, programs, and authorized firmware |
| Forensics | YARA, The Sleuth Kit, Foremost | Learn file classification and image analysis on owned samples |

These tools have different licenses, capabilities, and limitations. Read each installed manual and upstream documentation before relying on results. AstraOS is a learning workstation, not a substitute for a security review or professional incident response.

# AstraOS Ethical Security Lab

AstraOS 0.2.0-alpha is intended for education and defensive system administration. Practice only on a computer or lab network you own, or where you have explicit written authorization. The published 0.1.1 image does not include this development tool set.

## Ground rules

- Use a disposable virtual machine or an isolated home lab.
- Keep network exercises on `127.0.0.1` unless written permission defines a different target and scope.
- Never scan public, campus, workplace, or third-party systems without permission.
- Do not guess passwords, capture other people's traffic, or run disruptive tests.
- Back up important files before changing firewall or system settings.
- Read tool output and understand a command before running it with `sudo`.

## 1. Nmap: inspect your own local test service

Start a simple web server in a terminal, from a directory containing only files you intend to serve:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

In another terminal, inspect that one loopback port:

```sh
nmap -sV -p 8000 127.0.0.1
```

Stop the server with `Ctrl+C`. The target is explicitly loopback; do not replace it with an address you do not own or have permission to assess.

## 2. tcpdump and Wireshark: view lab traffic

With the local server running, visit `http://127.0.0.1:8000` in the AstraOS browser. In a terminal, view only loopback traffic:

```sh
sudo tcpdump -i lo -nn
```

Stop with `Ctrl+C`. You can also open Wireshark, select the `lo` loopback interface, start a capture, and generate your own local browser request. Do not capture on shared networks or other people's devices. Packet captures can contain sensitive information; delete them when the exercise is over.

## 3. Lynis: local Linux hardening review

Run the read-only quick audit on the AstraOS session:

```sh
sudo lynis audit system --quick
```

Use the report as a learning checklist. A warning is a prompt to investigate, not proof that the system is compromised. A live session resets at shutdown unless you save results elsewhere.

## 4. Bandit: review your own Python project

From a Python project directory you own or are allowed to review:

```sh
bandit -r ./your-python-project
```

Review findings in context, fix verified issues, and rerun the scan. Static analysis can miss bugs and can also flag code that is safe in its actual context.

## 5. UFW: inspect the host firewall

Check the current status before making any changes:

```sh
sudo ufw status verbose
```

Do not enable or alter firewall rules on a remote machine unless you have a recovery path and authorization. A live desktop may not preserve rule changes after shutdown.

## 6. auditd: review local audit events

Audit reports are available only when the audit service is installed, running, and has recorded events. If configured, view a summary with:

```sh
sudo aureport --summary
```

Do not assume an empty report means that no events occurred; check the service and its rules first.

## Tool reference

| Tool | Learning goal | Safe starting point |
| --- | --- | --- |
| Nmap | Inventory one owned test service | `nmap -sV -p 8000 127.0.0.1` |
| Wireshark | Understand traffic you generated | Capture `lo` while visiting the local test server |
| tcpdump | Read packet summaries | `sudo tcpdump -i lo -nn` |
| Lynis | Review Linux hardening settings | `sudo lynis audit system --quick` |
| Bandit | Find common Python code issues | `bandit -r ./your-python-project` |
| UFW | Understand host firewall state | `sudo ufw status verbose` |
| auditd | Review recorded system events | `sudo aureport --summary` |

These tools have different licenses and limitations. Consult each tool's local manual and upstream documentation before relying on its results. AstraOS is a learning environment, not a substitute for a security review or professional incident response.

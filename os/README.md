# AstraOS 0.2.1-alpha Security + Office Workstation · Development Build

AstraOS is an educational Debian 13 (trixie) amd64 live desktop. The desktop uses a familiar taskbar and quick-launch layout, a consistent dark theme, and Linux-first settings while keeping all software open source. It combines office work with an ethical security-learning workstation: LibreOffice, Firefox ESR with uBlock Origin and privacy defaults, a software center, password vault, firewall GUI, app sandbox, guided security toolkit, and a static loopback-only practice site. It does not bundle Windows or macOS software or claim to be based on those operating systems.

**Release status:** the published download is still AstraOS 0.1.1. The 0.2.1-alpha additions in this source tree are development changes and are not in that existing ISO. Build and validate a new image before calling it a release. Physical PC compatibility remains unverified. The image is live-only and has no disk installer; its UEFI loader is unsigned, so Secure Boot may need to be disabled.

## Development toolkit

- Network visibility and local web review: Nmap, Gobuster, Nikto, Wireshark, and tcpdump. Guided examples stay on loopback or owned files.
- Linux defense: Lynis, UFW, Fail2ban, auditd, and on-demand ClamAV scans.
- Application analysis: Bandit, GDB, strace, ltrace, and Binwalk.
- Forensics: YARA, The Sleuth Kit, and Foremost.
- Office work: LibreOffice Writer, Calc, and Impress, with an English spell-check dictionary.
- Browser: Firefox ESR with Debian's uBlock Origin extension package, tracking protection, and telemetry/study uploads disabled by Firefox enterprise policy. Users can still change tracking protection.
- Everyday security and system management: KeePassXC password vault, Synaptic software manager, GUFW firewall controls, and Firejail application sandbox.
- Audio and display configuration: XFCE settings, with pavucontrol for volume devices.
- Host baseline: AppArmor, a deny-inbound UFW policy, and sysctl settings for safer defaults.
- AstraOS Security Toolkit starts a static local target on 127.0.0.1:8765 and copies guided examples without executing them. Nmap, Gobuster, and Nikto examples are fixed to that local target. The YARA track includes a harmless rule and text marker, not malware.

Use tools only for authorized study and defensive practice. Do not scan systems or networks without explicit permission, capture other people's traffic, or guess credentials. Read the offline guide at config/includes.chroot/usr/share/doc/astraos/ETHICAL-SECURITY-LAB.md before using tools. The public v0.1.1 image does not include this development toolkit.

## Build on this Windows PC

The existing Ubuntu WSL distribution is the build environment. Run these commands in Ubuntu:

    sudo apt update
    sudo apt install --yes debian-archive-keyring live-build debootstrap xorriso squashfs-tools grub-pc-bin grub-efi-amd64-bin mtools isolinux rsync cpio git
    cd /mnt/c/Users/HP/Documents/Codex/AstraOS/os
    sudo bash ./build.sh

The build script copies the configuration to /var/tmp/astraos-live-build inside Ubuntu's Linux filesystem, builds there, and writes AstraOS-0.2.1-alpha-amd64.iso and its SHA-256 checksum to os/dist/. Previous images remain intact. Set ASTRAOS_BUILD_DIR to choose another Linux-filesystem build directory.

The build needs network access to Debian mirrors and several gigabytes of free space. Firewall and AppArmor behavior still needs validation in the rebuilt image and on physical hardware. No software can guarantee that an operating system is impossible to compromise. Review the package list and licenses before redistributing a build.

## First boot, updates, and recovery

- The live user is `astra`. Debian Live's standard password is `live`; it is a public default, not a private AstraOS credential. Change it for the current session with `passwd` before using administrator commands. This live session does not preserve the password change after shutdown.
- The live desktop resets at shutdown. Back up work to storage you trust and avoid keeping sensitive or irreplaceable data only in the live session.
- In a terminal, refresh package lists with `sudo apt update` and apply available updates with `sudo apt upgrade`. These changes are temporary in the live session and need an Internet connection; a new ISO is required for a durable release.
- For audio or display issues, open Applications → Settings or choose **Display & Sound Settings** in the welcome window. Hardware support varies by PC; firmware and physical-machine boot have not been validated across devices.
- If boot fails, verify the ISO checksum, try the other BIOS/UEFI boot entry, and turn off Secure Boot if the firmware rejects the unsigned UEFI loader. Remove passwords, keys, personal paths, and private logs from bug reports.
- The included ClamAV scanner is on-demand. Refresh signatures with `sudo freshclam` before scanning; signature downloads use network data, and a scan result is not a guarantee that files are safe.

AstraOS uses Debian packages and their respective licenses. It does not include Windows or macOS binaries, paid media, or Android/mod APKs. Review each package's license before redistribution. Firewall defaults, malware scans, and browser protections reduce some risks; they cannot promise zero bugs, zero attacks, or absolute privacy.

## Try the currently published image

The existing os/dist/AstraOS-0.1.1-amd64.iso is the previous basic live desktop. Write it to an 8 GB or larger USB drive with an image-writing utility, then choose that drive in the PC's firmware boot menu. Writing an image erases the selected USB drive. AstraOS runs as a live desktop and does not install onto the internal drive. The UEFI loader is unsigned, so Secure Boot may need to be disabled.

## Source layout

- config/package-lists/ selects the desktop, everyday applications, and security-learning packages.
- config/includes.chroot/ supplies the XFCE theme, AstraOS artwork, welcome app, guided toolkit, local lab site, wordlist, and offline guide.
- config/hooks/live/ applies boot-splash and build-tool compatibility settings after packages are installed.
- config/bootloaders/isolinux/ contains the AstraOS BIOS boot menu and splash artwork.
- config/bootloaders/grub-efi/grub.cfg contains the UEFI boot menu.
- build.sh builds an amd64 hybrid ISO with BIOS and UEFI boot entries and a USB EFI System Partition.

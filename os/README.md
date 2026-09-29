# AstraOS 0.2.0-alpha Security Workstation · Development Build

AstraOS is an educational Debian 13 (trixie) amd64 live desktop. This source tree is being prepared as an ethical security and office workstation with an AstraOS-branded XFCE desktop, guided toolkit utility, static loopback-only practice site, LibreOffice apps, and tools for network visibility, Linux defense, application analysis, and forensics. Its workflow borrows familiar desktop conventions without bundling Windows or macOS software or claiming to be based on those operating systems.

**Release status:** the published download is still AstraOS 0.1.1. The expanded tools, desktop utility, and local target in this source tree are development changes and are not in that existing ISO. A new image must be built and validated before calling it a release. Physical PC compatibility remains unverified. The image is live-only and has no disk installer; its UEFI loader is unsigned, so Secure Boot may need to be disabled.

## Development toolkit

- Network visibility: Nmap, Gobuster, Wireshark, and tcpdump. Guided examples stay on loopback or owned files.
- Linux defense: Lynis, UFW, Fail2ban, and auditd.
- Application analysis: Bandit, GDB, strace, ltrace, and Binwalk.
- Forensics: YARA, The Sleuth Kit, and Foremost.
- Office work: LibreOffice Writer, Calc, and Impress, with an English spell-check dictionary.
- Browser: Firefox ESR with Debian's uBlock Origin extension package for ad and tracker blocking.
- Host baseline: AppArmor, a deny-inbound UFW policy, and sysctl settings for safer defaults.
- AstraOS Security Toolkit starts a static local target on 127.0.0.1:8765 and copies guided examples without executing them. The YARA track includes a harmless rule and text marker, not malware.

Use tools only for authorized study and defensive practice. Do not scan systems or networks without explicit permission, capture other people's traffic, or guess credentials. Read the offline guide at config/includes.chroot/usr/share/doc/astraos/ETHICAL-SECURITY-LAB.md before using tools. The public v0.1.1 image does not include this development toolkit.

## Build on this Windows PC

The existing Ubuntu WSL distribution is the build environment. Run these commands in Ubuntu:

    sudo apt update
    sudo apt install --yes debian-archive-keyring live-build debootstrap xorriso squashfs-tools grub-pc-bin grub-efi-amd64-bin mtools isolinux rsync cpio git
    cd /mnt/c/Users/HP/Documents/Codex/AstraOS/os
    sudo bash ./build.sh

The build script copies the configuration to /var/tmp/astraos-live-build inside Ubuntu's Linux filesystem, builds there, and writes AstraOS-0.2.0-alpha-amd64.iso and its SHA-256 checksum to os/dist/. The previous 0.1.1 image remains intact. Set ASTRAOS_BUILD_DIR to choose another Linux-filesystem build directory.

The build needs network access to Debian mirrors and several gigabytes of free space. Firewall and AppArmor behavior still needs validation in the rebuilt image and on physical hardware. No software can guarantee that an operating system is impossible to compromise. Review the package list and licenses before redistributing a build.

## Try the currently published image

The existing os/dist/AstraOS-0.1.1-amd64.iso is the previous basic live desktop. Write it to an 8 GB or larger USB drive with an image-writing utility, then choose that drive in the PC's firmware boot menu. Writing an image erases the selected USB drive. AstraOS runs as a live desktop and does not install onto the internal drive. The UEFI loader is unsigned, so Secure Boot may need to be disabled.

## Source layout

- config/package-lists/ selects the desktop, everyday applications, and security-learning packages.
- config/includes.chroot/ supplies the XFCE theme, AstraOS artwork, welcome app, guided toolkit, local lab site, wordlist, and offline guide.
- config/hooks/live/ applies boot-splash and build-tool compatibility settings after packages are installed.
- config/bootloaders/isolinux/ contains the AstraOS BIOS boot menu and splash artwork.
- config/bootloaders/grub-efi/grub.cfg contains the UEFI boot menu.
- build.sh builds an amd64 hybrid ISO with BIOS and UEFI boot entries and a USB EFI System Partition.

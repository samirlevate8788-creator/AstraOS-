# AstraOS 0.2.0-alpha development build

AstraOS is an educational Debian 13 (trixie) amd64 live desktop. This source tree is being prepared for a 0.2.0-alpha ethical security learning build, with XFCE, AstraOS boot and desktop branding, a welcome utility, and a curated defensive security toolkit.

**Release status:** the published download is still AstraOS 0.1.1. The new security packages and guides in this source tree are development changes and are not in that existing ISO. A new image must be built and validated before calling it a release. Physical PC compatibility remains unverified. The image is live-only and has no disk installer; its UEFI loader is unsigned, so Secure Boot may need to be disabled.

## Included security learning tools in this source configuration

- Nmap for inventorying services on owned lab systems.
- Wireshark and tcpdump for observing traffic generated in an authorized lab.
- Lynis for defensive Linux configuration audits.
- Bandit for static checks on Python code you own or may review.
- UFW and auditd for learning host firewall and system audit basics.

The tools are for defensive, authorized practice. Never scan systems or networks without clear permission, intercept other people's traffic, or attempt credential guessing. Read `config/includes.chroot/usr/share/doc/astraos/ETHICAL-SECURITY-LAB.md` before using the tools.

## Build on this Windows PC

The existing Ubuntu WSL distribution is the build environment. Run these commands in Ubuntu:

    sudo apt update
    sudo apt install --yes debian-archive-keyring live-build debootstrap xorriso squashfs-tools grub-pc-bin grub-efi-amd64-bin mtools isolinux rsync cpio git
    cd /mnt/c/Users/HP/Documents/Codex/AstraOS/os
    sudo bash ./build.sh

`build.sh` copies this configuration to `/var/tmp/astraos-live-build` inside Ubuntu's Linux filesystem, builds there, and writes `AstraOS-0.2.0-alpha-amd64.iso` and its SHA-256 checksum to `os/dist/`. The old 0.1.1 image remains intact. Override `ASTRAOS_BUILD_DIR` to choose another Linux-filesystem build directory.

The build needs network access to Debian mirrors and several gigabytes of free space. Review the package list and licenses before redistributing a build.

## Try the currently published image

The existing `dist/AstraOS-0.1.1-amd64.iso` is the previous basic live desktop. Write it to an 8 GB or larger USB drive with an image-writing utility, then choose that drive in the PC's firmware boot menu. Writing an image erases the selected USB drive. AstraOS runs as a live desktop and does not install onto the internal drive. The UEFI loader is unsigned, so Secure Boot may need to be disabled.

## Source layout

- `config/package-lists/` selects the desktop, everyday applications, and 0.2.0-alpha security learning tools.
- `config/includes.chroot/` supplies AstraOS artwork, desktop defaults, the welcome app, and the offline security lab guide.
- `config/hooks/live/` applies boot-splash and build-tool compatibility settings after packages are installed.
- `config/bootloaders/isolinux/` contains the AstraOS BIOS boot menu and splash artwork.
- `config/bootloaders/grub-efi/grub.cfg` contains the UEFI boot menu.
- `build.sh` builds an amd64 hybrid ISO with BIOS and UEFI boot entries and a USB EFI System Partition.

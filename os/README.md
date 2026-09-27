# AstraOS 0.1 live build

AstraOS 0.1 starts as a Debian 13 (trixie) amd64 live system. This build tree keeps the existing website at the repository root and puts Linux distribution code under os/.

The first image is designed to boot on BIOS and UEFI PCs to an AstraOS-branded XFCE desktop with a custom boot menu and splash, browser, terminal, text editor, networking, disk tools, a small welcome app, and a developer toolchain. Debian remains visible as the underlying distribution in /etc/os-release so package managers and applications keep their normal compatibility checks.

## Build on this Windows PC

The existing Ubuntu WSL distribution is the build environment. Run these commands in Ubuntu:

    sudo apt update
    sudo apt install --yes debian-archive-keyring live-build debootstrap xorriso squashfs-tools grub-pc-bin grub-efi-amd64-bin mtools isolinux rsync cpio git
    cd /mnt/c/Users/HP/Documents/Codex/AstraOS/os
    sudo bash ./build.sh

build.sh copies this configuration to /var/tmp/astraos-live-build inside Ubuntu's Linux filesystem, builds there, and copies the resulting ISO and SHA-256 checksum to os/dist/. Override ASTRAOS_BUILD_DIR if you want a different Linux-filesystem build directory.

The build needs network access to Debian mirrors and several gigabytes of free space. The ISO is a live boot image; a disk installer is not included in this first build tree yet. The locally generated UEFI loader is unsigned, so Secure Boot may need to be disabled in firmware before booting it.

## Try the live image

Write `dist/AstraOS-0.1-amd64.iso` to an 8 GB or larger USB drive with an image-writing utility, then choose that USB drive in the PC's firmware boot menu. Writing an image erases the selected USB drive. AstraOS runs as a live desktop from the USB; this build does not install itself to the internal drive.

## Source layout

- config/package-lists/ selects desktop and utility packages.
- config/includes.chroot/ supplies AstraOS artwork, defaults, and the welcome app.
- config/hooks/live/ applies boot-splash and build-tool compatibility settings after packages are installed.
- config/bootloaders/isolinux/ contains the AstraOS BIOS boot menu and splash artwork.
- config/bootloaders/grub-efi/grub.cfg contains the UEFI boot menu.
- build.sh builds an amd64 hybrid ISO with BIOS and UEFI boot entries and a USB EFI System Partition.

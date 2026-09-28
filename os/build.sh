#!/usr/bin/env bash
set -eo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "Run this build as root, for example: sudo bash ./build.sh" >&2
  exit 1
fi

SOURCE_DIR="$(cd "$(dirname "$0")" && pwd)"
BUILD_DIR="$(printenv ASTRAOS_BUILD_DIR || printf '%s' /var/tmp/astraos-live-build)"

mkdir -p "$BUILD_DIR/config"
cp -a "$SOURCE_DIR/config/." "$BUILD_DIR/config/"
chmod 0755 \
  "$BUILD_DIR/config/includes.chroot/usr/local/bin/astraos-welcome" \
  "$BUILD_DIR/config/includes.chroot/usr/local/bin/astraos-toolkit"
BOOTLOADER_DIR="$BUILD_DIR/config/bootloaders/isolinux"
if [ -d "$BOOTLOADER_DIR" ]; then
  # live-build 3.x uses legacy locations from Debian's newer syslinux packages.
  ln -sfn /usr/lib/syslinux/isolinux.bin "$BOOTLOADER_DIR/isolinux.bin"
  ln -sfn /usr/lib/syslinux/vesamenu.c32 "$BOOTLOADER_DIR/vesamenu.c32"
  if [ ! -f "$BOOTLOADER_DIR/bootlogo" ]; then
    (cd "$BOOTLOADER_DIR" && printf 'isolinux.cfg\n' | cpio -o -H newc --quiet) > "$BOOTLOADER_DIR/bootlogo"
  fi
fi
# Ubuntu's bundled live-build 3.x only reads top-level .chroot hooks.
for HOOK in "$BUILD_DIR"/config/hooks/live/*.hook.chroot; do
  [ -f "$HOOK" ] || continue
  LEGACY_NAME="$(basename "$HOOK" .hook.chroot).chroot"
  cp -f "$HOOK" "$BUILD_DIR/config/hooks/$LEGACY_NAME"
done
if [ -d "$BUILD_DIR/config/hooks/live" ]; then
  find "$BUILD_DIR/config/hooks/live" -type f -name '*.hook.chroot' -exec chmod 0755 {} +
fi

cd "$BUILD_DIR"
lb clean
# Ubuntu's live-build 3.x firmware scan requests a non-existent root
# Contents-amd64.gz on Debian mirrors. Firmware is selected explicitly in the
# AstraOS package list instead.
lb config \
  --ignore-system-defaults \
  --mode debian \
  --distribution trixie \
  --parent-distribution trixie \
  --parent-mirror-bootstrap https://deb.debian.org/debian \
  --parent-mirror-chroot https://deb.debian.org/debian \
  --parent-mirror-chroot-security https://security.debian.org/debian-security \
  --parent-mirror-chroot-volatile https://deb.debian.org/debian \
  --parent-mirror-binary https://deb.debian.org/debian \
  --parent-mirror-binary-security https://security.debian.org/debian-security \
  --parent-mirror-binary-volatile https://deb.debian.org/debian \
  --mirror-bootstrap https://deb.debian.org/debian \
  --mirror-chroot https://deb.debian.org/debian \
  --mirror-chroot-security https://security.debian.org/debian-security \
  --mirror-chroot-volatile https://deb.debian.org/debian \
  --mirror-binary https://deb.debian.org/debian \
  --mirror-binary-security https://security.debian.org/debian-security \
  --mirror-binary-volatile https://deb.debian.org/debian \
  --architectures amd64 \
  --linux-flavours amd64 \
  --linux-packages linux-image \
  --firmware-chroot false \
  --initramfs live-boot \
  --initsystem systemd \
  --syslinux-theme live-build \
  --iso-application "AstraOS Live" \
  --iso-publisher "AstraOS Project" \
  --iso-volume "ASTRAOS_0_2" \
  --memtest none \
  --security false \
  --binary-images iso-hybrid \
  --archive-areas "main contrib non-free non-free-firmware" \
  --bootappend-live "boot=live components quiet splash username=astra hostname=astraos"

# Keep the BIOS Syslinux modules beside isolinux.bin in the ISO. The boot menu
# loads vesamenu.c32, which in turn needs ldlinux.c32, libcom32.c32 and
# libutil.c32; live-build does not consistently include these modules when
# isolinux.bin and vesamenu.c32 are supplied through legacy symlinks.
SYSLINUX_BIOS_MODULE_DIR=/usr/lib/syslinux/modules/bios
SYSLINUX_ISO_MODULE_DIR="$BUILD_DIR/config/includes.binary/isolinux"
for MODULE in ldlinux.c32 libcom32.c32 libutil.c32 vesamenu.c32; do
  if [ ! -f "$SYSLINUX_BIOS_MODULE_DIR/$MODULE" ]; then
    echo "Required BIOS boot module is missing: $SYSLINUX_BIOS_MODULE_DIR/$MODULE" >&2
    exit 1
  fi
done
mkdir -p "$SYSLINUX_ISO_MODULE_DIR"
cp -f \
  "$SYSLINUX_BIOS_MODULE_DIR/ldlinux.c32" \
  "$SYSLINUX_BIOS_MODULE_DIR/libcom32.c32" \
  "$SYSLINUX_BIOS_MODULE_DIR/libutil.c32" \
  "$SYSLINUX_BIOS_MODULE_DIR/vesamenu.c32" \
  "$SYSLINUX_ISO_MODULE_DIR/"

lb build

mkdir -p "$SOURCE_DIR/dist"
ISO_FILE="$BUILD_DIR/live-image-amd64.hybrid.iso"
if [ ! -f "$ISO_FILE" ]; then
  ISO_FILE="$BUILD_DIR/binary.hybrid.iso"
fi
if [ ! -f "$ISO_FILE" ]; then
  echo "Could not find the generated hybrid ISO in $BUILD_DIR" >&2
  exit 1
fi

# live-build 3.x only creates the BIOS boot entry. Add a self-contained GRUB
# EFI loader, then rebuild the hybrid ISO with both El Torito boot entries and
# an EFI System Partition for USB media.
EFI_WORK="$BUILD_DIR/.astraos-efi"
EFI_IMAGE="$BUILD_DIR/binary/boot/grub/efi.img"
mkdir -p "$EFI_WORK" "$(dirname "$EFI_IMAGE")"
grub-mkstandalone \
  --format=x86_64-efi \
  --output="$EFI_WORK/BOOTX64.EFI" \
  --locales="" \
  --fonts="" \
  --modules="part_gpt part_msdos iso9660 search search_label normal linux" \
  "boot/grub/grub.cfg=$SOURCE_DIR/config/bootloaders/grub-efi/grub.cfg"

truncate -s 16M "$EFI_IMAGE"
# Keep this 16 MiB removable EFI image FAT16. Forcing FAT32 at this size
# produces a filesystem that UEFI firmware cannot mount reliably.
mformat -i "$EFI_IMAGE" -v ASTRAOS ::
mmd -i "$EFI_IMAGE" ::/EFI
mmd -i "$EFI_IMAGE" ::/EFI/BOOT
mcopy -i "$EFI_IMAGE" "$EFI_WORK/BOOTX64.EFI" ::/EFI/BOOT/BOOTX64.EFI
mkdir -p "$BUILD_DIR/binary/EFI/BOOT"
cp -f "$EFI_WORK/BOOTX64.EFI" "$BUILD_DIR/binary/EFI/BOOT/BOOTX64.EFI"

DUAL_ISO="$BUILD_DIR/AstraOS-0.2.0-alpha-amd64-dual.iso"
xorriso -as mkisofs \
  -r -J -joliet-long -iso-level 3 \
  -V ASTRAOS_0_2 \
  -A "AstraOS Live" \
  -publisher "AstraOS Project" \
  -p "AstraOS v0.2.0-alpha ethical security learning build" \
  -isohybrid-mbr /usr/lib/ISOLINUX/isohdpfx.bin \
  -partition_cyl_align on \
  -partition_offset 0 \
  -partition_hd_cyl 64 \
  -partition_sec_hd 32 \
  --mbr-force-bootable \
  -iso_mbr_part_type 0x17 \
  -c isolinux/boot.cat \
  -b isolinux/isolinux.bin \
    -no-emul-boot -boot-load-size 4 -boot-info-table \
  -eltorito-alt-boot \
  -e boot/grub/efi.img -no-emul-boot \
  -append_partition 2 0xef "$EFI_IMAGE" \
  -o "$DUAL_ISO" \
  "$BUILD_DIR/binary"

cp -f "$DUAL_ISO" "$SOURCE_DIR/dist/AstraOS-0.2.0-alpha-amd64.iso"
(cd "$SOURCE_DIR/dist" && sha256sum AstraOS-0.2.0-alpha-amd64.iso > AstraOS-0.2.0-alpha-amd64.iso.sha256)
printf 'AstraOS ISO: %s\n' "$SOURCE_DIR/dist/AstraOS-0.2.0-alpha-amd64.iso"
printf 'AstraOS SHA-256: '
cut -d ' ' -f 1 "$SOURCE_DIR/dist/AstraOS-0.2.0-alpha-amd64.iso.sha256"

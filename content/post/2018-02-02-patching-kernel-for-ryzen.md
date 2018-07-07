---
title: 'Ubuntu 18.04 - Compile Kernel for Ryzen Stability'
createdDate: '2018-02-02'
author: Chad Sheets
tags:
  - ubuntu
  - ryzen
draft: true
---

Early Ryzen workstations can suffer from [stability issues](https://bugs.launchpad.net/ubuntu/+source/linux/+bug/1690085?comments=all)
in certain configurations and the prevailing solution is to compile the kernel with `CONFIG_RCU_NOCB_CPU` applied.

I'm documenting my steps as June 2018 on Ubuntu 18.04. I followed [this](http://blog.programster.org/ubuntu-16-04-compile-custom-kernel-for-ryzen)
excellent guide to get me started.

## Build the Kernel

First install the dependencies:

```bash
sudo apt-get install git build-essential kernel-package fakeroot libncurses5-dev libssl-dev ccache bison flex -y
```

On a minimal install these packages to take up around 800Mb.

Next, clone the git source into a local directory. If you plan to switch branches in the future
you can clone the whole project which will take up 3Gb+. Otherwise, add `-b linux-v4.17  --single-branch`
after `git clone` to clone the least history required.

Note: If you build a newer version of the kernel than you currently have installed you may need to upgrade packages that
depend on the kernel version manually. I had to manually install propriatary Nvidia drivers after upgrading to the latest stable kernel.

```bash
mkdir linux-kernel
cd linux-kernel
git clone git@github.com:torvalds/linux.git .
git checkout linux-4.17.y
```

Depending on your internet connection speed this might take a while.

Create a config file in the repositories root directory:

```bash
cp /boot/config-`uname -r` .config
yes '' | make oldconfig
```
If all went well, you should see a list of answered configuration options ending with something like:

```bash
#
# configuration written to .config
#
```

## Customizing for Ryzen

Now to apply the Ryzen stability patches.

In the terminal, run `make` to adjust the **.confg** file.

```bash
make menuconfig
```

You should see the following menu:

patching-kernel-for-ryzen-01

Press `/` to open a search dialog and type: `RCU_NOCB`

patching-kernel-for-ryzen-02

to arrive at the following screen:

patching-kernel-for-ryzen-03

Press `1` to enter the first option.

patching-kernel-for-ryzen-04

Press `spacebar` to enter the **RCU Subsystem** menu.

patching-kernel-for-ryzen-05

Press `spacebar` again to adjust the RCU configuration.

patching-kernel-for-ryzen-06

Navigate down to **Offload RCU callback processing from boot-selected CPUs (NEW)** and press
`spacebar` to `[*]` it.

patching-kernel-for-ryzen-07

Press the right-arrow until **Save** is selected at the bottom of the screen and press Enter.

patching-kernel-for-ryzen-08

Press enter again to save over the existing **.config** file

Finally, use the arrow keys again to navigate to **Exit**. Continue exiting until you've
returned to the original terminal window.

## Build the Kernel

To build the kernel, run the following commands:

Note: you can set **--jobs** to the maximum number of threads your CPU supports. Ryzen 7 1800 has
8 cores with multithreading so you can set it to **16**. A Ryzen 3 (4 cores, no multithreading) should
be set to **4**.

```
make clean
make --jobs=16 deb-pkg LOCALVERSION=-custom 2>&1 | tee build.log
```

It can take several hours to compile the kernel so be patient.

## Install the Kernel

To install the newly compiled kernel, replace **VERSION=** with the version you just built and run the following:

```
cd ../
KERNEL_VERSION=4.17.2
sudo dpkg -i linux-libc-dev_$KERNEL_VERSION-custom-1_amd64.deb
sudo dpkg -i linux-headers-$KERNEL_VERSION-custom_$KERNEL_VERSION-custom-1_amd64.deb
sudo dpkg -i linux-image-$KERNEL_VERSION-custom-dbg_$KERNEL_VERSION-custom-1_amd64.deb
sudo dpkg -i linux-image-$KERNEL_VERSION-custom_$KERNEL_VERSION-custom-1_amd64.deb
```

## Add Kernel Boot Parameters

Using your favorite text editor, add **rcu_nocbs=0-15** to **GRUB_CMDLINE_LINUX_DEFAULT=** in **/etc/default/grub**:

Note: 0-15 refers to threads again. You need to adjust to the number of threads your processor has.

```bash
...
GRUB_DISTRIBUTOR=`lsb_release -i -s 2> /dev/null || echo Debian`
GRUB_CMDLINE_LINUX_DEFAULT="rcu_nocbs=0-15 quiet splash"
GRUB_CMDLINE_LINUX=""
...
```

Apply the changes by running:

```bash
sudo update-grub
```

Finally, reboot into the new kernel.

```bash
sudo shutdown -r now
```

## Disable ASLR

The custom kernel reduced OS crash frequency but occasionally I'd still encounter soft-lockups with **syslog** messages
similar to:

```
watchdog: BUG: soft lockup - CPU#8 stuck for 22s! [chrome:23035]
watchdog: BUG: soft lockup - CPU#7 stuck for 22s! [WorkerPool/2248:22481]
watchdog: BUG: soft lockup - CPU#15 stuck for 22s! [Web Content:18189]
```

To fix these I followed OS maintainer advice and disabled ASLR.

ASLR, which stands for address space layout randomization, is a security measure to make the exploitation of memory corruption
vulnerabilities prohibitively complicated by randomizing a processes allocated address space.

To disable this security feature in the current session, run the following (as root):

```
echo 0 | tee /proc/sys/kernel/randomize_va_space
```

To make the change persist reboots, run the following:

```
echo "kernel.randomize_va_space = 0" > /etc/sysctl.d/01-disable-aslr.conf
```

## References

* [Ryzen 1800X Freeze Bug](https://bugs.launchpad.net/ubuntu/+source/linux/+bug/1690085)
* [Programster Blog](http://blog.programster.org/how-to-disable-aslr)
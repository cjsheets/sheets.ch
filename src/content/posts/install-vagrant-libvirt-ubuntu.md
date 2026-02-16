---
title: "Install Vagrant + libvirt on Ubuntu 16.04"
description: "Setting up Vagrant with the libvirt provider on Ubuntu, including the vagrant-mutate plugin for converting boxes."
date: 2016-10-02
tags: ["vagrant", "libvirt", "ubuntu", "linux"]
---

Vagrant could be installed using the Ubuntu package manager: `apt-get install vagrant`. It's strongly recommended, however, to download the [latest version](https://www.vagrantup.com/downloads.html) from their site and install it manually. Choose 32 or 64 bit \*.deb, download, and install with the following command:

```bash
sudo dpkg -i vagrant_*.deb
```

## Vagrant + libvirt

Vagrant supports VirtualBox, VMware and AWS out of the box and is easily extended to support more like libvirt or LXC on Ubuntu.

For use with libvirt, see the [official plugin page](https://github.com/vagrant-libvirt/vagrant-libvirt) on GitHub for detailed instructions.

I installed the following prerequisites prior to installing the libvirt plugin:

```bash
sudo apt-get install libxslt-dev libxml2-dev libvirt-dev zlib1g-dev ruby-dev
```

Once the dependencies were installed I setup the libvirt plugin using the following command:

```bash
vagrant plugin install vagrant-libvirt
```

### Using Vagrant

A sample Vagrantfile input is shown below:

```ruby
# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "debian/jessie64"
  config.vm.provider :libvirt do |libvirt|
    libvirt.storage_pool_name = "VagrantPool"
  end
end
```

Finally, launch Vagrant with the following:

```bash
vagrant init debian/jessie64; vagrant up --provider libvirt
```

## Extending Available Boxes with Mutate

[vagrant-mutate](https://github.com/sciurus/vagrant-mutate) converts vagrant boxes built for other virtualization systems to libvirt.

First, we need to setup our environment with the required dependencies:

```bash
apt-get install qemu-utils libvirt-dev ruby-dev
```

vagrant-mutate is installed as a plugin:

```bash
vagrant plugin install vagrant-mutate
```

Finally, convert boxes with the following command:

```bash
vagrant mutate https://atlas.hashicorp.com/debian/boxes/wheezy64/versions/7.11.2/providers/virtualbox.box libvirt
```

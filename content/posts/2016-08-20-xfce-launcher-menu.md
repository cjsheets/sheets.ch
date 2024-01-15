---
title: 'Custom XFCE Launcher Menu Items'
date: '2016-08-20'
author: Chad Sheets
tags:
  - xubuntu
  - ubuntu
  - linux
draft: false
---

When an application fails to register a menu shortcut, you can add one manually by creating a file in `/home/<username>/.local/share/applications/`

Below is an example of a shortcut to robomongo.

robomongo.desktop

```bash
    #!/usr/bin/env xdg-open
    [Desktop Entry]
    Version=1.0
    Terminal=false
    Type=Application
    Name=robomongo
    Exec=/opt/robomongo/bin/robomongo
    Icon=office-database
    Categories=Development
```

I typically identify available icon names by right-clicking a launcher item and checking what icons are available to change to.
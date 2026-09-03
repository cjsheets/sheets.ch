---
title: 'Custom XFCE Launcher Menu Items'
description: 'How to manually add application launcher shortcuts in XFCE when they fail to register automatically.'
date: 2016-08-20
tags: ['xubuntu', 'ubuntu', 'linux']
---

When an application fails to register a menu shortcut, you can add one manually by creating a file in `/home/<username>/.local/share/applications/`

Below is an example of a shortcut to Robomongo.

## Creating the Desktop Entry

Create a file named `robomongo.desktop`:

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

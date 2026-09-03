---
title: 'Fixing Bash on Windows Error: 0x80070002'
description: 'How to fix the 0x80070002 error when launching Bash on Windows by reinstalling the Ubuntu subsystem.'
date: 2016-10-05
tags: ['windows', 'bash', 'troubleshooting']
---

I've been testing the limits of the new Ubuntu/Bash shell on Windows and after restarting my computer it mysteriously refused to launch. Running `bash` from the command line yielded the following message:

```bash
Error: 0x80070002
```

## The Fix

After a few attempts at repair I resorted to re-installing by issuing the following commands from the command line:

```bash
lxrun /uninstall /full
lxrun /install
```

This reset the environment and deleted everything I'd done, but seemed to be the only option.

Back to square one.

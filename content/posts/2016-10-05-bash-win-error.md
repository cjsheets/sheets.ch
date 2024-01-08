---
title: 'Fixing Bash on Windows Error: 0x80070002'
date: '2016-10-05'
author: Chad Sheets
tags:
  - starter
  - gatsby
draft: false
---

I've been testing the limits of the new Ubuntu/Bash shell on Windows and after restarting my computer it mysteriously refused to launch. Running `bash` from the command line yielded the following message:

```bash
Error: 0x80070002
```

After a few attempts at repair I resorted to re-installing by issuing the following commands from the command line:

    lxrun /uninstall /full
    lxrun /install

This reset the environment and deleted everything I'd done, but seemed to be the only option.

Back to square one.
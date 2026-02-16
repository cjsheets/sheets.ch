---
title: "ReadTheDocs Dropdown"
description: "A custom MkDocs theme providing collapsible menu support based on the ReadTheDocs design."
date: 2017-10-29
repo: "https://github.com/cjsheets/mkdocs-rtd-dropdown"
tags: ["python", "mkdocs", "documentation"]
featured: true
---

I use [MkDocs](http://www.mkdocs.org/) but wish the navigation were more compact like [ReadTheDocs](https://docs.readthedocs.io/en/latest/).

In this post I'll recount the steps I followed to create the ReadTheDocs Dropdown theme.

## tldr

**Goal:** Provide collapsible menu support in a MkDocs theme.

**Results:** [mkdocs-rtd-dropdown](https://github.com/cjsheets/mkdocs-rtd-dropdown)

## Preparing the Theme

Using their theming guide, I set up a theme repository with the ReadTheDocs theme from the mkdocs repo. At this point, the theme is just a copy of the existing ReadTheDocs theme.

## Digging Deeper - Hacking MkDocs

The first step in adjusting a MkDocs theme is understanding what the MkDocs source *does* when it parses markdown.

To do this, I [forked mkdocs](https://github.com/cjsheets/mkdocs/tree/dev) and added debugging statements in a new `dev` branch.

## Development Environment

Using [virtualenv](https://virtualenv.pypa.io/en/stable/userguide/), I set up an env with my modified version of mkdocs. First I switch the official mkdocs package with my `dev` branch (currently commented out) in `requirements.txt`. Then I create and activate my environment with the following commands:

```bash
virtualenv .env
source .env/bin/activate
pip install -r requirements.txt
source .env/bin/activate
```

Now, when I run `mkdocs serve` the first output message I see is my development indicator:

```bash
(.env) mkdocs-rtd-dropdown $ mkdocs serve
INFO    -  Development Branch: cjsheets/mkdocs
INFO    -  Building documentation...
```

Now I can add debug statements anywhere in the mkdocs build process to inspect how my theme is being applied.

Alternatively, I can point `requirements.txt` to my local mkdocs repository and install using a local, development copy:

```bash
pip install -e /...path/mkdocs/
```

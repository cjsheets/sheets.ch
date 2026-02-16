---
title: "Automate Docker Hub Builds with GitHub"
description: "How to set up automated Docker Hub builds triggered by GitHub repository changes."
date: 2016-10-04
tags: ["docker", "github", "automation"]
---

Automating builds of docker containers on [hub.docker.com](https://hub.docker.com/) is a fairly straightforward process, assuming you have a repository on GitHub containing a Dockerfile.

Here is an [example repository](https://github.com/linconf/docker-debian8-ansible).

## Setting Up Automated Builds

First, on Docker Hub, choose the "Create" drop-down and select "Create an Automated Build".

If you haven't linked a GitHub or BitBucket account yet, you will be prompted to do so. Select "Link Accounts" and follow the prompts.

Select "Create an Automated Build with \< Provider \>".

From there, it's simply a matter of selecting your repository containing a Dockerfile.

## Pulling the Container

Once the automated build is setup, pulling the container is as simple as executing:

```bash
docker pull <username>/<repository>
```

Any time you push changes to the linked GitHub repository, Docker Hub will automatically rebuild the container image.

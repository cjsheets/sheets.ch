---
title: 'Automate Docker Hub Builds with GitHub'
date: '2016-10-04'
author: Chad Sheets
tags:
  - starter
  - gatsby
draft: false
---

Automating builds of docker containers on [hub.docker.com](https://hub.docker.com/) is a fairly straightforward process, assuming you have a repository on GitHub containing a Docker file.

Here is an [example repository](https://github.com/linconf/docker-debian8-ansible).

First, on Docker Hub, choose the "Create" drop-down and select "Create an Automated Build".

If you haven't linked a GitHub or BitBucket account yet, you will be prompted to do so. Select "Link Accounts" and follow the prompts.

Select "Create an Automated Build with &lt; Provider >".

From there, it's simply a matter of selecting your repository containing a Docker file.

Once the automated build is setup, pulling the container is as simple as executing a docker pull /

---
title: "AirVPN API - Python Utilities Script"
description: "A Python CLI application for polling and parsing the AirVPN API to retrieve exit IP addresses for firewall sync."
date: 2016-07-20
repo: "https://github.com/cjsheets/airvpn-utils"
tags: ["python", "api", "vpn"]
featured: true
---

As a security precaution (and because my workflow allows), I use IP filtering on my server firewalls. Not having a dedicated IP address at home means I need a way to keep my IP addresses in-sync with my servers.

My workstations are persistently connected to AirVPN which has a poll-able API providing the needed exit IP address.

> Aside: If you need a featureful VPN, I recommend AirVPN. They're an Italian based operation offering the most bang-for-the-buck service of any I've used.

The only piece I was missing was a method for polling and parsing responses from AirVPN's API.

## The Script

In an afternoon I put together [this script](https://github.com/cjsheets/airvpn-utils). It's a fairly basic Python CLI application which uses `requests` to poll and `json` to parse the [AirVPN API](https://airvpn.org/faq/api/).

Instructions for use are detailed in the README.md in the repo.

For now I've only added commands to query the information I need. In the future I intend to add commands for the remainder of AirVPN's API.

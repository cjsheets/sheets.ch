---
title: 'Improving the Simplenote Web Client'
date: '2016-08-01'
author: Chad Sheets
tags:
  - starter
  - gatsby
draft: false
---

like Markdown, use Linux, and needed a note taking app that syncs with Android. Simplenote is perfect right?

### Almost Perfect...

Simplenote is... simple. One of its best features (simplicity) can at times be a liability for usability. So, taking matters in my own hands, I set out to fix it.

Let's start with the web browser interface because it's easiest to modify. I use Firefox but all commands are portable to Chrome.

## Step 1: Minimum Window Decoration

Easy, create a bookmark that removes window decorations:
Bookmark

```javascript
javascript: void window.open(
  'https://app.simplenote.com',
  '_blank',
  'outerWidth=958,outerHeight=567,top=500,left=600,menubar=no,toolbar=no,location=no,personalbar=no,status=no,resizable'
);
```

Done. Next?

## Step 2: Stylish

Simplenote uses text and element spacing that's too large. This issue requires an extension to fix.
[Stylish Chrome](https://chrome.google.com/webstore/detail/stylish/fjnbnpbmkenffdnngjfgmeleoegfcffe?hl=en#) or
[Stylish Firefox](https://addons.mozilla.org/en-US/firefox/addon/stylish/#).

Simplenote

After installing stylish we add code targeting app.simplenote.com. I've posted my code to this [GitHub Gist](https://gist.github.com/cjsheets/aad4456946f165b27fbbe1dc01e95e7d).

And the results:

Simplenote

For me, this is much better.

## Step 3: Double Click Action

The final complaint I have about the simplenote web interface is the automatic toggling between Preview and Edit when you click twice on the window.

To prevent this behavior, we need to inject a little jQuery into the browsers debugging console. Right click on the window and select `Inspect Element`. Choose the 'Console' tab and paste the following:
Disable double-click

```javascript
$('*').click(function () {
  $('#static_content').unbind('dblclick');
});
$('#view_mode_markdown').click();
```

Inspect Element

This is certainly a little annoying but the results are worth it. When I'm working I leave the Simplenote window open long enough that I dont mind disabling double-click. I simply save the code in a note titled "Why can't I configure you Simplenote!!"

## Conclusions

That's it. With these changes I find Simplenote to be unsurpassed in functionality and convenience. In the future I'd like to get involved with their GitHub / Android client project.

If you have any additional recommendations please let me know.

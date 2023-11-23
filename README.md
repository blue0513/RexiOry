<img width="300" src="https://user-images.githubusercontent.com/8979468/219876624-7427a330-363a-41f4-988e-f5b7c7d09629.png">

# RexiOry

[![CI](https://github.com/blue0513/RexiOry/actions/workflows/ci.yml/badge.svg)](https://github.com/blue0513/RexiOry/actions/workflows/ci.yml)

RexiOry is a Chrome extension that extends the "New Tab Page" and supports fast offline fuzzy searches of History & Bookmarks.
Additionally, by displaying _Romnibar_ on the current tab, you can quickly access Rexiory.

- *This extension is strongly inspired by [chikamichi](https://github.com/kawamataryo/chikamichi) and pays the utmost respect!*
- *This extension is a prototype. We do destructive changes from time to time*

![output](https://user-images.githubusercontent.com/8979468/222137781-7b02f2ad-b052-4995-9e07-24b31f8c47ba.gif)
![Romnibar]()

## Features

- Simple UI with shortcuts
- Fast fuzzy search for History & Bookmarks
- No data is sent to the server

## Usage

1. Just follow [official instruction](https://developer.chrome.com/docs/extensions/) and install this extension
1. Just open "New Tab Page", or `Alt+R` to show _Romnibar_

### Shortcuts

| shortcut          | action                                              |
|-------------------|-----------------------------------------------------|
| `Cmd + f`         | Focus on the search field                           |
| `Cmd + Enter`     | Search with Google (When focus on the search field) |
| `Cmd + c`         | Copy URL                                            |
| `Cmd + k`         | Delete history, bookmark                            |
| `Ctrl + n/p/f/b`  | Select candidates                                   |
| `Alt + r`         | Show Romnibar                                       |

## Acknowledgments

This extension uses the followings.

- [Bootstrap](https://getbootstrap.com/)
- [jQuery](https://jquery.com/)
- [Fuse.js](https://fusejs.io/)

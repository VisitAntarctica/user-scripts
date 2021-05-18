// ==UserScript==
// @name     PornHub Tools
// @include /^https://.*\.?pornhub(premium)?\.com/view_video.php/
// @version  1.02
// @grant    none
// @noframes
// @description This includes some fixes/tools for PH UI
// ==/UserScript==

// Show all playlists when displaying the list
// Add CSS to increase the height and remove maxheight on playlist div
var style = document.createElement('style');
style.textContent = ".playlists div { height: max-content !important; max-height: none !important; }</style>";
document.head.appendChild(style);

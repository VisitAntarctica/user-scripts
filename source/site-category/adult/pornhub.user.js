// ==UserScript==
// @name     PornHub Tools
// @include /^https://.*\.?pornhub(premium)?\.com/view_video.php/
// @version  1.03
// @grant    none
// @noframes
// @description UX enhancements for PornHub power users
// ==/UserScript==

// Show all playlists when displaying the list
// Add CSS to increase the height and remove maxheight on playlist div
var style = document.createElement('style');
style.textContent = ".playlists div { height: max-content !important; max-height: none !important; }</style>";
document.head.appendChild(style);

// Show all related videos automatically
document.getElementById('loadMoreRelatedVideosCenter').click();

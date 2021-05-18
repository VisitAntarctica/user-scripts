// ==UserScript==
// @name      PornHub Tools
// @namespace /user-scripts/source/site-category/adult/pornhub.user.js 
// @include /^https://.*\.?pornhub(premium)?\.com/view_video.php/
// @version  1.05
// @grant    none
// @noframes
// @description UX enhancements for PornHub power users
// ==/UserScript==

// Show all playlists when displaying the list
// Add CSS to increase the height and remove maxheight on playlist div
var style = document.createElement('style');
style.textContent = ".playlists div { height: max-content !important; max-height: none !important; }";
document.head.appendChild(style);

/* Run when DOM is fully loaded */ 
function postrun(){
  console.log("DOMContentLoaded has fired!");
  // Show all related videos automatically
  document.getElementById('loadMoreRelatedVideosCenter').click();
  console.log("Post-load run is complete");
  document.removeEventListener(l);
};
var l = document.addEventListener("DOMContentLoaded", postrun);

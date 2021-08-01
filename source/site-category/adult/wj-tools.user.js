// ==UserScript==
// @name     Webcamjackers Tools
// @namespace /user-scripts/source/site-category/adult/wj-tools.user.js 
// @include /^https://.*\.?webcamjackers\.com/
// @version  1.02
// @grant    none
// @noframes
// @description This includes some fixes/tools for WJ UI
// ==/UserScript==

// remove broken deceptive adlinks from video walls
// JQUERY
//jQuery(jQuery.find('div.-video > a[href*="chaturbate"]')).each(function(i,e){ jQuery(e.parentNode).hide(); }); 
// native
document.querySelectorAll('div.-video > a[href*="chaturbate"]').forEach(function(e){e.parentNode.style.display="none"});
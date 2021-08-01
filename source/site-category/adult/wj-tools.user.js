// ==UserScript==
// @name     Webcamjackers Tools
// @include /^https://.*\.?webcamjackers\.com/
// @version  1.00
// @grant    none
// @noframes
// @description This includes some fixes/tools for WJ UI
// ==/UserScript==

// remove broken deceptive adlinks from video walls
jQuery(jQuery.find('div.-video > a[href*="chaturbate"]')).each(function(i,e){ jQuery(e.parentNode).hide(); });
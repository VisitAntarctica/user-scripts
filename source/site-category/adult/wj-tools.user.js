// ==UserScript==
// @name     Webcamjackers Tools
// @namespace /user-scripts/source/site-category/adult/wj-tools.user.js 
// @include /^https://.*\.?webcamjackers\.com/
// @version  1.07
// @grant    none
// @noframes
// @description This includes some fixes/tools for WJ UI
// ==/UserScript==

// remove broken deceptive adlinks from video walls
document.querySelectorAll('div.-video > a[href*="chaturbate"]').forEach(
    function(e){
        e.parentNode.style.display = "none";
    }
);
    
// remove the empty div keeping the video in a two-column
document.querySelector('div.aside_spot').style.display = 'none';

// add a download link if there's a video player on the page
var vid = document.querySelector('video#thisPlayer source') || null;
if( vid ){
    var loc = [...document.location.toString().matchAll(/\/([^\/]*?)\.html$/igm)];
    console.info(loc[0][1]);
    var titleEl = document.querySelector('h1.title');
    var vSrc = vid.getAttribute('src');
    var link = document.createElement('a');
    link.setAttribute('style','padding-left:10px; color: #aa0000 !important;');
    link.setAttribute('href', vSrc);
    link.setAttribute('download', (loc.length == 1 && loc[0].length == 2) ? loc[0][1] : titleEl.textContent.trim());
    link.textContent = "Download";
    titleEl.appendChild(link);
}

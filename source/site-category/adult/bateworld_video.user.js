// ==UserScript==
// @name      Bateworld - Video
// @namespace /user-scripts/source/site-category/adult/bateworld_video.user.js 
// @include /^https://.*\.?bateworld?\.com/video.php/
// @include /^https://.*\.?bateworld?\.com/profile.php/
// @version  1.01
// @grant    none
// @noframes
// @description Video tools for Bateworld
// ==/UserScript==

// For every video element found in the page, 
//  use page details to create an HREF to the 
//  source video file
(function() {

    // process video element
    function processVideo( el ){
        var src = el.currentSrc;
        var fileExt = src.split('.').pop();
        var title = document.getElementsByTagName('title')[0].textContent;

        var titMatch = [...title.matchAll(/^.* - (.*)'s video - (.*)$/igm)];
        //var m = [...t.matchAll(/^.* - (.*)'s video - (.*)$/igm)]; 

        var fileLabel = ( 
            titMatch.length > 0 ? 
            'bw_' + titMatch[0][1] + '_' + titMatch[0][2] + '.' + fileExt :
            title
        );
        /*if (m.length > 0) { 
            var n = 'bw_' + m[0][1] + '_' + m[0][2] + '.' + ext; 
        } else { 
            var n = t; 
        } */
        var link = document.createElement('a');
        link.href = src;
        link.style = "padding-left: 15px;";
        link.textContent = "Source file"
        link.setAttribute('download', fileLabel);

        document.getElementsByClassName('page_header')[0].append(link);

    }
    var vel = document.getElementsByTagName('video');
    for(var i = 0 ; i < vel.length ; i++ ){
        
        //jQuery('div.page_header').append('<a style="padding-left: 15px;" href="' + a.currentSrc + '" download="' + n + '">Download video</a>'); 
        //GM.setClipboard(fileLabel);
    }
})();

/* Run when DOM is fully loaded */ 
function postrun(){
    console.log("DOMContentLoaded has fired!");
    makeSourceLinks();
    console.log("Post-load run is complete");
    document.removeEventListener(l);
  };
  console.log("video.user.js has run");
var l = document.addEventListener("DOMContentLoaded", postrun);
console.log(["l has been created", l]);
// ==UserScript==
// @name      Bateworld - Video
// @namespace /user-scripts/source/site-category/adult/bateworld_video.user.js 
// @include /^https://.*\.?bateworld?\.com/video.php/
// @include /^https://.*\.?bateworld?\.com/profile.php/
// @version  1.02
// @grant    none
// @noframes
// @description Video tools for Bateworld
// ==/UserScript==

// For every video element found in the page, 
//  use page details to create an HREF to the 
//  source video file
(function() {
    document.querySelectorAll('video').forEach(
        function(el){
            // process video element
            var src = el.src;
            var fileExt = src.split('.').pop();
            var title = document.querySelector('title').textContent;
            
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
                
                document.querySelector('div.page_header').append(link);
        }
    );
})();
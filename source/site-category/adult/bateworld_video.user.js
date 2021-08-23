// ==UserScript==
// @name      Bateworld - Video
// @namespace /user-scripts/source/site-category/adult/bateworld_video.user.js 
// @include /^https://.*\.?bateworld?\.com/video.php/
// @include /^https://.*\.?bateworld?\.com/profile.php/
// @version  1.03
// @grant    none
// @noframes
// @description Video tools for Bateworld
// ==/UserScript==

var CDN_ROOT = 'https://n2h5a5n4.ssl.hwcdn.net/';
var VID_EXTENSION = '.mp4';

(function() {
    // For every video element found in the page, 
    //  use page details to create an HREF to the 
    //  source video file
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
                link.textContent = "Download video"
                link.setAttribute('download', fileLabel);
                
                document.querySelector('div.page_header').append(link);
        }
    );

    // For every video row in the related videos panel, show a download link
    document.querySelectorAll('div.video_row').forEach(
        function(el){
            // get thumb path 
            var imgSrc = el.querySelector('a img').src;
            var path = [...imgSrc.matchAll(/bateworld.com\/(.*)_thumb.jpg$/igm)];
            console.log(path);
            var d = document.createElement('div');
            var link = document.createElement('a');
            link.href = CDN_ROOT + path[0][1] + VID_EXTENSION;
            link.style = "padding-left: 15px;";
            link.textContent = 'Download';
            link.target = "_blank";
            d.append(link);
            el.querySelector('td:nth-child(2)').append(d);
        }
    );
})();
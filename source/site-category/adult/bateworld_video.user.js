// ==UserScript==
// @name      Bateworld - Video
// @namespace /user-scripts/source/site-category/adult/bateworld_video.user.js 
// @include /^https://.*\.?bateworld?\.com/video.php/
// @include /^https://.*\.?bateworld?\.com/profile.php/
// @version  1.06
// @grant    none
// @noframes
// @description Video tools for Bateworld
// ==/UserScript==

// Gravity downloader config
var GRAVITY_ON = true;
var GRAVITY_CONFIG = {
    'host': 'localhost',
    'port': '5050',
    'state': null,
    'icon': '&#128371;',
    'default_icon':'&#128279;' 
};
var GRAVITY_LINK = ( targetUrl , text , fileName , referer ) => {
    text = text || "Download video";
    var link = document.createElement('a');
    link.class = "x_gravity_link";
    if( GRAVITY_ON ){
        link.href = `http://${GRAVITY_CONFIG.host}:${GRAVITY_CONFIG.port}/?u=${urlencode(targetUrl)}&p=${urlencode(referer)}&fn=${urlencode(fileName)}`;
        link.innerHTML = `${GRAVITY_CONFIG.icon}&nbsp;${text}`;
    } else {
        link.href = targetUrl;
        link.innerHTML = `${GRAVITY_CONFIG.default_icon}&nbsp;${text}`;
    }
    if( ! fileName ){
        link.setAttribute('download', fileName);
    }
    // link.target = "_blank";
    return link;
};

var CDN_ROOT = 'https://n2h5a5n4.ssl.hwcdn.net/';
var VID_EXTENSION = '.mp4';

(function() {
    // Gravity health check
    // if( GRAVITY_ON ){
    //     var xhr = new XMLHttpRequest();
    //     xhr.onload = function(ev){
    //         GRAVITY_CONFIG.state = ( xhr.status == 200 );
    //         console.log( GRAVITY_CONFIG.state );
    //         alert( `Gravity connected: ${GRAVITY_CONFIG.state}`);
    //     }
    //     xhr.open("HEAD", `http://${GRAVITY_CONFIG.host}:${GRAVITY_CONFIG.port}/`);
    //     xhr.send();
    // }
    // Determine the title of the page so we can
    //  try to pre-set the downloaded file name
    var title = document.querySelector('title').textContent;
    // For every video element found in the page, 
    //  use page details to create an HREF to the 
    //  source video file
    window.addEventListener("load", function(){ 
        // for all the video elements in the page
        document.setTimeout(() => {
            document.querySelectorAll('video').forEach(
                function(el){
                    // process video element
                    var src = el.src;
                    var sMatch = [...src.matchAll(/\/(\d+)\..*$/igm)];
                    
                    var fileExt = src.split('.').pop();
                    var titMatch = [...title.matchAll(/^.* - (.*)'s video - (.*)$/igm)];
                    //var m = [...t.matchAll(/^.* - (.*)'s video - (.*)$/igm)]; 
                    var fileLabel = "";
                    if( titMatch.length >= 1 && titMatch[0].length >= 3 ){
                        // valid capture, set the file label
                        /*fileLabel = ( 
                            titMatch.length > 0 ? 
                            'bw_' + titMatch[0][1] + '_' + titMatch[0][2] + '.' + fileExt:
                            title
                        ); */
                        fileLabel = ( 
                            titMatch.length > 0 ? 
                            `${sMatch[0][1]} ${titMatch[0][2]}.${fileExt}`:
                            title
                        );
                    }
                    /*var link = document.createElement('a');
                    link.href = src;
                    link.style = "padding-left: 15px;";
                    link.textContent = "Download video"
                    link.setAttribute('download', fileLabel);*/
                    
                    document.querySelector('div.page_header').append(
                        GRAVITY_LINK(src, 'Download', fileLabel , document.location)
                        );
                    }
                );
        }, 3000);    
        // For every video row in the related videos panel, show a download link
        document.querySelectorAll('div.video_row').forEach(
            function(el){
                // get video title
                var titleEl = el.querySelector('div.video_row_title a');
                var title = titleEl.textContent.trim();
                var ref = titleEl.getAttribute('href');
                // get thumb path 
                var imgSrc = el.querySelector('a img').src;
                var path = [...imgSrc.matchAll(/bateworld.com\/(.*)_thumb.jpg$/igm)];
                // get video ID number
                var vMatch = path[0][1].match(/\/(\d+)$/);
                var vnum = vMatch[1];
                // create elements
                var d = document.createElement('div');
                // var link = document.createElement('a');
                // link.href = CDN_ROOT + path[0][1] + VID_EXTENSION;
                // link.style = "padding-left: 15px;";
                // link.textContent = 'Download';
                // link.target = "_blank";
                d.append(GRAVITY_LINK( 
                    CDN_ROOT + path[0][1] + VID_EXTENSION ,
                    'Download',
                    `${vnum} ${title}${VID_EXTENSION}`,
                    ref
                ));
                el.querySelector('td:nth-child(2)').append(d);
            }
        );
    }, false);
})();
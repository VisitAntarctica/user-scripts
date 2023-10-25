// ==UserScript==
// @name      Bateworld - Video
// @namespace /user-scripts/source/site-category/adult/bateworld_video.user.js 
// @include /^https://.*\.?bateworld?\.com/(bate[\w\d\-_]+?)?video(_group|album)?.php/
// @include /^https://.*\.?bateworld?\.com/profile.php/
// @include /^https://.*\.?bateworld?\.com/bator_training.*/
// @version  1.28
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
    // replace illegal characters from the filename provided to prevent downstream issues
    var linkFileName = fileName.replace(/\//igm,"-");
    var link = document.createElement('a');
    link.class = "x_gravity_link";
    if( GRAVITY_ON ){
        link.href = `http://${GRAVITY_CONFIG.host}:${GRAVITY_CONFIG.port}/?u=${encodeURIComponent(targetUrl)}&p=${encodeURIComponent(referer)}&fn=${encodeURIComponent(linkFileName)}`;
        link.innerHTML = `${GRAVITY_CONFIG.icon}&nbsp;${text}`;
    } else {
        link.href = targetUrl;
        link.innerHTML = `${GRAVITY_CONFIG.default_icon}&nbsp;${text}`;
    }
    if( ! fileName ){
        link.setAttribute('download', linkFileName);
    }
    link.setAttribute('title' , linkFileName);
    // link.target = "_blank";
    return link;
};

// User script config
var aspects = ["240" , "720" , "480"];
var CDN_ROOT = 'https://n2h5a5n4.ssl.hwcdn.net/';
var VID_EXTENSION = '.mp4';
var VIDEO_INDEX_BREAKPOINT = 101164;

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
    //window.addEventListener("load", function(){ 
        // for all the video elements in the page
        window.setTimeout(() => {
            document.querySelectorAll('video').forEach(
                function(el){
                    // process video element
                    var src = el.src;
                    var sMatch = [...src.matchAll(/\/(\d+)(?:-\d+)?\..*$/igm)];
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
                            `${sMatch[0][1]} ${titMatch[0][2].trim()}.${fileExt}`:
                            title
                        );
                    } else {
                        fileLabel = title;
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
        // For every video row in the related videos panel, show a download link (div.video_row)
        // For every video row  in the videos tab, show a download link (div.videoTab)
        var VIDEO_DIVS = ['div.video_row' , 'div.videoTab'];
        VIDEO_DIVS.forEach( (qs) => {
            document.querySelectorAll(qs).forEach(
                function(el){
                    try {
                        // get video title
                        var titleEl = el.querySelector('div.video_row_title a');
                        var title = titleEl.textContent.trim();
                        var ref = titleEl.getAttribute('href');
                        // get thumb path 
                        var imgSrc = el.querySelector('a img').src;
                        var path = [...imgSrc.matchAll(/bateworld.com\/(.*)_thumb.jpg$/igm)];
                        // get video ID number
                        var vMatch = path[0][1].match(/[^\d](\d+)$/);
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
                        var newp = document.createElement('p');
                        newp.innerHTML = `<em>${vnum}</em>`;
                        d.append( newp );
                        el.querySelector('td:nth-child(2)').append(d);
                        // after a video ID index, the video filename formats changed to include
                        // some kind of resolution parameter (though it doesn't track with the
                        // resolution of the video), so we account for those possibilities here
                        if( parseInt(vnum) >= VIDEO_INDEX_BREAKPOINT ){
                            for( var a_i = 0 ; a_i < aspects.length ; a_i++ ){
                                var d2 = document.createElement('div');
                                d2.append(GRAVITY_LINK(
                                    CDN_ROOT + path[0][1] + "-" + aspects[a_i] + VID_EXTENSION ,
                                    aspects[a_i],
                                    `${vnum} ${title}${VID_EXTENSION}`,
                                    ref
                                ));
                                el.querySelector('td:nth-child(2)').append(d2);
                            }
                        }
                    } catch(e){
                        console.error("Error in video div processing. ", e);
                    }
                }
            );
        });
        var VIDEO_DIVS_NEW = ['div#videoTabFrame.visible-lg > div.video_box > div'];
        VIDEO_DIVS_NEW.forEach( (qs) => {
            document.querySelectorAll(qs).forEach(
                function(el){
                    try {
                        // get video title
                        var titleEl = el.querySelector('div:nth-child(2) > a');
                        var title = titleEl.textContent.trim();
                        var ref = titleEl.getAttribute('href');
                        // get thumb path 
                        var imgSrc = el.querySelector('div a img').src;
                        var path = [...imgSrc.matchAll(/uploads_video\/(.*)_thumb.jpg$/igm)];
                        // get video ID number
                        var vMatch = path[0][1].match(/[^\d](\d+)$/);
                        var vnum = vMatch[1];
                        
                        // create elements
                        var d = document.createElement('div');
                        d.append(GRAVITY_LINK( 
                            CDN_ROOT + path[0][1] + VID_EXTENSION ,
                            'Download',
                            `${vnum} ${title}${VID_EXTENSION}`,
                            ref
                        ));
                        var newp = document.createElement('p');
                        newp.classList.add( 'pull-right' );
                        newp.innerHTML = `<em>${vnum}</em>`;
                        d.append( newp );
                        el.appendChild( d );

                        // after a video ID index, the video filename formats changed to include
                        // some kind of resolution parameter (though it doesn't track with the
                        // resolution of the video), so we account for those possibilities here
                        if( parseInt(vnum) >= VIDEO_INDEX_BREAKPOINT ){
                            for( var a_i = 0 ; a_i < aspects.length ; a_i++ ){
                                var d2 = document.createElement('div');
                                d2.append(GRAVITY_LINK(
                                    CDN_ROOT + path[0][1] + "-" + aspects[a_i] + VID_EXTENSION ,
                                    aspects[a_i],
                                    `${vnum} ${title}${VID_EXTENSION}`,
                                    ref
                                ));
                                el.appendChild( d2 );
                            }
                        }
                    } catch(e){
                        console.error("Error in video div processing. ", e);
                    }
                }
            );
        });
    //}, false);
})();
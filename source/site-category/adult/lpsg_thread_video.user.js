// ==UserScript==
// @name      LPSG - Threaded video helper
// @namespace /user-scripts/source/site-category/adult/lpsg_thread_video.user.js 
// @include /^https://.*\.?lpsg?\.com/threads/.*/
// @version  1.02
// @grant    none
// @noframes
// @description Helper for videos in threads on LPSG
// ==/UserScript==

var do_work = () => {
    var posters = document.querySelectorAll("div.video-easter-egg-poster");
    for( var i = 0 ; i < posters.length ; i++ ){
        var poster = posters[i].querySelector("img");
        
        var video_element = make_video(poster);
        
        var poster_container = poster.parentElement.parentElement;
        if( video_element !== null ){
            poster_container.appendChild(video_element);
            poster.remove();
        }   
    }
};

var make_src_url = (url_key , filetype) => {
    url_key = url_key || "";
    if( url_key.length == 0 ) return;  
    filetype = filetype || "mp4";
    
    return "https://cdn-videos.lpsg.com/data/video/" + url_key + "." + filetype;
};

var make_video = (poster_el) => {
    var poster_url = poster_el.getAttribute('src');
    if( poster_url.length == 0 ){
        return;
    }
    var vid = document.createElement('video');
    vid.setAttribute('controls' , 'true');
    vid.setAttribute('data-poster', poster_url);
    vid.setAttribute('poster' , poster_url);
    vid.setAttribute('data-xf-init', 'video-init');
    
    var matches = [...poster_url.matchAll(/\/posters\/(.*?)(\..*)$/ig)];
    var srcKey = matches[0][1] || "";
    
    if( srcKey.length == 0 ) return;
    
    var srcUrl = make_src_url(srcKey);
    if( srcUrl.length == 0 ) return; 
    
    var src = document.createElement('source');
    src.setAttribute('data-src' , srcUrl);
    src.setAttribute('src' , srcUrl);
    
    vid.appendChild(src);
    return vid;
}

(function() {
    do_work();
})();
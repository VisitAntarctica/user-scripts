// ==UserScript==
// @name      LPSG - Threaded video helper
// @namespace /user-scripts/source/site-category/adult/lpsg_thread_video.user.js 
// @include /^https://.*\.?lpsg?\.com/threads/.*/
// @include /^https://.*\.?lpsg?\.com/gallery/.*/
// @version  1.14
// @grant    none
// @noframes
// @description Helper for videos in threads on LPSG
// ==/UserScript==

// CDN root
const CDN_ROOT = 'https://www.lpsg.com';
// Path to videos on the CDN
const CDN_PATHS = {
    primary: '/data/video/',
    secondary: '/data/lsvideo/videos/',
    gallery: '/data/xfmg/',
}
// possible extensions for video src
// these will be used to generate buttons
const VID_EXTENSIONS = [
    'mp4',
    'mov',
    'm4v',
    'webm'
];

// Style for elements manipulated by the userscript
const BTN_STYLE = `
button.user-defined,
a.user-defined {
    border: 1px solid #333;
    border-radius: 8px;
    background-color: #eee;
    color: #000;
    font-family: Helvetica, Arial, sans-serif;
    font-size: 11px;
    margin: 1px;
    padding: 2px 5px;
    min-width: 75px;
}
a.user-defined {
    display: inline-block;
    min-height: 16px;
}
button.btn-secondary, 
a.btn-secondary {
    background-color: #FAF948;
}
button.btn-pending,
a.btn-pending {
    background-color: #F0D300;
}
button.btn-success,
a.btn-success {
    background-color: #93F018;
}
button.btn-failure,
a.btn-failure {
    background-color: #F01000;
}
div.btn-container {
    border: 1px dotted #999;
    border-radius: 10px;
    padding: 3px 5px;
    margin-top: 10px;
    max-width: fit-content;
}
.user-hidden {
    display:none;
}
`;

const WRAPPER_CLASS = 'bbMediaWrapper';

// adds the specified style as a stylesheet to the document
var add_style = (style) => {
    var ss = document.createElement('style');
    ss.innerText = style;
    document.head.appendChild(ss);
}

// process availability check result
var is_url_available = (state , el) => {
    el.classList.remove('btn-pending');
    if( state === true ){
        btn_success( el );
    } else {
        btn_failure( el );
    }
}
// Availability check: HEAD request to the URL to determine availability of a resource (404 or not)
var check_url_availability = (url, el) => {
    var http = new XMLHttpRequest();
    http.open('HEAD' , url);
    http.onreadystatechange = () => {
        if( http.readyState == http.DONE ){
            console.log("HEAD request complete")
            console.warn(http.status);
            is_url_available( http.status != 404 , el );
        }
    }
    http.send();
}
// actions when the button action was successful
var btn_success = ( el ) => {
    // debugger;
    // make the 'convert to video' button
    var btn = el.cloneNode();
    btn.innerText = "Embed video"
    btn.onclick = function(e){
        btn_convert_to_vid( this );
        e = e || window.event;
        e.preventDefault();
    }
    el.parentElement.insertBefore( btn , el );
    // make the link to the source
    var href = document.createElement('a');
    href.setAttribute( 'href' , el.getAttribute('data-xurl'));
    href.setAttribute('target' , '_blank');
    href.setAttribute('download' , '');
    href.setAttribute('onclick', 'javascript:return false;');
    href.setAttribute('class', 'user-defined btn-secondary');
    href.innerHTML = "Media source";
    el.parentElement.insertBefore( href , btn );
    
    // mark the button successful
    el.classList.add('btn-success');
}
// actions when the button action was unsuccessful
var btn_failure = ( el ) => {
    el.classList.add('btn-failure');
}
// action when
var btn_convert_to_vid = ( el ) => {
    var poster = get_poster_from_btn(el);
    var data = el.getAttribute('data-format');
    convert_poster_to_vid( poster , data , el.getAttribute('data-xurl'));
}

// Make the buttons
var make_btn = (label , data) => {
    var btn = document.createElement('button');
    btn.innerText = label;
    btn.setAttribute('href' , '#');
    btn.setAttribute('data-filetype' , data);
    btn.classList.add('user-defined');
    btn.onclick = function(e){
        btn_actuation( this , data );
        
        e = e || window.event;
        e.preventDefault();
    }
    return btn;
};

// Responds to button activation
var btn_actuation = (el , data) => {
    // console.log(el , data);
    // debugger;
    el.classList.add('btn-pending');
    var poster_el = el.parentElement.parentElement.querySelectorAll('div.video-easter-egg-poster img')[0];
    
    // make the proposed video URL 
    var proposed_url = el.getAttribute('data-xurl');
    if( proposed_url.length > 0 ){
        // check if it's good
        check_url_availability(proposed_url , el);
    }
}

// Obtains the poster image element based on the button element provided (proximity lookup)
var get_poster_from_btn = (el) => {
    return el.parentElement.parentElement.querySelectorAll('div.video-easter-egg-poster img')[0];
}
// Converts a single poster container into a video
var convert_poster_to_vid = (poster , filetype , srcUrl) => {
    srcUrl = srcUrl || null;
    var video_element = make_video_from_poster(poster , filetype , srcUrl);
    
    var poster_container = poster.parentElement.parentElement;
    if( video_element !== null ){
        remove_coverlays( poster_container );
        poster_container.appendChild(video_element);
        // change class of poster container parent
        poster_container.parentElement.classList.remove( WRAPPER_CLASS );
        poster_container.parentElement.classList.add( WRAPPER_CLASS + '-app');
    }
};

// Removes the video-easter-egg covers/overlays ("coverlays") from a poster container
var remove_coverlays = (poster_container) => {
    var coverEls = poster_container.querySelectorAll("div[class*=video-easter-egg-]");
    for( var k = coverEls.length - 1 ; k >= 0 ; k--){
        var tempEl = coverEls[k];
        // tempEl.remove();
        tempEl.classList.add('user-hidden');
    }
}

// Makes the source URL for the video, given the url key and filetype
var make_src_url = (url_key , filetype , cdn_path) => {
    url_key = url_key || "";
    cdn_path = cdn_path || CDN_PATHS.primary;
    if( url_key.length == 0 ) return;  
    filetype = filetype || "mp4";
    
    return CDN_ROOT + cdn_path + url_key + "." + filetype;
};

// Generates the video and source elements based on the poster DOMElement
var make_video_from_poster = (poster_el , filetype , srcUrl) => {
    var poster_url = get_poster_url( poster_el );
    if( poster_url.length == 0 ) return;
    
    var vid = document.createElement('video');
    vid.setAttribute('preload' , 'metadata');
    vid.setAttribute('controls' , 'true');
    vid.setAttribute('data-poster', poster_url);
    vid.setAttribute('poster' , poster_url);
    vid.setAttribute('data-xf-init', 'video-init');
    
    srcUrl = srcUrl || get_video_url_from_poster( poster_url , filetype );
    if( !(srcUrl) || srcUrl.length == 0 ) return; 
    
    var src = document.createElement('source');
    src.setAttribute('data-src' , srcUrl);
    src.setAttribute('src' , srcUrl);
    
    vid.appendChild(src);
    return vid;
}
// Returns the URL of the poster image, given the poster image element
var get_poster_url = (poster_el) => {
    var poster_url = poster_el.getAttribute('src');
    
    return ( poster_url.length > 0 ) ? poster_url : null;
}
// Generates the video source URL given the poster URL and filetype
var get_video_url_from_poster = ( poster_url , filetype ) => {
    var matches = [...poster_url.matchAll(/\/posters\/(.*?)(\..*)$/ig)];
    var cdn_path = CDN_PATHS.primary;
    if( matches.length < 1 ){
        // this may be an older post, try a different regex
        matches = [...poster_url.matchAll(/\/lsvideo\/thumbnails\/(.*?)(\..*)$/ig)];
        cdn_path = CDN_PATHS.secondary;
        if( matches.length < 1 ) return;
    };
    var srcKey = matches[0][1] || "";
    
    if( srcKey.length == 0 ) return;
    
    var srcUrl = make_src_url(srcKey , filetype, cdn_path);
    return ( srcUrl.length > 0 ) ? srcUrl : null;
}


// entry point for work
var do_work = () => {
    // debugger;
    // add buttons to convert individual posters into video
    var posters = document.querySelectorAll("div.video-easter-egg-poster");
    if( posters.length === 0 ){
        console.log("No posters found");
    } else {
        console.log( posters.length , "posters found, processing. . ." );
        var isGallery = false;
        if( [...window.location.href.matchAll(/gallery/g)].length > 0 ){
            // this is a gallery page
            isGallery = true;
        }
        for( var i = 0 ; i < posters.length ; i++ ){
            // parent of the poster - inner wrapper
            var parentNode = posters[i].parentElement
            // parent of the inner wrapper - outer wrapper
            var wrapperNode = parentNode.parentElement;
            // shell div to hold buttons
            var btnDiv = document.createElement('div');
            btnDiv.classList.add('user-defined', 'btn-container');
            // create all buttons
            for( var k = 0 ; k < VID_EXTENSIONS.length ; k++ ){
                var btn = make_btn( VID_EXTENSIONS[k] , VID_EXTENSIONS[k]);
                btn.setAttribute('data-format' , VID_EXTENSIONS[k]); 
                if( isGallery === true ){
                    // parse the gallery poster
                    var sd = document.querySelectorAll('script[type*="application/ld+json"]');
                    var poster_url = '';
                    var video_url = '';
                    if( sd.length > 0 ){
                        try {
                            var j = JSON.parse( sd[0].innerText );
                            poster_url = j.thumbnailUrl;
                            video_url = j.contentUrl.replace("https://cdn-videos.lpsg.com" , CDN_ROOT);
                        } catch(e){
                            console.error('Error encountered:' , e);
                        }
                    } else {
                        console.warn('No suitable data object found, skipping poster processing.');
                    }
                } else {
                    // parse the thread poster
                    poster_url = get_poster_url( posters[i].querySelectorAll('img')[0] )
                    video_url = get_video_url_from_poster( poster_url , VID_EXTENSIONS[k] );
                    // hide all coverlays on the page
                    var coverClasses = ['video-easter-egg-blocker', 'video-easter-egg-overlay'];
                    coverClasses.forEach(function( className ){
                        var coverEls = document.querySelectorAll(`div[class=${className}]`);
                        for( var k = coverEls.length - 1 ; k >= 0 ; k--){
                            var tempEl = coverEls[k];
                            tempEl.classList.add('user-hidden');
                        }
                    });
                }
                btn.setAttribute('data-posterurl' , poster_url );
                btn.setAttribute('data-xurl' , video_url );
                btnDiv.appendChild(btn);
                if( isGallery === true ) break;
            }
            // add button box to wrapper node
            wrapperNode.appendChild( btnDiv );    
        }
        add_style( BTN_STYLE );
    }
};

(function() {
    do_work();
})();
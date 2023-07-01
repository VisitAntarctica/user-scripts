// ==UserScript==
// @name      LPSG - Threaded video helper
// @namespace /user-scripts/source/site-category/adult/lpsg_thread_video.user.js 
// @include /^https://.*\.?lpsg?\.com/threads/.*/
// @version  1.04
// @grant    none
// @noframes
// @description Helper for videos in threads on LPSG
// ==/UserScript==

// CDN root
const CDN_ROOT = 'https://www.lpsg.com';
// Path to videos on the CDN
const CDN_PATH = '/data/video/';

// possible extensions for video src
// these will be used to generate buttons
const VID_EXTENSIONS = [
    'mp4',
    'mov',
    'm4v'
];

// Style for elements manipulated by the userscript
const BTN_STYLE = `
button.user-defined {
    border: 1px solid #333;
    border-radius: 8px;
    background-color: #ddd;
    color: #000;
    font-family: Helvetica, Arial, sans-serif;
    font-size: 11px;
    margin: 1px;
    padding: 2px 5px;
}
button.btn-pending {
    background-color: yellow;
}
button.btn-success {
    background-color: green;
}
button.btn-failure {
    background-color: red;
}
div.btn-container {
    border: 1px dotted #111;
    border-radius: 10px;
    padding: 5px 8px;
}
.user-hidden {
    display:none;
}
`;

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
    var poster = get_poster_from_btn(el);
    var data = el.getAttribute('data-format');
    convert_poster_to_vid( poster , data );
    el.classList.add('btn-success');
}
// actions when the button action was unsuccessful
var btn_failure = ( el ) => {
    el.classList.add('btn-failure');
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
    var proposed_url = get_video_url_from_poster( get_poster_url(poster_el) , data);
    
    // check if it's good
    check_url_availability(proposed_url , el);
}

// Obtains the poster image element based on the button element provided (proximity lookup)
var get_poster_from_btn = (el) => {
    return el.parentElement.parentElement.querySelectorAll('div.video-easter-egg-poster img')[0];
}
// Converts a single poster container into a video
var convert_poster_to_vid = (poster , filetype) => {
    var video_element = make_video_from_poster(poster , filetype);
    
    var poster_container = poster.parentElement.parentElement;
    if( video_element !== null ){
        remove_coverlays( poster_container );
        poster_container.appendChild(video_element);
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
var make_src_url = (url_key , filetype) => {
    url_key = url_key || "";
    if( url_key.length == 0 ) return;  
    filetype = filetype || "mp4";
    
    return CDN_ROOT + CDN_PATH + url_key + "." + filetype;
};

// Generates the video and source elements based on the poster DOMElement
var make_video_from_poster = (poster_el , filetype) => {
    var poster_url = get_poster_url( poster_el );
    if( poster_url.length == 0 ) return;
    
    var vid = document.createElement('video');
    vid.setAttribute('controls' , 'true');
    vid.setAttribute('data-poster', poster_url);
    vid.setAttribute('poster' , poster_url);
    vid.setAttribute('data-xf-init', 'video-init');
    
    var srcUrl = get_video_url_from_poster( poster_url , filetype );
    if( srcUrl.length == 0 ) return; 
    
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
    var srcKey = matches[0][1] || "";
    
    if( srcKey.length == 0 ) return;
    
    var srcUrl = make_src_url(srcKey , filetype);
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
                var poster_url = get_poster_url( posters[i].querySelectorAll('img')[0] )
                btn.setAttribute('data-format' , VID_EXTENSIONS[k]); 
                btn.setAttribute('data-posterurl' , poster_url );
                btn.setAttribute('data-xurl' , get_video_url_from_poster( poster_url , VID_EXTENSIONS[k] ) );
                btnDiv.appendChild(btn);
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
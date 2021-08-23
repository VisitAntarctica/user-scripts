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
var MIMETYPE = 'video/mp4';
var objEx = {"user": "", "title": "", "url": ""};

var objList = []; // array of on-page objects

var message = (title, text, level) => {
    var log = console.info;
    switch(level){  
        case "log":
            log = console.log;
            break;
        case "warn":
            log = console.warn;
            break;
        case "error":
            log = console.error;
    };
    log(new Date().toLocaleString() + " :: " + text , {'title': title, 'level': level});
}
var clickFile = (url , fileName) => {
    // e = e || window.event;
    // e.preventDefault();
    message('Link clicked', [url,fileName] , "info");
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onprogress = function(e){
        message("Progress", [e.loaded , e.total], "info");
    }
    xhr.onload = function(e){        
        message("File loaded" , url, "info");
        var blob = new Blob([xhr.response], {type: MIMETYPE});
        downloadFile( blob , fileName );
    }
    xhr.onabort = function(e){
        message("XHR abort" , e , "error");
    }
    xhr.onerror = function(e){
        message("XHR error" , e , "error");
    }
    xhr.ontimeout = function(e){
        message("XHR Timeout", e , "error");
    }
    message("Opening", url);
    try {
        xhr.open('GET' , url, true);
    } catch(e){
        message("Error on open" , e , "error");
    }
};
var downloadFile = (blob,fileName) => {
    const link = document.createElement('a');
    // create a blobURI pointing to our Blob
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    // some browser needs the anchor to be in the doc
    document.body.append(link);
    link.click();
    link.remove();
    // in case the Blob uses a lot of memory
    setTimeout(() => URL.revokeObjectURL(link.href), 7000);
};

(function() {
    // For every video element found in the page, 
    //  use page details to create an HREF to the 
    //  source video file
    var title = document.querySelector('title').textContent;
    var titMatch = [...title.matchAll(/^.* - (.*)'s video - (.*)$/igm)];
    var titUser = titMatch[0][1];
    document.querySelectorAll('video').forEach(
        function(el){
            // process video element
            var src = el.src;
            var fileExt = src.split('.').pop();
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
                //link.href = src;
                link.href = "javascript:clickFile('" + src + "', '" + fileLabel + "');"
                link.onclick="event.preventDefault();";
                link.style = "padding-left: 15px;";
                link.textContent = "Download video"
                link.setAttribute('download', fileLabel);
                message("Main link added", fileLabel , "info");
                document.querySelector('div.page_header').append(link);
        }
    );

    // For every video row in the related videos panel, show a download link
    document.querySelectorAll('div.video_row').forEach(
        function(el){
            // get thumb path 
            var imgSrc = el.querySelector('a img').src;
            // get title
            var title = el.querySelectorAll('a')[1].textContent;
            message("The related title is " , title);
            var path = [...imgSrc.matchAll(/bateworld.com\/(.*)_thumb.jpg$/igm)];
            var d = document.createElement('div');
            var link = document.createElement('a');
            var src = CDN_ROOT + path[0][1] + VID_EXTENSION;
            //link.href = src;
            link.href = "javascript:clickFile('" + src + "', '" + titUser + "_" + title + VID_EXTENSION + "');"
            link.onclick="event.preventDefault();";
            link.style = "padding-left: 15px;";
            link.textContent = 'Download';
            //link.target = "_blank";
            d.append(link);
            el.querySelector('td:nth-child(2)').append(d);
            message("Related link added", title , "info");
        }
    );
})();
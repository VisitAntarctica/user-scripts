// ==UserScript==
// @name      LPSG - Threaded photo helper
// @namespace /user-scripts/source/site-category/adult/lpsg_thread_photo.user.js 
// @include /^https://.*\.?lpsg?\.com/threads/.*/
// @include /^https://.*\.?lpsg?\.com/gallery/.*/
// @version  1.00
// @grant    none
// @noframes
// @description Helper for videos in threads on LPSG
// ==/UserScript==

// Some configuration variables to make updates easier
let LOG = {
    HEAD_REQ: {
        state: true,
        headers_all: false,
        headers_list: [
            'content-type',
            'content-length',
        ],
    },
}

// Style for elements manipulated by the userscript
let BTN_STYLE = `
button.user-defined,
a.user-defined {
    border: 1px solid #333;
    border-radius: 8px;
    background-color: #eee;
    color: #000;
    font-family: Open Sans, Helvetica, Arial, sans-serif;
    font-size: 14px;
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
.bbMediaWrapper {
    min-width:100% !important;
}
`;

let WRAPPER_CLASS = 'bbImageWrapper';

// adds the specified style as a stylesheet to the document
var add_style = (style) => {
    var ss = document.createElement('style');
    ss.innerText = style;
    document.head.appendChild(ss);
}

// entry point for work
var do_work = () => {
    // debugger;
    // add button to convert image into image sources
    var thumbs = document.querySelectorAll('img.bbImage');
    if( thumbs.length === 0 ){
        console.log("No images found");
    } else {
        console.log( thumbs.length , " images found, processing. . ." );
        /*var isGallery = false;
        if( [...window.location.href.matchAll(/gallery/g)].length > 0 ){
            // this is a gallery page
            isGallery = true;
        }*/
        for( var i = 0 ; i < thumbs.length ; i++ ){
            // parent of the thumb img - the wrapper
            var parentNode = thumbs[i].parentElement;
            // parent of the inner wrapper - outer wrapper
            var wrapperNode = parentNode.parentElement;
            // shell div to hold buttons
            var btnDiv = document.createElement('div');
            btnDiv.classList.add('user-defined', 'btn-container');

            var title = parentNode.getAttribute('title') || thumbs[i].getAttribute('alt');
            var url = parentNode.getAttribute('data-src');
            var urlParts = [...url.matchAll(/\/([^/]*?)\/$/g)];
            if( urlParts.length > 0 && urlParts[0].length > 1 ){
                var fileName = urlParts[0][1].split('.')[0].replace('-','.');

                // make the link to the source
                var href = document.createElement('a');
                href.setAttribute( 'href' , url );
                href.setAttribute('target' , '_blank');
                href.setAttribute('download' , fileName );
                href.setAttribute('onclick', 'javascript:return false;');
                href.setAttribute('class', 'user-defined btn-secondary');
                // if( downloadTag.trim().length > 0 ){
                //     href.innerHTML = downloadTag.trim();
                // } else {
                    href.innerHTML = `${fileName}`;
                // }
                parentNode.insertBefore( href , thumbs[i] );
            } else {
                console.error(`Failure parsing image file name, urlParts array: ${JSON.stringify(urlParts)}`);
            }
        }
    }
};

(function() {
    do_work();
})();
// ==UserScript==
// @name      Newtumbl - SC Helper
// @namespace /user-scripts/source/site-category/adult/newtumbl_hardbroken.js
// @include /^https://hardbroken.newtumbl.com/
// @version  1.00
// @grant    none
// @noframes
// @description Helper for SC video DL from a newtumbl blog
// ==/UserScript==

// Gravity payload downloader config
var GRAVITY_ON = true;
var GRAVITY_CONFIG = {
    'host': 'localhost',
    'port': '6060',
    'state': null,
    'icon': '&#128371;',
    'default_icon':'&#128279;',
    'dump_icon':'&#9195;',
};
var GRAVITY_LINK = ( targetUrl , text , fileName , referer ) => {
    text = text || "Download video";
    var link = document.createElement('a');
    link.class = "x_gravity_link";
    if( GRAVITY_ON ){
        link.href = `http://${GRAVITY_CONFIG.host}:${GRAVITY_CONFIG.port}/?u=${encodeURIComponent(targetUrl)}&p=${encodeURIComponent(referer)}&fn=${encodeURIComponent(fileName)}`;
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
var GRAVITY_DUMP = ( obj , title , referer , linkText, user ) => {
    linkText = linkText || "Download";
    // stringify object
    var data = JSON.stringify(obj);
    var link = document.createElement('a');
    link.class = "x_gravity_link";
    link.href = `http://${GRAVITY_CONFIG.host}:${GRAVITY_CONFIG.port}/?u=${encodeURIComponent(user)}&d=${encodeURIComponent(data)}&t=${encodeURIComponent(title)}&r=${encodeURIComponent(referer)}`;
    link.innerHTML = `${GRAVITY_CONFIG.dump_icon}&nbsp; ${linkText}`;
    return link;
};
var GRAVITY_DIRECT = ( obj , ...map ) => {
    var ol = document.createElement('ol');
    for( var i = 0 ; i < obj.length ; i++ ){
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = obj[i][map[0]];
        a.textContent = obj[i][map[1]] || "link";
        a.setAttribute( 'class' , obj[i][map[2]] || "gravity-link");
        // var dl = a.cloneNode(true);
        // dl.innerHTML = "&#11015;";
        // dl.setAttribute('style', "padding-left: 5px");
        // dl.setAttribute('download','');
        li.appendChild(a);
        // li.appendChild(dl)
        ol.appendChild(li);
    }
    return ol;
};

var POST_ROOT = "div.block_body";
var POST_VIDEO = 'div.post_part.part_video[type="7"]';
var XPATH_VIDSRC = 'video source';
var TEXT_REGEX = /sean ?cody ?\# ?(\d+ ?-.*)/i;
var ILLEGAL_FILE_CHARS = /[/\\?%*:|"<>]/g;

var VIDEO_KEYS = [];
var VIDEOS = [];
var VIDEO_MATCH = [];
var OUTERDIV_ID = 'notify-js';
var BASKET_ID = 'basket';
var BASKET_TITLE = "FilesDirect";
var BASKET_CSS = "a.gravity-link { color: #334; } \
div#basket li { padding-bottom: 3px; } \
div#basket h4 {padding-bottom: 4px; }";
var SCAN_POSTS = () => {
    // 
    document.querySelectorAll( POST_VIDEO ).forEach((el) => {
        // identify if it's a SC post
        var post_title = "";
        /// get the article body (next neighbor node)
        var ns = el.nextSibling;

        if( !ns ) { 
            // this might be a reblog?

            // we could probably look into this later but won't bother for now
            //  debugger; 
            console.log('Maybe a reblog?');
            return;
        }
        var txt = ns.textContent;
        // var result = [... txt.matchAll(TEXT_REGEX)];
        var result = txt.match(TEXT_REGEX);
        
        /// get the video URL
        var vid = el.querySelector( XPATH_VIDSRC );

        // add to the array? 
        if( result && result.length > 1 ){
            var src = vid.src;
            // ensure this isn't a duplicate
            if ( VIDEO_KEYS.indexOf( vid.src ) === -1 ){
                post_title = result[1];
                VIDEOS.push({
                    'src': src,
                    'type': vid.type,
                    'res': 'sc' + post_title.replace( ILLEGAL_FILE_CHARS , ''),
                });
                VIDEO_KEYS.push(src);
                console.log('Added ' + post_title);
            } else {
                console.log('Duplicate found');
            }
        } else {
            console.log('No match here');
        }
        
    });

}

var DIVWRAP = ( el , attrs  ) => {
    var d = document.createElement('div');
    Object.keys(attrs).forEach( (value) => {
        d.setAttribute( value , attrs[value] );
    })
    d.appendChild(el);
    return d;
}

var SCAN_ALL = ( decorate_when_complete = true ) => {
    // SCAN_IMAGES();
    // SCAN_VIDEOS();
    SCAN_POSTS();
    if(decorate_when_complete)
    MAKE_DECORATION();
};
var USERSCAN = () => {
    console.info('User refreshed');
    SCAN_ALL(true);
}
var MAKE_DECORATION = ( remove_existing = true ) => {
    // make the decoratives, expose the functionality
    var note = document.getElementById(OUTERDIV_ID) || document.createElement('div');
    note.id = OUTERDIV_ID;
    note.style = "position: fixed; \
    top: 45%; \
    bottom: 20px; \
    left: 15px; \
    padding: 4px 7px; \
	width: 300px; \
	overflow-x: visible; \
	overflow-y: auto; \
	background-color: #ddd; \
	color: #222;";
    note.style.border = "1px solid #ccc";
    
    // basket (this is the top level removed)
    var basket = document.createElement('div');
    basket.id = BASKET_ID;
    basket.style = BASKET_CSS;
    // basket header
    var p = document.createElement('h4');
    p.textContent = BASKET_TITLE;
    p.onclick = USERSCAN;
    basket.appendChild( p );
    
    // basket css 
    var bstyle = document.createElement('style');
    bstyle.textContent = BASKET_CSS;
    document.body.appendChild(bstyle);

    // do the videos
    if( VIDEOS.length > 0 ){
        //note.appendChild( GRAVITY_DUMP( VIDEOS , TITLE , window.location , "Videos", USER));
        basket.appendChild( 
            DIVWRAP( 
                GRAVITY_DIRECT( VIDEOS, 'src', 'res' , 'gravity-link' ) , 
                {
                    'id': 'gravity-videos',
                    'style': 'padding: 1px; color: #333',
                }
            )
        );
    }
    if( remove_existing === true ){
        // debugger;
        var d = document.getElementById(BASKET_ID) || null ;
        if( d !== null )
        d.parentElement.removeChild(d);
    }
    note.appendChild(basket);
    document.body.appendChild(note);
}

(() => {
    SCAN_ALL();
})();
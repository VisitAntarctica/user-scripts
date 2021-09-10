// ==UserScript==
// @name      Erome - Video & Photo
// @namespace /user-scripts/source/site-category/adult/erome.user.js 
// @include /^https://.*\.?erome?\.com/a/\.*/
// @version  1.01
// @grant    none
// @noframes
// @description Image and video tools for Erome
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
var DIVWRAP = ( el , attrs  ) => {
    var d = document.createElement('div');
    Object.keys(attrs).forEach( (value) => {
        d.setAttribute( value , attrs[value] );
    })
    d.appendChild(el);
    return d;
}

var ALBUM_TITLE = 'div#userAlbum h1';
var ALBUM_IMAGES = 'div.img > img';
var SINGLE_IMAGES = '';
var VIDEO_PATH = {
    'hd': 'video > source[label="HD"]',
    'sd': 'video > source[label="SD"]',
    'all': 'video > source',
};
var OUTERDIV_ID = 'notify-js';
var BASKET_ID = 'basket';
var BASKET_TITLE = "FilesDirect";
var VIDEO_KEYS = [];
var VIDEOS = [];
var IMAGE_KEYS = [];
var IMAGES = [];
var THUMBS = [];
var THUMB_KEYS = [];

// album title 
var TITLE = document.querySelector(ALBUM_TITLE).textContent.trim();
// album user
var USER = document.querySelector('div.username > a:nth-of-type(2)').textContent;

var SCAN_IMAGES = () => {
    // album images
    document.querySelectorAll('div.img > img').forEach((el) => { 
        var src = el.src;
        if( el.src !== window.location ){
            var datasrcObj = el.attributes.getNamedItem('data-src') || "";
            var datasrc = datasrcObj.textContent || "";
            if ( datasrc == "" ){
                // probably a thumbnail
                if( THUMB_KEYS.indexOf( src ) === -1 ){
                    THUMBS.push({
                        'src': src,
                        'type': 'thm',
                    });
                    THUMB_KEYS.push(src);
                }
            } else {
                // probably an image
                if( IMAGE_KEYS.indexOf( src ) === -1 ){
                    IMAGES.push({
                        'src': src,
                        'datasrc': datasrc,
                        'type': 'img'
                    });
                    IMAGE_KEYS.push(src);
                } 
            } // else: duplicate entry
        }
    });
}

var SCAN_VIDEOS = () => {
    // album videos
    document.querySelectorAll(VIDEO_PATH.all).forEach((el) => {
        var src = el.src;
        if( VIDEO_KEYS.indexOf( src ) === -1 ){
            VIDEOS.push({
                'src': src,
                'type': el.type,
                'res': el.attributes.getNamedItem('res').textContent
            });
            VIDEO_KEYS.push(src);
        } // else: duplicate
    });
}

var SCAN_ALL = ( decorate_when_complete = true ) => {
    SCAN_IMAGES();
    SCAN_VIDEOS();
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
    note.style = "position: fixed; top: 50px; bottom: 10px; left: 10px; padding: 2px 4px; width: 110px; overflow-x: visible; overflow-y: auto; background-color: rgba(100,100,100,0.2); color: #eee;";
    note.style.border = "1px solid #ccc";
    
    // basket (this is the top level removed)
    var basket = document.createElement('div');
    basket.id = BASKET_ID;
    
    // basket header
    var p = document.createElement('strong');
    p.textContent = BASKET_TITLE;
    p.onclick = USERSCAN;
    basket.appendChild( p );
    
    // do the images
    if( IMAGES.length > 0 && IMAGES.length !== VIDEOS.length ){
        //note.appendChild( GRAVITY_DUMP( IMAGES , TITLE , window.location , "Images", USER));
        basket.appendChild( 
            DIVWRAP( GRAVITY_DIRECT( IMAGES , 'src', 'type' , 'gravity-link') , 
            {
                'id': 'gravity-images', 
                'style': ''
            }
        ));
    }
    // do the videos
    if( VIDEOS.length > 0 ){
        //note.appendChild( GRAVITY_DUMP( VIDEOS , TITLE , window.location , "Videos", USER));
        basket.appendChild( 
            DIVWRAP( 
                GRAVITY_DIRECT( VIDEOS, 'src', 'res' , 'gravity-link' ) , 
                {
                    'id': 'gravity-videos',
                    'style': 'padding: 1px;'
                }
            )
        );
    }
    // do the thumbnails
    if( THUMBS.length > 0 ){
        //note.appendChild( GRAVITY_DUMP( VIDEOS , TITLE , window.location , "Videos", USER));
        basket.appendChild( 
            DIVWRAP( 
                GRAVITY_DIRECT( THUMBS, 'src', 'type' , 'gravity-link' ) , 
                {
                    'id': 'gravity-thumbs',
                    'style': 'padding: 1px;'
                }
            )
        );
    }
    if( remove_existing === true ){
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
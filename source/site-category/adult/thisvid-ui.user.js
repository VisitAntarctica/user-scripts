// ==UserScript==
// @name      Thisvid - UI fixes
// @namespace /user-scripts/source/site-category/adult/thisvid-ui.user.js
// @include /^https://.*\.?thisvid?\.com/.*/
// @version  1.15
// @grant    none
// @noframes
// @description Thisvid UI enhancements
// ==/UserScript==
// jshint esversion: 8

// Configuration
var idElementType = 'span';
var idElementClass = 'this-id';
var thumbRE = new RegExp(/\/(\d+)\/[^/]*?\/\d+\.\w{3,4}$/ig);
var posterRE = new RegExp(/\/(\d+)\/[\w\d.]+\.\w{3,4}$/ig);

var color_map = [
    { index: 97, 'background-color': '#50e848', color: '#000' },
    { index: 93, 'background-color': '#a8f25a', color: '#000' },
    { index: 87, 'background-color': '#f4f72e', color: '#000' },
    { index: 80, 'background-color': '#bd6800', color: '#000' },
    { index: 60, 'background-color': '#d60800', color: '#000' },
    { index: 0, 'background-color': '#a80037', color: '#000' },
];
// Function definition
var colorPercent = function( percentStr ){
    var percentNum = -1;
    if( percentStr.substr(-1,1) == "%" ){
        percentNum = parseInt( percentStr.substr( 0, percentStr.length - 1) );
    } else {
        percentNum = parseInt( percentStr );
    } 
    if( percentNum > 0 && percentNum <= 1 ){
        // normalize
        percentNum *= 100;
    }
    var r = {
        'background-color': '',
        'color': 'inherit',
        'font-weight': 'normal',
    };
    
    var this_color_map = JSON.parse(JSON.stringify(color_map)).sort((a,b) => b.index - a.index);
    do {
        var c = this_color_map.shift();
        if ( percentNum > c.index ){
            r["background-color"] = c['background-color'];
            r.color = c.color;
            break;
        }
    } while( this_color_map.length > 0 );

    return r;
};

// parse imgID out of image elements
var exposeImgId = ( img , appendEl , regExp ) => {
    appendEl = appendEl || false; 
    var par = null;
    if( appendEl === false ){
        console.warn('No append element provided, bailing out!');
        return;
    } else {
        par = appendEl;
    }
    if( regExp === false ){
        console.warn('No regex provided, bailing out!');
        return;
    }
    // gather the ID from a thumb image
    // sometimes the src is stored in data-original and a placeholder base64 encoded image is stored in the img src
    var src = ( img.src.substr(0,5) == 'data:' ) ? img.getAttribute('data-original') : img.src;
    var mArr = [...src.matchAll( regExp )];
    var imgId = null;
    if( mArr.length > 0 && mArr[0].length > 1 ){
        imgId = mArr[0][1];
    }
    var idParts = imgId !== null ? [...imgId.matchAll(/^(\d{0,4})(\d*)(\d{4})$/g)] : [ null ];
    if( imgId !== null ){
        // get the wrapper
        // var par =;

        // if there is a span with ID already, get and use it
        var existEl = par.querySelector(`${idElementType}.${idElementClass}`);

        par.appendChild( 
            makeIdElement( imgId , idParts, existEl )
        );
    }
}

// make and return the ID display element
var makeIdElement = ( imgId , idParts , existingElement ) => {
    var existEl = existingElement || false; 
    var idElement = null;
    if( existEl !== false ){
        // yes, clear the element 
        existEl.innerHTML = '';
        idElement = existEl;
    } else {
        // no, create the element
        idElement = document.createElement( idElementType );
    }
    // make the inner parts and add them to the idElement
    idElement.setAttribute( 'class' , idElementClass );
    idElement.setAttribute('title' , imgId );
    idElement.setAttribute('onclick' , 'javascript: return false;')
    if( idParts.length > 0 && idParts[0].length > 1 ){
        var p = idParts[0].shift();
        do {
            p = idParts[0].shift();
            var pEl = document.createElement( 'span' );
            pEl.innerText = p;
            idElement.appendChild( pEl );
        } while( idParts[0].length > 0 );
    } else {
        idElement.innerText = imgId;
    }
    return idElement;
};

(function(){
    // STYLE: Remove the hover overlay that grays out the video preview
    var s = document.createElement('style');
    s.setAttribute('type' , 'text/css');
    s.setAttribute('id', 'customCSS');
    
    var style = `a:hover img { 
    opacity: 1 !important; 
} 
${idElementType}.${idElementClass} { 
    font-weight: normal; 
    float: right;
    color: #9a9a9a;
}
${idElementType}.${idElementClass} span { 
    margin-top: 2px;
    padding: 1px 2px;
}
${idElementType}.${idElementClass} span:first-of-type {
    background-color: #0055bd; 
    color: #fff;
}
${idElementType}.${idElementClass} span:last-of-type {
    background-color: #008b3c;
    color: #fff;
}
`;
    var styleNode = document.createTextNode( style );
    s.appendChild( styleNode );
    document.querySelector('head').appendChild( s );
    
    // FUNCTION: Highlight liked videos
    var percentEls = document.querySelectorAll('span.percent');
    percentEls.forEach((el) => {
        // add style to the element based on the color returned
        var unit = colorPercent(el.textContent);
        el.setAttribute('style' , `background-color: ${unit["background-color"]}; color: ${unit.color}; font-weight: ${unit["font-weight"]}`);
    });
    // FUNCTION: Float the video ID into view

    var thimg = document.querySelectorAll('span.thumb > img');
    thimg.forEach((img) => {
        exposeImgId( img , img.parentElement.parentElement , thumbRE);
    });
    var vimg = document.querySelectorAll('.fp-poster > img');
    vimg.forEach((img) => {
        exposeImgId( img , document.querySelector('div.headline h1') , posterRE);
    });
})();


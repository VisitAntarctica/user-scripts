// ==UserScript==
// @name      Thisvid - UI fixes
// @namespace /user-scripts/source/site-category/adult/thisvid-ui.user.js
// @include /^https://.*\.?thisvid?\.com/.*/
// @version  1.00
// @grant    none
// @noframes
// @description Misc fixes for the UI on Thisvid
// ==/UserScript==
// jshint esversion: 8

// Configuration
var idElementType = 'span';
var idElementClass = 'this-id';

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
    if( percentNum > 97 ){
        r["background-color"] = "#50e848"; // bluegreen
        r.color = '#000';
    } else if( percentNum > 93 ) {
        r["background-color"] = "#a8f25a"; // light green
        r.color = '#000';
    } else if( percentNum > 87 ){
        r["background-color"] = "#f4f72e"; // yellow
        r.color = '#000';
    } else if( percentNum > 80 ) {
        r["background-color"] = "#bd6800"; // orange
    } else if( percentNum > 60 ){
        r["background-color"] = "#d60800"; // bright red
    } else {
        r["background-color"] = "#a80037"; // dark red
    }
    return r;
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
    var mvrex = new RegExp(/\/(\d+)\/[^/]*?\/\d+\.\w{3,4}$/ig);
    var thimg = document.querySelectorAll('span.thumb > img');
    thimg.forEach((img) => {
        // gather the ID from a thumb image
        // sometimes the src is stored in data-original and a placeholder base64 encoded image is stored in the img src
        var src = ( img.src.substr(0,5) == 'data:' ) ? img.getAttribute('data-original') : img.src;
        var mArr = [...src.matchAll( mvrex )];
        var imgId = null;
        if( mArr.length > 0 && mArr[0].length > 1 ){
            imgId = mArr[0][1];
        }
        var idParts = imgId !== null ? [...imgId.matchAll(/^(\d{0,4})(\d*)(\d{4})$/g)] : [ null ];
        if( imgId !== null ){
            // get the wrapper
            var par = img.parentElement.parentElement;

            // is there a span with ID already?
            var idElement = null;
            var existEl = par.querySelector(`${idElementType}.${idElementClass}`);
            if( existEl !== null ){
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
                var imgIdMatch = ( idParts[0].shift() == imgId ); 
                do {
                    var p = idParts[0].shift();
                    var pEl = document.createElement( 'span' );
                    pEl.innerText = p;
                    idElement.appendChild( pEl );
                } while( idParts[0].length > 0 );
            } else {
                idElement.innerText = imgId;
            }
            par.appendChild( idElement );
        }
    });

    
})();


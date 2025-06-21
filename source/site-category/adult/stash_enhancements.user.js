// ==UserScript==
// @name      Stash enhancements
// @namespace /user-scripts/source/site-category/adult/stash_enhancements.user.js 
// @version  1.30
// @grant    none
// @noframes
// @description UI/UX enhancements that make stash work better for this user
// ==/UserScript==

// User script config
var pageTypes = [{
        matchURL: '/scenes/',
        infoBoxSelector: 'dl.scene-file-info.details-list',
        functions: [
            'showFullPath'
        ]
    },
    {
        matchURL: '/images/',
        infoBoxSelector: 'dl.image-file-info.details-list',
        functions: [
            'showFullPath'
        ]
    }
];
var filePathRegex = new RegExp(/(?:[\\\/]+([^\\\/]*))+?/,"ig");

// User script execution
var showFullPath = function( pageType ){
    /*
     Container identifier = 
     1 or many, iterate over each
     Find first link in each which starts with "file:///" <-- this is the file path we are looking to parse
     Create a new 
    */
   var infoBoxSelector = pageType.infoBoxSelector;
    var fileInfoBoxes = document.querySelectorAll( infoBoxSelector ).forEach(
        function(infoBox , i){
            var fileLink = infoBox.querySelectorAll( "a[href*='file://']" )[0] || console.info("Skipping infobox, no file link found.");
            if( fileLink ){
                var fileLinkHREF = fileLink.getAttribute('href');
                var fileLinkREResult = fileLinkHREF.matchAll( filePathRegex );
                var fileLinkParts = [...fileLinkREResult];
                // for( var j = fileLinkParts.length - 1 ; j >=0 ; j-- ){
                for( var j = 0 ; j < fileLinkParts.length ; j++ ){
                    // reverse search allows building the 
                    // array index 1 contains the matched content 
                    var newDiv = document.createElement('div');
                    newDiv.append( document.createElement('p').innerText = fileLinkParts[j][1] );
                    fileLink.insertAdjacentElement('afterend' , newDiv );
                }
            }
        }
    );
//    console.log( fileInfoBoxes );
};

var processPage = function( INTERVAL_HANDLE ){
    INTERVAL_HANDLE = INTERVAL_HANDLE || null;
    // what kind of page are we on? 
    debugger;
    const location = window.location.toString();
    pageTypes.forEach(function( type ){
        // var type = pageTypes[index];
        if( location.indexOf( type.matchURL ) !== -1 ){
            type.functions.forEach( function( funcName , index ){
                window[ funcName ](type);
            })
        }
    });
    if( INTERVAL_HANDLE ){
        clearInterval( INTERVAL_HANDLE );
        console.log("Cleared interval handle");
    }
};

// Run the functions
(function(){
    var INTERVAL_HANDLE = window.setInterval(() => {
        document.querySelectorAll('div.file-info-panel').forEach(
          (el) => {
            console.log('Runtime!');
            processPage( INTERVAL_HANDLE );
          }
        );
    }, 3000);
})(); // IIFE
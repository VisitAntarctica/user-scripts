// ==UserScript==
// @name      Stash enhancements
// @namespace /user-scripts/source/site-category/adult/stash_enhancements.user.js 
// @version  1.70
// @grant    none
// @noframes
// @description UI/UX enhancements that make stash work better for this user
// ==/UserScript==

// User script config
var filePathRegex = new RegExp(/(?:[\\\/]+([^\\\/]*))+?/,"ig");
var monitoredElement = "div.main"; // root element that we monitor for changes using MutationObserver

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
    try {
        INTERVAL_HANDLE = INTERVAL_HANDLE || null;
        // what kind of page are we on? 
        debugger;
        const location = window.location.toString();
        pageTypes.forEach(function( type ){
            // var type = pageTypes[index];
            if( location.indexOf( type.matchURL ) !== -1 ){
                type.functions.forEach( function( value ){
                    value(type);
                })
            }
        });
    } catch(e){
        console.error("Caught error {0}", e);
    } finally {
        if( INTERVAL_HANDLE ){
            clearInterval( INTERVAL_HANDLE );
            // console.log("Cleared interval handle");
        }
    }
};

// Configuration of page types and the functions to execute when on them
var pageTypes = [
    {
        matchURL: '/scenes/',
        infoBoxSelector: 'dl.scene-file-info.details-list',
        functions: [
            showFullPath
        ]
    },
    {
        matchURL: '/images/',
        infoBoxSelector: 'dl.image-file-info.details-list',
        functions: [
            showFullPath
        ]
    },
    {
        matchURL: '/galleries/',
        infoBoxSelector: 'dl.gallery-file-info.details-list',
        functions: [
            showFullPath
        ]
    }
];

// Run the functions
(function(){   
    var MAIN_HANDLE = window.setInterval(() => {
        document.querySelectorAll( monitoredElement ).forEach(
            (el) => {
                // this code will only run when there is at least one monitored element
                try {
                // console.log('Runtime!');
                // Select the node that will be observed for mutations
                const targetNode = document.querySelector(monitoredElement);

                // Options for the observer (which mutations to observe)
                const config = { attributes: false, childList: true, subtree: false };

                // Callback function to execute when mutations are observed
                const callback = (mutationList, observer) => {
                    for (const mutation of mutationList) {
                        if (mutation.type === "childList") {
                            for( const node of mutation.addedNodes ){
                                // console.info( node );
                                if( node.className == "row" ){
                                    // console.info("added .row node");
                                    var INTERVAL_HANDLE = window.setInterval(() => {
                                        document.querySelectorAll('div.file-info-panel').forEach(
                                        (el) => {
                                            // console.log('Runtime!');
                                            processPage( INTERVAL_HANDLE );
                                        }
                                        );
                                    }, 500);
                                }
                            }
                        }
                    }
                };

                // Create an observer instance linked to the callback function
                const observer = new MutationObserver(callback);

                // Start observing the target node for configured mutations
                observer.observe(targetNode, config);
                } catch(e){
                    console.error(`stash_enhancements.user.js encountered an error when processing the main sequence: ${e}`);
                } finally {
                    window.clearInterval(MAIN_HANDLE);
                }
            }
        );
    }, 500); // 500ms to
})(); // IIFE
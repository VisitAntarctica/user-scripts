// ==UserScript==
// @name      Thisvid - Direct video source generator
// @namespace /user-scripts/source/site-category/adult/thisvid.user.js
// @include /^https://.*\.?thisvid?\.com/videos/
// @version  1.01
// @grant    none
// @noframes
// @description Calculates direct video source URLs from the page contents and surfaces it to the user
// ==/UserScript==
// jshint esversion: 8

/** Gravity config */
// Gravity downloader config
var GRAVITY_ON = false;
var GRAVITY_CONFIG = {
    'host': 'localhost',
    'port': '5050',
    'state': null,
    'icon': '&#10044;',
    'default_icon':'&#128279;' 
};
var GRAVITY_LINK = ( targetUrl , text , fileName , referer ) => {
    text = text || "Download video";
    // replace illegal characters from the filename provided to prevent downstream issues
    var linkFileName = fileName.replace(/\//igm,"-");
    var link = document.createElement('a');
    link.class = "x_gravity_link";
    if( GRAVITY_ON ){
        link.href = `http://${GRAVITY_CONFIG.host}:${GRAVITY_CONFIG.port}/?u=${encodeURIComponent(targetUrl)}&p=${encodeURIComponent(referer)}&fn=${encodeURIComponent(linkFileName)}`;
        link.innerHTML = `${GRAVITY_CONFIG.icon}&nbsp;${text}`;
    } else {
        link.href = targetUrl;
        link.innerHTML = `${GRAVITY_CONFIG.default_icon}&nbsp;${text}`;
    }
    if( GRAVITY_ON == false || ! fileName ){
        link.setAttribute('download', linkFileName);
    }
    link.setAttribute('title' , linkFileName);
    // link.target = "_blank";
    return link;
};


(function() {
  // Determine the title of the page so we can
  //  try to pre-set the downloaded file name
  var title = document.querySelector('.headline h1').textContent;
  // For every video element found in the page, 
  //  use page details to create an HREF to the 
  //  source video file
  var makeVideoElementLink = function(el , INTERVAL_HANDLE){
      INTERVAL_HANDLE = INTERVAL_HANDLE || null;
      // process video element
      var src = el.src;
      var sMatch = [...src.matchAll(/\/(\d+)\.([\w\d]+)\/.*$/igm)];
      var fileExt = sMatch[0][2];
      // var titMatch = [...title.matchAll(/^.* - (.*)'s video - (.*)$/igm)];
      //var m = [...t.matchAll(/^.* - (.*)'s video - (.*)$/igm)]; 
      var fileLabel = "";
      if( sMatch.length >= 1 && sMatch[0].length >= 2 ){
          // valid capture, set the file label
          /*fileLabel = ( 
              titMatch.length > 0 ? 
              'bw_' + titMatch[0][1] + '_' + titMatch[0][2] + '.' + fileExt:
              title
              ); */
              fileLabel = `${title}-${sMatch[0][1]}.${fileExt}`;
      } else {
          fileLabel = title;
      }
      /*var link = document.createElement('a');
      link.href = src;
      link.style = "padding-left: 15px;";
      link.textContent = "Download video"
      link.setAttribute('download', fileLabel);*/
      
      document.querySelector('.headline h1').append(
          GRAVITY_LINK(src, 'Download', fileLabel , document.location)
      );
      if( INTERVAL_HANDLE ){
        clearInterval( INTERVAL_HANDLE );
        console.log("Cleared interval handle");
      }
  }
  // for all the video elements in the page
  var INTERVAL_HANDLE = window.setInterval(() => {
      document.querySelectorAll('video').forEach(
        (el) => {
          console.log('Runtime!');
          makeVideoElementLink( el , INTERVAL_HANDLE );
        }
      );
  }, 3000);
})();
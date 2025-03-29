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

var s = document.createElement('style');
s.setAttribute('type' , 'text/css');
s.setAttribute('id', 'customCSS');

var style = "a:hover img { opacity: 1 !important; }";
var styleNode = document.createTextNode( style );
s.appendChild( styleNode );
document.querySelector('head').appendChild( s );
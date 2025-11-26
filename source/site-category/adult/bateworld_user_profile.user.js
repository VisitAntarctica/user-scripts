// ==UserScript==
// @name      Bateworld - User Profile
// @namespace /user-scripts/source/site-category/adult/bateworld_user_profile.user.js 
// @include /^https://.*\.?bateworld?\.com/profile.php/
// @version  1.05
// @grant    none
// @noframes
// @description User profile enhancements for Bateworld
// ==/UserScript==

var styleCSS = `
button.btn-default {
    color: #000;
    background-color: #ddd;
    border-color: #000;
    float:right;
}
button.btn-success {
    color: #000;
    background-color: #449d44;
    border-color: #398439;
    float:right;
}
button.btn-failure {
    color: #fff;
    background-color: #990000;
    border-color: #440000;
    float:right;
}
`;
var style = document.createElement('style');
style.innerHTML = styleCSS;
document.querySelector('head').appendChild(style);


var copyText = ( el ) => {
    var text = el.getAttribute('data-text');
    if( text.length > 0 ){
        navigator.clipboard.writeText(text).then(function() {
            console.log('Async: Copying to clipboard was successful!');
            el.setAttribute('class', 'btn-success');
          }, function(err) {
            console.error('Async: Could not copy text: ', err);
            el.setAttribute('class','btn-failure');
          });
    }
    return false;
}

(() => {
    //// Make the info section less blocky and more usable 
    try {
        var infoTableText = document.querySelector('div.profile_content').getElementById('01').querySelector('table').innerText;
        var processedText = infoTableText.replace(/:[\t\s\n]+\n/igm,': ').replace(/\n\n/igm,"\n");

        var newdiv = document.createElement('div');
        var btn = document.createElement('button');
        btn.setAttribute('onclick', 'javascript:copyText(this);');
        btn.setAttribute('data-text', processedText);
        btn.setAttribute('class' , 'btn-default');
        btn.innerHTML = 'Copy';
        newdiv.appendChild( btn );
        var profileHeadline = document.querySelector('div.profile_headline');
        profileHeadline.appendChild(newdiv);
    } catch(e){
        console.log(`Error caught when trying to read the info table: ${e}`);
    }
})();

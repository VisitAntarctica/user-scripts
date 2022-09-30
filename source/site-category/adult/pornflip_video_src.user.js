// ==UserScript==
// @name      Pornflip - Extract video source
// @namespace /user-scripts/source/site-category/adult/pornflip_video_src.user.js 
// @include /^https://.*\.?pornflip?\.com/v/
// @version  1.02
// @grant    none
// @noframes
// @description Extracts & displays video source on Pornflip video pages
// ==/UserScript==

var skiprun = 0;

var get_video_title = () => {
    // strip everything after the last comma
    var title = document.getElementsByTagName('title')[0].textContent;
    var cl = title.split(',');
    if( cl.length > 1 ) cl.pop();

    return cl.join(" ").replace(/ ?Gay Porn ?$/,"");
}
var get_video_src = () => {
    var keys = [
        'data-hls-src720',
        'data-hls-src480',
        'data-hls-src360',
        'data-dash-src'
    ]
    var mp = document.getElementsByClassName('mediaPlayer');
    if( mp.length > 0 ){
        for(var i = 0 ; i < mp.length ; i++){
            var v = mp[i];
            for( var j = 0 ; j < keys.length ; j++ ){
                if( v.hasAttribute( keys[j] ) ){
                    var src = v.getAttribute( keys[j] ) || null ;
                    if( src !== null ){
                        show_video_src( keys[j], src , v.parentElement.parentElement.parentElement.parentElement ); 
                        break;
                    }
                }
            }
        }
        skiprun = 0;
    } else {
        // try again shortly
        console.log("No media player found, taking a short break...");
        skiprun++;
        setTimeout(get_video_src, 1000);
    }
};
var show_video_src = (label , src , parentEl) => {
    // var a = document.createElement('a');
    // a.setAttribute('href', src);
    // a.setAttribute('target', '_blank');
    // a.setAttribute('onclick' , 'javascript:return false;');
    // a.innerHTML = "data-dash-src: " + encodeURI(src);
    // parentEl.appendChild( a );
    
    var map = [
        "-o \"" + get_video_title() + ".%(ext)s\" \"" + src + "\"",
        src
    ];
  
    for( var a = 0 ; a < map.length ; a++ ){
        var div = document.createElement('div');
        var lab = document.createElement('label');
        lab.setAttribute('for' , 'pvs-' + label + a);
        lab.textContent = label;
        lab.setAttribute('style' , 'padding-right: 3px; margin-bottom: 2px;');
        div.appendChild(lab);

        var txt = document.createElement('input');
        var fn = 'this.setSelectionRange(0, this.value.length)';
        txt.setAttribute('id' , 'pvs-' + label + a);
        txt.setAttribute('type' , 'text');
        txt.setAttribute('locked' , 'locked');
        txt.setAttribute('value' , map[a]);
        txt.setAttribute('onclick' , fn);
        txt.setAttribute('onfocus' , fn);
        txt.setAttribute('style', 'width: 100%;');
        div.appendChild(txt);
        parentEl.appendChild(div);
    }
};

(function() {
    get_video_src();
})();
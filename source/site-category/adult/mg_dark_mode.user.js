// ==UserScript==
// @name      MG dark mode
// @namespace /user-scripts/source/site-category/adult/mg_dark_mode.user.js 
// @version  1.02
// @include /^https://.*\.?malegeneral\.com\/.*\/.*\.php/
// @include /^https://.*\.?malegeneral\.com\/archive/.*/
// @grant    none
// @noframes
// @description Dark mode for MG
// ==/UserScript==
// jshint version: 8

var style = `html,
body {
    background: #003f88;
}
a:link,
a:visited {
    color: #86b5ff;
}
a:hover,
#menubar label:hover,
[type=radio]:checked ~ label,
.menuTabContent a {
    background: #e0648f;
    color: #001a5a;
}
#menubar,
.menuTabContent,
.return,
legend,
#postForm label,
.extraTitle,
.post-head,
.return-foot {
    background: #005aa9;
    border-color: #002569;
}
.header,
#archivedBoard,
#postForm fieldset,
.extraContainer,
.op-post,
.reply-post,
#footer,
#userdelete,
#userpage {
    background: #001a5a;
    border-color: #d8e6ff;
    color: #fff;
}
button,
input,
textarea,
.delcheck,
.nothumb,
a.nothumb:hover {
    background: #00f1d6;
}
#displayText {
    background-color: rgb(170, 85, 85);
    background-image: linear-gradient(to top, rgb(170, 85, 85) 16%, rgb(204, 153, 153) 79%);
    border-color: #7e3f3f;
    color: #fff;
}
#displayText:hover {
    background-image: linear-gradient(to top, rgb(170, 85, 85) 16%, rgb(204, 153, 153) 79%);
    color: #fff;
}
input[type="submit"] {
    background: #f8f9ed;
    border-color: #7e3f3f;
}
.highlight,
.awaitMod {
    background: #0069ba;
}
.threadsep {
    background: #7e3f3f;
}`;

(function(){
    var s = document.createElement('style');
    s.innerText = style;
    document.body.appendChild(s);
})();
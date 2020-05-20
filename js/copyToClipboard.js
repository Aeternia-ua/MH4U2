var lastSlashIndex = document.location.pathname.lastIndexOf("/");
var origin = (typeof localStorage !== "undefined" && localStorage["mh4u-origin"])?localStorage["mh4u-origin"]:"/index.html";
var newPath = window.location.pathname.substring(0, lastSlashIndex) + origin;
var indexURL = window.location.origin + newPath;

$(document).ready(function(){

    var url = document.getElementById("urlTextField").value = indexURL;

    $(document).on('click', '#copy-btn', function() {
        copyText(url, this);  
    })

});

function copyText(text) {
    var textField = document.getElementById("urlTextField");
    textField.innerText = text;
    textField.select();
    document.execCommand('copy');
}


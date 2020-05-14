//Path to index.html file
const lastSlashIndex = window.location.pathname.lastIndexOf("/");
const origin = localStorage["mh4u-origin"]?localStorage["mh4u-origin"]:"/index.html";
const newPath = window.location.pathname.substring(0, lastSlashIndex) + origin;
const indexURL = window.location.origin + newPath;

$(document).ready(function(){

    let url = document.getElementById("urlTextField").value = indexURL;

    $(document).on('click', '#copy-btn', function() {
        copyText(url, this);  
    })

});

function copyText(text, context) {
    var textField = document.getElementById("urlTextField");
    textField.innerText = text;

    if (context) {
        context.parentNode.insertBefore(textField, context);
    } else {
        document.body.appendChild(textField);
    }

    textField.select();
    document.execCommand('copy');
    // textField.parentNode.removeChild(textField);
    console.log('should have copied ' + text);
}

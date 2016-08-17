function setCookie() {
    var exp = new Date();
    exp.setTime(exp.getTime() + (120 * 1000));
    var value = encodeURI(true) + ((exp === null) ? "" : "; expires="+exp.toUTCString());
    document.cookie = 'visited' + "=" + value;
}

function getCookie() {
    var i,x,y,cookies = document.cookie.split(";");
    for (i = 0; i < cookies.length; i++) {
        x = cookies[i].substr(0,cookies[i].indexOf("="));
        y = cookies[i].substr(cookies[i].indexOf("=")+1);
        x = x.replace(/^\s+|\s+$/g,"");
        if (x === 'visited') {
            if(decodeURI(y).indexOf("true") === 0) {
                return true;
            }
            return false;
        }
    }
}

// If the page has been loaded in the last 120 seconds, don't replay the intro animation
if(getCookie()) {
    document.getElementById('header').className = "";
    document.getElementById('header').style.backgroundColor = "#d3d3d3";
    document.getElementById('logo').className = "";
    document.getElementById('bio').className = "";
    document.getElementById('foot').className = "";
    document.getElementById('content').className = "";
    document.getElementById('col-1').className = "";
    document.getElementById('col-2').className = "";
} else {
    setCookie();
}

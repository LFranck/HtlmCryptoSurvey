/**
 * version 5 28/11/2020
 */

let apikey = "1a01edc67d71cef22b5f25b5b439fb9d512a339d7ac223f02d93d34dc3635a32";

/**
 * Add space between a et b to have a string size long
 * @param string a
 * @param string b
 * @param integer size
 * @returns string
 */
function printSpace(a, b, size) {
    let interval = "";
    while ((a + interval + b).length < size - 1) interval = interval + "_";
    return a + interval + b;
}

/**
 * Construct url to use to cryptocompare
 * @param func
 * @param coin
 * @param currency
 * @param exchange
 * @param param
 * @returns {string}
 */
function constructUrl(func, coin, currency, exchange, param) {
    var url = "https://min-api.cryptocompare.com/data/"
    url += func;
    url += "?fsym=" + coin;
    if (func == 'price')
        url += "&tsyms=" + currency;
    else
        url += "&tsym=" + currency;
    if (exchange != "")
        url += "&e=" + exchange;
    url += "&" + param;
    url += "&rand=" + Math.round(100000 * Math.random());
    url += "&api_key=" + apikey;
    return url;
}

/**
 * Date format
 * @param {type} d
 * @returns {String}
 */
function formatDate(d) {
    var dt = new Date();
    dt.setTime(1000 * d);
    return dt.toLocaleDateString('fr-FR', {timeZone: 'UTC'});
}

/**
 * Calcul la moyenne des valeurs contenues dans le tableau a
 * @param {array} a
 * @returns {Number}
 */
function numAverage(a) {
    var b = a.length, c = 0, i;
    for (i = 0; i < b; i++) {
        c += Number(a[i]);
    }
    return c / b;
}

/**
 *
 * @param currency
 * @param m
 * @returns {string}
 */
function formatMontant(currency, m) {
    var a = 'fr-FR';
    if ('USD' == currency) {
        a = 'us-US';
    }
    let intlN = new Intl.NumberFormat(a, {style: 'currency', currency: currency, maximumFractionDigits: 5});
    return intlN.format(m);
}

/**
 *
 * @param {type} m
 * @returns {String}
 */
function formatCoin(m) {
    var intlN = new Intl.NumberFormat();
    return intlN.format(m) + " " + coin;
}

/**
 *
 * @param {type} UNIX_timestamp
 * @returns {String}
 */
function timeConverter(UNIX_timestamp, complet) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    if (hour < 10)
        hour = "0" + hour;
    var min = a.getMinutes();
    if (min < 10)
        min = "0" + min;
    var sec = a.getSeconds();
    if (sec < 10)
        sec = "0" + sec;
    var time = date + ' ' + month;
    if (complet)
        time = date + ' ' + month + ' ' + hour + ':' + min + ':' + sec;
    return time;
}

/**
 *
 * @param {type} UNIX_timestamp
 * @returns {String}
 */
function hourConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    if (hour < 10)
        hour = "0" + hour;
    var min = a.getMinutes();
    if (min < 10)
        min = "0" + min;
    var sec = a.getSeconds();
    if (sec < 10)
        sec = "0" + sec;
    return hour + ':' + min + ':' + sec;
}


/**
 *
 * @param {type} url
 * @param {type} ret
 * @returns {undefined}
 */
function getJson(url, ret) {
    // console.log("getJson ->" + url)
    /* Appel AJAX vers cryptocompare.com */
    var ajax = new XMLHttpRequest();
    //console.log("getJson : readyState après new : " + ajax.readyState);
    /* Détection de l'avancement de l'appel */
    ajax.onreadystatechange = function () {
        //console.log("getJson : readyState a changé et vaut : " + ajax.readyState)
    }
    /* Détection de la fin de l'appel */
    ajax.onload = function () {
        //console.log("getJson : Appel AJAX terminé");
        //console.log("  status : " + this.status);
        //console.log("  response : " + this.response);
        if (this.status == 200) {
            /* Le service a bien répondu */
            try {
                let json = JSON.parse(this.response);
                let datas = json.Data;
                if (json.Data.Data)
                    datas = json.Data.Data;
                if (datas.length) {
                    for (var i = 0; i < datas.length; i++) {
                        ret[i] = datas[i];
                    }
                } else {
                    Object.keys(datas).forEach(key => {
                        ret.push(datas[key].symbol);
                    })
                }
            } catch (err) {
                //document.getElementById("statresult").style.visibility = "hidden";
                console.log("getJson : Retour JSON incorrect ->" + url);
                return false;
            }
        }
    }
    /* Détection du timeout */
    ajax.ontimeout = function () {
        //document.getElementById("statresult").style.visibility = "hidden";
        console.log("getJson : Le service n'a pas répondu à temps : nouvel essai dans 5 sec");
        /* Relancer l'appel 5 secondes plus tard */
        setTimeout(function () {
            getJson(url, ret);
        }, 5000);
    }
    /* Préparation de la requête et envoi */
    ajax.open("GET", url, true);
    ajax.timeout = 1000;
    /* Délai d'expiration à 1 seconde */
    ajax.send();
}

/**
 *
 * @returns {undefined}
 */
function notifyMe(mess) {

    // Check the last call
    if (typeof notifyMe.lastCall == 'undefined') {
        // It has not... perform the initialization
        notifyMe.lastCall = Date.now();
    }

    // Next notify in 5 minutes
    if (notifyMe.lastCall > Date.now() - 5 * 60 * 1000)
        return;
    notifyMe.lastCall = Date.now();

    if (!window.Notification) {
        console.log('Browser does not support notifications.');
    } else {
        // check if permission is already granted
        if (Notification.permission === 'granted') {
            // show notification here
            var notify = new Notification('Attention !!', {
                body: mess,
                icon: 'https://bit.ly/2DYqRrh',
            });
        } else {
            // request permission from user
            Notification.requestPermission().then(function (p) {
                if (p === 'granted') {
                    // show notification here
                    var notify = new Notification('Attention !!', {
                        body: mess,
                        icon: 'https://bit.ly/2DYqRrh',
                    });
                } else {
                    console.log('User blocked notifications.');
                }
            }).catch(function (err) {
                console.error(err);
            });
        }
    }
}

/**
 *
 * @param currency
 * @param box
 * @param zone
 * @param inPrevious
 * @param inCurrent
 * @param previousDate
 */
function affichageTexte(currency, box, zone, inPrevious, inCurrent, previousDate) {
    //console.log("affichageTexte currency="+currency);
    document.getElementById(zone).innerHTML = "<small><small>" + previousDate + "</small> " + formatMontant(currency, inPrevious) + "</small>";
    if (inPrevious < inCurrent) {
        document.getElementById(zone).innerHTML += "↗";
        document.getElementById(box).style.backgroundColor = "#29b84c";
    } else if (inPrevious > inCurrent) {
        document.getElementById(zone).innerHTML += "↘";
        document.getElementById(box).style.backgroundColor = "#c81111";
    } else {
        document.getElementById(zone).innerHTML += " ➔";
        document.getElementById(box).style.backgroundColor = "#0c83b6";
    }
    document.getElementById(zone).innerHTML += "<br />" + formatMontant(currency, inCurrent);
}

/**
 *
 * @param {type} texte
 * @returns {undefined}
 */
function popup(texte) {
    // ouvre une fenetre sans barre d'etat, ni d'ascenceur
    w = open("", 'popup', 'width=400,height=200,toolbar=no,scrollbars=no,resizable=yes');
    w.document.write("<title>Résultat de la simulation</title>");
    w.document.write("<body>" + texte + "</body>");
    w.document.close();
}

/**
 *
 * @param {boolean} test
 * @param {string} out
 * @returns {void}
 */
function traitePlus(test, out) {
    if (out == undefined) {
        out.texte = "";
        out.compteur = 0;
    }
    if (test) {
        out.text += "+";
        out.compteur++;
    } else {
        out.text += "-";
    }
}

function testLetter(word, letter) {
    let up = letter.toUpperCase();
    let wup = word[0].toUpperCase();
    let ret = false;
    ret = ret || wup == up;
    ret = ret || (letter == '#' && (wup < 'A' || wup > 'Z'))
    return ret;
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
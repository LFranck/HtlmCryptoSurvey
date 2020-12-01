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

/**
 *
 * @param {type} localdays
 * @param {type} start
 * @param {type} nbCritere
 * @param {type} limitPourcent
 * @param {type} nbjr
 * @returns {string}
 */
function calcul(localdays, start, nbCritere, limitPourcent, nbjr, out) {
    //console.log("calcul ->"+localdays.length+", "+start+", "+nbCritere+", "+limitPourcent+", "+nbjr);
    var timestart = new Date(start);
    var usd = 1; // Valeur de départ
    var btc = 0; // Valeur en coin
    var nbOp = 0; // Nombre d'opération

    // Calcul de la moyenne glissante
    var moyHigh = [], moyLow = [];
    // initialisation des tableaux
    for (var i = 0; i < localdays.length; i++) {
        moyHigh[i] = 0;
        moyLow[i] = 0;
    }
    // calcul des moyennes glissantes sur 'nbjr' jours
    for (var k = 0; k < localdays.length; k++) {
        var l = k, cumulHigh = 0, cumulLow = 0;
        for (l = k; l < k + nbjr; l++) {
            if (l < localdays.length) {
                cumulHigh += localdays[l].high;
                cumulLow += localdays[l].low;
            }
        }
        if (l - 1 < localdays.length) {
            moyHigh[l - 1] = cumulHigh / nbjr;
            moyLow[l - 1] = cumulLow / nbjr;
        }
    }

    for (var i = 0; i < localdays.length - 1; i++) {
        // est on dans la période demandée
        if (localdays[i].time < timestart.getTime() / 1000)
            continue;
        if (btc == 0 && (localdays[i].low < localdays[i + 1].low) && (moyLow[i] > moyLow[i + 1])) {
            var localCritere = 0;
            // Critere 1 : Les courbes se croisent
            if ((localdays[i].low < moyLow[i]) && (localdays[i + 1].low > moyLow[i + 1]))
                localCritere++;
            // Critere 2 : Idem avec la courbe des valeurs hautes
            if ((localdays[i].high < localdays[i + 1].high) && (moyHigh[i] > moyHigh[i + 1]))
                localCritere++;
            // Critère 3 : si la valeur d'achat est dans la limite avec la valeur basse de référence
            var limite = (limitPourcent / 100) * (localdays[i + 1].high - localdays[i + 1].low) + localdays[i + 1].low;
            if (localdays[i + 1].close < limite)
                localCritere++;
            // Si le nombre de critères vérifiés est au moins égal à la cible : achat
            if (localCritere >= nbCritere) {
                btc = usd / localdays[i + 1].close;
                //console.log("btc -> usd "+btc+"->"+usd);
                usd = 0;
                nbOp++;
            }
        } else {
            if (usd == 0 && (localdays[i].high > localdays[i + 1].high) && (moyHigh[i] < moyHigh[i + 1])) {
                var localCritere = 0;
                // Critere 1 : les courbes se croisent
                if ((localdays[i].high > moyHigh[i]) && (localdays[i + 1].high < moyHigh[i + 1]))
                    localCritere++;
                // Critere 2 : Idem avec la courbe des valeurs basses
                if ((localdays[i].low > localdays[i + 1].low) && (moyLow[i] < moyLow[i + 1]))
                    localCritere++;
                // Critère 3 : si la valeur de vente est dans la limite avec la valeur haute de référence
                var limite = (1 - limitPourcent / 100) * (localdays[i + 1].high - localdays[i + 1].low) + localdays[i + 1].low;
                if (limite < localdays[i + 1].close)
                    localCritere++;
                // Si le nombre de critères vérifiés est au moins égal à la cible : vente
                if (localCritere >= nbCritere) {
                    usd = btc * localdays[i + 1].close;
                    //console.log("usd -> btc "+usd+"->"+btc);
                    btc = 0;
                    nbOp++;
                }
            }
        }
    }
    var total = (btc == 0) ? usd : btc * localdays[localdays.length - 1].high;
    //var pourcent = (nbOp < 2) ? 0 : Math.exp(Math.log(total / usdstart) / (nbOp - 1)) - 1;
    out.total = Math.round(total);
    if (total < 1000)
        out.total = Math.round(10 * total) / 10;
    if (total < 100)
        out.total = Math.round(100 * total) / 100;
    if (total < 10)
        out.total = Math.round(1000 * total) / 1000;
    if (total < 1)
        out.total = Math.round(10000 * total) / 10000;
    out.oper = nbOp;
    return out.total + "(" + nbOp + ")"; //Math.round(100 * pourcent) * 100;
}

function setColor(btn, color){
    var count=1;
    var property = document.getElementById(btn);
    if (count == 0){
        property.style.backgroundColor = "#FFFFFF"
        count=1;
    }
    else{
        property.style.backgroundColor = "#7FFF00"
        count=0;
    }

}
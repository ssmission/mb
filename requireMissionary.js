function setCookie(cname, cvalue, exdays='') {
    let expires = '';
    if (exdays != '') {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        expires = ";expires="+d.toUTCString();
    }
    document.cookie = cname + "=" + cvalue + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

let ssmUserStr = getCookie('ssmUser');
let ssmUser = {};
let mustLogIn = true;
if (ssmUserStr != '') {
    try {
        ssmUser = JSON.parse(ssmUserStr);
        if (ssmUser.email.toLowerCase().includes('@missionary.org')) {
            mustLogIn = false;
        }
    } catch (e) {}
}

document.write('<div id="loadingCover" style="position: fixed; height: 100%; width: 100%; top:0; left: 0; background: ' + (document.body.style.backgroundColor || 'white') + '; z-index:9999;"></div>')

if (mustLogIn) {
    document.write(`<script src="https://accounts.google.com/gsi/client" async defer>
    </script><script src="https://unpkg.com/jwt-decode/build/jwt-decode.js"></script>
    <img id="ssmLogoBIG_forSignIn" src="img/ssmLogo.png" alt="ssmLogo">`);

    document.head.innerHTML = `<style id="signInSTYLES">
    html, body, #ssmLogoBIG_forSignIn {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    </style>` + document.head.innerHTML;
}

function setUserInfoOnPage() {
    setAllValues('ssmUser.id', ssmUser.id);
    setAllValues('ssmUser.full_name', ssmUser.full_name);
    setAllValues('ssmUser.given_name', ssmUser.given_name);
    setAllValues('ssmUser.family_name', ssmUser.family_name);
    setAllValues('ssmUser.picture', ssmUser.picture);
    setAllValues('ssmUser.email', ssmUser.email);

    // set logout button(s)
    const sa = document.getElementsByClassName('ssmUser.logout');
    for (var i=0; i<sa.length; i++) {
        sa.item(i).onclick = LogoutOfSSM_MissionaryAccount;
    }
    document.getElementById('loadingCover').remove();
}
function setAllValues(s, val) {
    const sa = document.getElementsByClassName(s);
    for (var i=0; i<sa.length; i++) {
        sa.item(i).innerHTML = val;
    }
}
function LogoutOfSSM_MissionaryAccount() {
    ssmUser = {};
    setCookie('ssmUser', '');
    location.reload();
}

function handleGoogleLogin(response) {
    const responsePayload = jwt_decode(response.credential);
    if (responsePayload.email.split('@')[1].toLowerCase().includes('missionary.org') || responsePayload.email.split('@')[1].toLowerCase().includes('churchofjesuschrist.org')) {
        document.getElementById('google_btn').remove();
        document.getElementById('signInSTYLES').remove();
        document.getElementById('ssmLogoBIG_forSignIn').remove();

        // set cookies
        ssmUser = {
            'id' : responsePayload.sub,
            'full_name' : responsePayload.name,
            'given_name' : responsePayload.given_name,
            'family_name' : responsePayload.family_name,
            'picture' : responsePayload.picture,
            'email' : responsePayload.email,
        };
        setCookie('ssmUser', JSON.stringify(ssmUser));
        
        // set images and stuff like that to see that their logged in
        window.onbeforeunload = null;
        location.reload();
    } else {
        // clear login cookies
        document.write('<h2>Access Denied</h2><br><br>Sorry, you don\'t have access to this page because you\'re not a missionary. If you beleive this is a mistake, try <a href=".">logging in again with your missionary account</a>');
    }
}
function startGoogleSignIn() {
    const mainPage = document.querySelectorAll('body >*:not(SCRIPT)');
    mainPage.forEach(el => {
        el.remove();
    });
    
    document.getElementById('loadingCover').remove();
    const gBtn = document.createElement('DIV');
    gBtn.id = 'google_btn';
    document.body.prepend(gBtn);
    google.accounts.id.initialize({
        client_id: '586912630163-r9jcchrhcc8scts2sngcb325va5u0hkj.apps.googleusercontent.com',
        callback: handleGoogleLogin,
        cancel_on_tap_outside: false
    });
    google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // try next provider if OneTap is not displayed or skipped
            const parent = document.getElementById('google_btn');
            google.accounts.id.renderButton(parent, {
                theme: "filled_blue",
                type: "standard",
                shape: "rectangular",
                theme: "outline",
                text: "continue_with",
                size: "large",
                logo_alignment: "left"
            });
            google.accounts.id.prompt();
        }
    });
}
if (mustLogIn) {
    window.onload = startGoogleSignIn;
} else {
    window.onload = setUserInfoOnPage;
}
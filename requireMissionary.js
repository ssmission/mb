const pageDivId = document.currentScript.getAttribute('containerDIV') || null;
if (pageDivId == null) {
    throw new Error('You must specify the page container to be hidden if not logged in. For instance: <script src="requireMissionary.js" containerDiv="mainPage"></script>');
}
const pageDIV = document.getElementById(pageDivId).cloneNode(true);
document.getElementById(pageDivId).remove();

document.write('<script src="https://accounts.google.com/gsi/client" async defer></script><script src="https://unpkg.com/jwt-decode/build/jwt-decode.js"></script>');


function handleGoogleLogin(response) {
    console.log(response);
    const responsePayload = jwt_decode(response.credential);
    if (responsePayload.email.split('@')[1].toLowerCase().includes('missionary.org') || responsePayload.email.split('@')[1].toLowerCase().includes('churchofjesuschrist.org')) {
        document.body.prepend(pageDIV);
        document.getElementById(pageDivId).style.display = "";
        document.getElementById('google_btn').remove();
        // set images and stuff like that to see that their logged in
    } else {
        // clear login cookies
        document.write('<h2>Access Denied</h2><br><br>Sorry, you don\'t have access to this page because you\'re not a missionary. If you beleive this is a mistake, try <a href=".">logging in again with your missionary account</a>');
    }
}
window.onload = function () {
    const gBtn = document.createElement('DIV');
    gBtn.id = 'google_btn';
    document.body.prepend(gBtn);
    google.accounts.id.initialize({
        client_id: '586912630163-r9jcchrhcc8scts2sngcb325va5u0hkj.apps.googleusercontent.com',
        callback: handleGoogleLogin
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
                logo_alignment: "left",
                cancel_on_tap_outside: false
            });
            google.accounts.id.prompt();
        }
    });
}
const pageDivId = document.currentScript.getAttribute('containerDIV') || null;
if (pageDivId == null) {
    throw new Error('You must specify the page container to be hidden if not logged in. For instance: <script src="requireMissionary.js" containerDiv="mainPage"></script>');
}
const pageDIV = document.getElementById(pageDivId).cloneNode(true);
document.getElementById(pageDivId).remove();

// to put it back: document.body.prepend(pageDIV);

document.write('<script src="https://accounts.google.com/gsi/client" async defer></script><script src="https://unpkg.com/jwt-decode/build/jwt-decode.js"></script>');

function handleGoogleLogin(response) {
    console.log(response);
    const responsePayload = jwt_decode(response.credential);
    if (responsePayload.email.split('@')[1].toLowerCase().includes('missionary.org') || responsePayload.email.split('@')[1].toLowerCase().includes('churchofjesuschrist.org')) {
        alert('good');
    } else {
        alert('no-good');
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

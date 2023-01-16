document.write('<script src="https://accounts.google.com/gsi/client" async defer></script><script src="https://unpkg.com/jwt-decode/build/jwt-decode.js"></script>');

function handleGoogleLogin(response) {
    console.log(response);
    const responsePayload = jwt_decode(response.credential);

    console.log("ID: " + responsePayload.sub);
    console.log('Full Name: ' + responsePayload.name);
    console.log('Given Name: ' + responsePayload.given_name);
    console.log('Family Name: ' + responsePayload.family_name);
    console.log("Image URL: " + responsePayload.picture);
    console.log("Email: " + responsePayload.email);
    alert("Email: " + responsePayload.email);
}
window.onload = function () {
    const gBtn = document.createElement('DIV');
    gBtn.id = 'google_btn';
    document.body.prepend(gBtn);
    google.accounts.id.initialize({
        client_id: '1032123159845-v6r228c1sb4su1gdck40a2kctu8k8riu.apps.googleusercontent.com',
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

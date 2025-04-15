window.onload = function() {
    load();
};

async function load() {
    console.log("Loading...");
    const captchaToken = await captcha();

    console.log("Captcha token: " + captchaToken);

    // Call the API
    const response = await fetch(`https://tools.mailmeteor.com/api/email-checker?cf-turnstile-response=${captchaToken}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  email: "fake.email@domain.com",
                }),
    });
      
    // Parse the response
    if (response.ok) {
        const jsonResponse = await response.json()
        console.log("SUCCESS");
        console.log(jsonResponse);
    }
    else {
        console.log("ERROR: " + response.statusText);
    }
}

function captcha() {
    return new Promise(function (resolve, reject) {
      turnstile.render('#cloudflare-captcha', {
        sitekey: '0x4AAAAAAAe7i7oicz-TnMTr',
        action: 'emailchecker',
        callback: function (token) {
          resolve(token)
        },
        'error-callback': function (err) {
          reject(err)
        }
      });
    });
}
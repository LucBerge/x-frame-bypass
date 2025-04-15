window.onload = function() {
    load();
};

async function load() {
    // Spoof the domain
    console.log("Spoofing domain...");
    spoof(window, 'origin', 'https://mailmeteor.com');
    spoof(window.location, 'host', 'mailmeteor.com');
    spoof(window.location, 'hostname', 'mailmeteor.com');
    spoof(window.location, 'href', "https://mailmeteor.com/email-checker?email=fake.email%40domain.com");
    spoof(window.location, 'origin', "https://mailmeteor.com");
    spoof(window.location, 'pathname', "/email-checker");
    spoof(window.location, 'search', "fake.email%40domain.com");

    // Load the captcha
    console.log("Loading captcha...");
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

function spoof(object, attr, value) {
    const valueBefore = object[attr];

    Object.defineProperty(object, attr, {
        get: function () {
            return value;
        }
    });
    
    const valueAfter = object[attr];
    console.log(`Spoofed  ${attr} from ${valueBefore} to ${valueAfter}`);
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
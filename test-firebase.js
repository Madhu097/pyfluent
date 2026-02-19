const https = require('https');

const apiKey = 'AIzaSyAUtBq8VaMALRBxMwPL0yd8Cla6uoSljj0';

const data = JSON.stringify({
    email: 'test@example.com',
    password: 'password123',
    returnSecureToken: true
});

const options = {
    hostname: 'identitytoolkit.googleapis.com',
    port: 443,
    path: `/v1/accounts:signInWithPassword?key=${apiKey}`,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (e) => {
    console.error(e);
});

req.write(data);
req.end();

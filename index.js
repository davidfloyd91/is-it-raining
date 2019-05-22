// $ curl -X GET -H 'Content-Type: application/json' http://localhost:3000/location

// $ curl -X POST -H 'Content-Type: application/json' https://www.googleapis.com/geolocation/v1/geolocate?key=$GOOGLE_API_KEY

const express = require('express');
const https = require('https');

const app = express();
const port = 3000;

const googleKey = process.env.GOOGLE_API_KEY;

const options = {
  hostname: 'www.googleapis.com',
  path: `/geolocation/v1/geolocate?key=${googleKey}`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/location', (req, res) => {
  const request = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
    });

    res.on('end', () => {
      console.log('No more data in response.');
    });
  });

  request.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });

  request.end();
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

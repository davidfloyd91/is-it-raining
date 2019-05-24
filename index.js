// $ curl -X GET -H 'Content-Type: application/json' http://localhost:8081/location
// $ curl -X GET -H 'Content-Type: application/json' http://localhost:8081/weather

// $ curl -X GET -H 'Content-Type: application/json' http://is-it-raining-env.mqxjxhgsyd.us-east-1.elasticbeanstalk.com/location
// $ curl -X GET -H 'Content-Type: application/json' http://is-it-raining-env.mqxjxhgsyd.us-east-1.elasticbeanstalk.com/weather

const express = require('express');
const https = require('https');
const app = express();
const port = 8081;

const googleKey = process.env.GOOGLE_API_KEY;
const darkSkyKey = process.env.DARK_SKY_API_KEY;

const googleOptions = {
  hostname: 'www.googleapis.com',
  path: `/geolocation/v1/geolocate?key=${googleKey}`,
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
};

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/location', (req, res) => {
  let data = '';

  const request = https.request(googleOptions, (response) => {
    console.log(`STATUS: ${response.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
    response.setEncoding('utf8');
    response.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
      data += chunk;
    });

    response.on('end', () => {
      console.log('No more data in response.');

      let coords = JSON.parse(data);
      res.send(coords);
    });
  });

  request.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });

  request.end();
});

app.get('/weather/:lat,:lng', (req, res) => {
  const lat = req.params.lat;
  const lng = req.params.lng;

  let data = '';

  const darkSkyOptions = {
    hostname: 'api.darksky.net',
    path: `/forecast/${darkSkyKey}/${lat},${lng}`,
    headers: { 'Content-Type': 'application/json' }
  };

  const request = https.request(darkSkyOptions, (response) => {
    console.log(`STATUS: ${response.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
    response.setEncoding('utf8');
    response.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
      data += chunk;
    });

    response.on('end', () => {
      console.log('No more data in response.');

      let parsed = JSON.parse(data);
      res.send(parsed);
    });
  });

  request.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });

  request.end();
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

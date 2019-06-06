const express = require('express');
const https = require('https');
const cors = require('cors');
const app = express();
const port = 8081;

const darkSkyKey = process.env.DARK_SKY_API_KEY;
const googleKey = process.env.GOOGLE_API_KEY;

const corsOptions = {
  origin: '*'
}

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/weather/:lat,:lng', cors(corsOptions), (req, res) => {
  const lat = req.params.lat;
  const lng = req.params.lng;
  let data = '';

  const darkSkyOptions = {
    hostname: 'api.darksky.net',
    path: `/forecast/${darkSkyKey}/${lat},${lng}`,
    headers: { 'Content-Type': 'application/json' }
  };

  if (req.headers.origin) {
    console.log('origin', req.headers.origin)
  } else {
    console.log('no req.headers.origin')
  }

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

app.get('/location/:zip', cors(corsOptions), (req, res) => {
  const zip = req.params.zip;
  let data = '';

  const googleOptions = {
    hostname: 'maps.googleapis.com',
    path: `/maps/api/geocode/json?key=${googleKey}&address=${zip}`,
    headers: { 'Content-Type': 'application/json' }
  };

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

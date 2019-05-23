// $ curl -X GET -H 'Content-Type: application/json' http://localhost:3000/location
// $ curl -X GET -H 'Content-Type: application/json' http://localhost:3000/weather

// $ curl -X POST -H 'Content-Type: application/json' https://www.googleapis.com/geolocation/v1/geolocate?key=$GOOGLE_API_KEY
// $ curl -X GET -H 'Content-Type: application/json' https://api.darksky.net/forecast/$DARK_SKY_API_KEY/0,0

const express = require('express');
const https = require('https');
const app = express();
const port = 3000;

const googleKey = process.env.GOOGLE_API_KEY;
const darkSkyKey = process.env.DARK_SKY_API_KEY;

let lat, lng, darkSkyOptions, minutelyForecast;

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
      let coords = JSON.parse(data);
      lat = coords.location.lat.toFixed(3);
      lng = coords.location.lng.toFixed(3);
      setDarkSkyOptions();

      console.log('No more data in response.');
    });
  });

  request.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });

  request.end();
});

const setDarkSkyOptions = () => {
  darkSkyOptions = {
    hostname: 'api.darksky.net',
    path: `/forecast/${darkSkyKey}/${lat},${lng}`,
    headers: { 'Content-Type': 'application/json' }
  };
};

app.get('/weather', (req, res) => {
  let data = '';

  if (darkSkyOptions) {
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
        minutelyForecast = parsed.minutely;

        console.log(minutelyForecast);
      });
    });

    request.on('error', (e) => {
      console.error(`Problem with request: ${e.message}`);
    });

    request.end();
  } else {
    console.log('Cannot complete query, coordinates unavailable.');
  };
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

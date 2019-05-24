// $ curl -X GET -H 'Content-Type: application/json' http://localhost:8081/location
// $ curl -X GET -H 'Content-Type: application/json' http://localhost:8081/weather

const express = require('express');
const https = require('https');
const app = express();
const port = 8081;

const googleKey = process.env.GOOGLE_API_KEY;
const darkSkyKey = process.env.DARK_SKY_API_KEY;

let lat, lng, darkSkyOptions, minutelyForecast, isItRaining;

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

      res.send(coords);
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

        if (minutelyForecast) {
          setIsItRaining();
        };

        res.send(parsed);
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

const setIsItRaining = () => {
  let precipArr = minutelyForecast.data.map(min => {
    return min.precipProbability;
  });

  precipArr.forEach(prob => {
    if (prob >= 0.5) {
      isItRaining = 2;
    } else if (prob >= 0.1) {
      isItRaining = 1;
    } else {
      isItRaining = 0;
    };
  });
};

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

// $ curl -X GET -H 'Content-Type: application/json' http://localhost:8081/weather
// $ curl -X GET -H 'Content-Type: application/json' http://is-it-raining-env.mqxjxhgsyd.us-east-1.elasticbeanstalk.com/weather

const express = require('express');
const https = require('https');
const cors = require('cors');
const app = express();
const port = 8081;

const darkSkyKey = process.env.DARK_SKY_API_KEY;

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

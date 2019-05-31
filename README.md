# Is It Gonna Rain? (API)

__Is It Gonna Rain?__ is a Chrome extension that answers one simple question: how likely is it to rain in the next hour where you are? The frontend lives at [this repo](https://github.com/davidfloyd91/is-it-raining-frontend).

Download the extension from the Chrome Web Store [here](https://chrome.google.com/webstore/detail/is-it-gonna-rain/nadehodhmoogambiebejlonkdifmobbp).

When this route—

```
http://is-it-raining-env.mqxjxhgsyd.us-east-1.elasticbeanstalk.com/location/<zip>
```

—is accessed with a five-digit zip code, the API queries [Google's Geocoding API](https://developers.google.com/maps/documentation/geocoding/intro) to grab coordinates (latitude and longitude).

These coordinates are then fed to the [Dark Sky API](https://darksky.net/dev) via this route—

```
http://is-it-raining-env.mqxjxhgsyd.us-east-1.elasticbeanstalk.com/weather/<lat>,<lng>
```

—and the frontend crunches the results of that query to tell you whether you should bring an umbrella when you go out to lunch.

There are four possible responses:

- __"It's not gonna rain":__ there is a less-than-10% probability that it will rain in the provided zip code in the next hour
- __"It could rain":__ the probability that it will rain in the provided zip code in the next hour is between 10% and 50%
- __"It's gonna rain":__ the probability that it will rain in the provided zip code in the next hour is greater than 50%
- __"It's like, raining":__ the probability that it will rain in the next minute (or hour, if minute-by-minute precision isn't available in your zip code) is greater than 90%

This extension is available under the MIT License. Please [contact](https://davidfloyd91.github.io/contact/) me with any issues, suggestions, etc.

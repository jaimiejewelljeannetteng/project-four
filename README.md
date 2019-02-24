Paired API-powered application with jQuery

This application uses two APIs, APIXU for weather, and Etsy.
This application will return the current weather conditions of the city that the user enters into the input. According to the current weather conditions in the city, the application will call the Etsy API to return a top and a bottom clothing suggestion.

Currently, there are two conditions on the current.temp_c key in the APIXU weather API. First, if the current temperature in the city the user inputed is above 10 degrees celcius, the Etsy API will return two etsy items, one  with the keyword tshirt (for top API call), and one with the keyword shorts (for bottom API call). Similarly, if the weather is below 10 degrees celcius according to the current.temp_c in the APIXU weather API, the Etsy API will again return two items, this time one with the keyword of sweater, and the other with the keyword of pants.

The results above are generated on a single click of the submit button. The user also has the opportunity to click the generate button, to produce another outfit pair.


const app = {};
app.apiKeyWeather = "8f6dab90acf14f9da11221736191902";
app.apiUrlWeather = "http://api.apixu.com/v1/current.json";
app.apiKeyEtsy = "rkcrycwnyei9ana141cxdioh";
app.apiUrlEtsy = "https://openapi.etsy.com/v2/shops/polomocha/listings/active";
app.userInput = ""; //empty var for user to enter city

app.getWeather = toronto => {
  $.ajax({
    url: app.apiUrlWeather,
    method: "GET",
    dataType: "json",
    data: {
      key: app.apiKeyWeather,
      q: "toronto"
    }
  }).then(function(response) {
    console.log(response);
    app.displayWeather(response);
    // $('# from html').empty();
  });
}; //app.getWeather ends here

let weatherArray = [];
app.displayWeather = function(data) {
  console.log(data);
  weatherArray.push(data);
  console.log("weatherArray: ", weatherArray);

  app.currentConditions = weatherArray.map(function(current) {
    console.log(current);
    return `
            <div class="weatherDetails" >
                <img src="${current.current.condition.icon}">
                <h2>${current.location.name}</h2>
                <h2>${current.current.condition.text}</h2>
                <p>${current.current.temp_c}</p>
            </div>`;
    //   return app.currentHtml;
  });
  console.log(app.currentConditions);

  $("#displayWeather").append(app.currentConditions);

  //method - determine user's input - which would be the query
  // get data from API, print temperature, feels like, icon, to screen
  // run error if input is blank
  //
};

app.init = () => {
  app.getWeather();
  //attain api
  //onclick function for the input submit
  $("form").on("submit", function() {
    //When submitted, the value will get info from Weather & Etsy then show info on DOM

    //get the value of input
    //async scroll down to show weather

    //query to getWeather, await response because all subsequent
    //logic depends on its result
    // const weather = await app.getWeather(location);

    // get temperature from response
    // const temperature = weather.temperature;

    // compare temperature. If temperature>0, return etsyA(includes jacket). If temperature<0, return etsyB (includes coat)

    // const params = app.getEtsyParams(temperature);
    //once receive temperature, it will compare it with 0
    //if above 0'C, return Etsy A (Tshirt,Short Pants)
    //if below 0'C, return Etsy B (coat, Long Pants)
    //return top/bottom properties {top:shirt,bottom:pants}

    //compare temperature.If temperature > 0, return etsyA(includes jacket).If temperature < 0, return etsyB(includes coat)
    // const params = app.getEtsyParams(temperature);
    // app.getEtsyParams = temperature => {
    //   let EtsyA = ["tshirt", "short pants"];
    //   let EtsyB = ["coat", "long pants"];
    //   if (temperature > 0) {
    //     return EtsyA;
    //   } else {
    //     return EtsyB;
    //   }
    // };
    //once receive temperature, it will compare it with 0
    //if above 0'C, return Etsy A (Tshirt,Short Pants)
    //if below 0'C, return Etsy B (coat, Long Pants)
    //return top/bottom properties {top:shirt,bottom:pants}
    //take array and map through it and then query through the getEtsy API
    //e.g params = ['tshirt', 'short pant']
    // const callParamTwice = app.callEtsyApiTwice(params);
    // app.callEtsyApiTwice = params => {
    //   params.forEach(query => {
    //     //item will go through the getEtsy query
    //     app.getEtsy(query);
    //   });
    // };

    //call api twice with top/bottom then return to DOM.
    app.getEtsy();
  });
};

//query the returned compareTemperature.
// Etsy A argument will be used as keyword on getEtsy.
//returned is then shown on the DOM
app.getEtsy = () => {
  //proxy
  $.ajax({
    url: "http://proxy.hackeryou.com",
    // url: app.apiUrlEtsy,
    method: "GET",
    dataType: "json",
    data: {
      reqUrl: app.apiUrlEtsy,
      params: {
        api_key: app.apiKeyEtsy
        // keywords: "jacket"
      }
    }
  }).then(function(response) {
    console.log(response);
  });
  //receive object
};

$("#generate").on("click", function() {
  //call api twice with top/bottom then return to DOM.
});
$(function() {
  app.init();
}); // doc ready ends here

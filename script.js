const app = {};
app.apiKeyWeather = "8f6dab90acf14f9da11221736191902";
app.apiUrlWeather = "http://api.apixu.com/v1/current.json";
app.apiKeyEtsy = "rkcrycwnyei9ana141cxdioh";
app.apiUrlEtsy = "https://openapi.etsy.com/v2/shops/polomocha/listings/active";
app.userInput = ""; //empty var for user to enter city

app.getWeather = location => {
  $.ajax({
    url: app.apiUrlWeather,
    method: "GET",
    dataType: "json",
    data: {
      key: app.apiKeyWeather,
      q: location
    }
  }).then(function(response) {
    app.displayWeather(response);
    // get temperature from response
    let temperature = response.current.temp_c;
    app.getEtsyParams(temperature);
  });
}; //app.getWeather ends here

let weatherArray = [];
app.displayWeather = function(data) {
  weatherArray.pop();
  weatherArray.push(data);
  app.currentConditions = weatherArray.map(function(current) {
    return `
            <div class="weatherDetails" >
                <h2 class="weatherSentence">In ${
                  current.location.name
                }, the weather is ${current.current.condition.text} with current temperature of ${current.current.temp_c}, but it feels like ${current.current.feelslike_c} degrees celcius</h2>
            </div>`;
  });

  $(".displayWeather").html("");
  $(".displayWeather").html(app.currentConditions);

  //method - determine user's input - which would be the query
  // get data from API, print temperature, feels like, icon, to screen
  // run error if input is blank
};

app.resetContainer = function() {
  $("form input[type=text]").val("");
  $(".weatherSentence").empty("");
  console.log("reset");
};

app.init = () => {
  app.getWeather();
  $("#submitButton").on("click", function() {
    //When submitted, the value will get info from Weather & Etsy then show info on DOM
    //get the value of input
    const location = $("#city").val();
    //put userInput into app.getWeather
    app.getWeather(location);
    //displayWeather will show the API data according to userInput to DOM
    $(".displayWeather").val("");

    //async scroll down to show weather

    // const weather = await app.getWeather(location);

    // const params = app.getEtsyParams(temperature);
    //once receive temperature, it will compare it with 0
    //if above 0'C, return Etsy A (Tshirt,Short Pants)
    //if below 0'C, return Etsy B (jacket,  Pants)
    //return top/bottom properties {top:shirt,bottom:pants}

    //call api twice with top/bottom then return to DOM.
    app.callEtsyApiTwice = param => {
      let etsyQuery = param.map(query => {
        console.log("query: ", query);
        return app.getEtsy(query);
      });
      $.when(...etsyQuery).then((...args) => {
        let argItem = args.map((item, index) => {
          console.log(item);
          const i = Math.floor(Math.random() * item[0].results.length);
          return item[0].results[i].MainImage.url_75x75;
        });
        console.log(argItem);
        app.displayEtsy(argItem);
      });
    };
    app.getEtsyParams = temperature => {
      let EtsyA = ["tshirt", "shorts"];
      let EtsyB = ["sweater", "denim pants"];
      if (temperature > 0) {
        app.callEtsyApiTwice(EtsyA);
      } else {
        app.callEtsyApiTwice(EtsyB);
      }
    };
    app.displayEtsy = item => {
      let itemDisplay = item.map(item => {
        console.log(item);
        return `<img src="${item}">`;
      });

      $(".displayTop").html("");
      $(".displayTop").append(itemDisplay);
    };

    //[EtsyA]
    //once receive temperature, it will compare it with 0
    //if above 0'C, return Etsy A (Tshirt,Short Pants)
    //if below 0'C, return Etsy B (coat, Long Pants)
    //return top/bottom properties {top:shirt,bottom:pants}
    //take array and map through it and then query through the getEtsy API
    //e.g etsyParams = ['tshirt', 'short pant']
    // app.callEtsyApiTwice(etsyParams);

    // let etsyselection = app.callEtsyApiTwice(etsyParams);
    // console.log("etsyselection: ", etsyselection);
    // console.log(app.callEtsyApiTwice(etsyParams));
  });
};

app.handleReset = function() {
  $("#reSubmitButton input[type=submit]").on("click", function() {
    app.resetContainer();
  });
};

//query the returned compareTemperature.
// Etsy A argument will be used as keyword on getEtsy.
//returned is then shown on the DOM

app.getEtsy = item => {
  //proxy
  return $.ajax({
    url: "https://proxy.hackeryou.com",
    method: "GET",
    dataType: "json",
    data: {
      reqUrl: app.apiUrlEtsy,
      params: {
        api_key: app.apiKeyEtsy,
        keywords: item,
        includes: "MainImage"
      }
    }
  });
  // .then(function(response) {
  //   console.log("response: ", response);
  //   let result = response.results;
  //   app.displayEtsy(result);
  // });
  //receive object
};

let etsyArray = [];
app.displayEtsy = data => {
  etsyArray.pop();
  etsyArray.push(data);
  app.etsyImage = etsyArray.map(function(item) {
    // let top = item[0].MainImage.url_fullxfull;
    let top = item[0].MainImage.url_75x75;
    let bottom = item[2].MainImage.url_75x75;

    $(".displayTop").html("");
    $(".displayTop").append(`<img src="${top}" />`);
    $(".displayTop").append(`<img src="${bottom}" />`);
  });
};

$("#generate").on("click", function() {
  //call api twice with top/bottom then return to DOM.
});
$(function() {
  app.init();
  app.handleReset();
}); // doc ready ends here

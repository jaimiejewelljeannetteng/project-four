const app = {};
app.apiKeyWeather = "8f6dab90acf14f9da11221736191902";
app.apiUrlWeather = "http://api.apixu.com/v1/current.json";
app.apiKeyEtsy = "xjgnf5lk3m3ruxemnnsz5knp";
app.apiUrlEtsy = "https://openapi.etsy.com/v2/shops/polomocha/listings/active";
app.userInput = ""; //empty var for user to enter city

$(function() {
  app.init();
}); // doc ready ends here

app.init = () => {
  app.onSubmit();
};

//Listen for an onclick for the submit button
app.onSubmit = () => {
  $("#submitButton").on("click", function(e) {
    e.preventDefault();

    if ($("#city").val() !== "") {
      app.smoothScroll();
      app.handleSubmit();
      app.generateButton();
    } else {
      app.emptyInput();
    }
  });
};

//If there is error, sweetalert is presented. If there is no error, start retrieving API
app.handleSubmit = () => {
  app.getValueOfUserInput();
  //displayWeather will show the API data according to userInput to DOM
  $(".displayWeather").val("");
};

app.smoothScroll = function() {
  $("html, body").animate(
    {
      scrollTop: $(".displayWeather").offset().top
    },
    4000
  );
};
// generate button is hidden on page load, show button on submit
app.generateButton = function() {
  setTimeout(() => {
  $("#generate").show();
  $(".displayOutfit p").show();
  }, 5000);
  app.generateClick();
};
//Listen for click to refresh, and reload new clothing.
app.generateClick = () => {
  $("#generate").on("click", function(e) {
    e.preventDefault();
    app.handleSubmit();
    console.log("hi");
  });
};

//obtaining data from weather API
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
    //once data is received, display weather to DOM
    app.displayWeather(response);
    // get temperature from response
    let temperature = response.current.temp_c;
    //call app.getEtsyParams and pass it the temperature from weather API
    app.getEtsyParams(temperature);
    app.smoothScroll();
  });
}; //app.getWeather ends here

app.weatherArray = [];
app.displayWeather = function(data) {
  app.weatherArray.pop(); //remove content from weatherArray on each call to API (on additional submit)
  app.weatherArray.push(data);
  app.currentConditions = app.weatherArray.map(function(current) {
    return `
            <div class="weatherDetails" >
                <h2 class="weatherSentence">In ${
                  current.location.name
                }, the weather is ${current.current.condition.text} with current temperature of ${current.current.temp_c}, but it feels like ${current.current.feelslike_c} degrees celcius</h2>
            </div>`;
  });

  $(".displayWeather").html("");
  $(".displayWeather").html(app.currentConditions);
}; //app.displayWeather ends here

//error handling, if user does not input city
app.emptyInput = function() {
  if ($("#city").val() === "") {
    Swal.fire({
      title: "Error!",
      text: "Enter city",
      type: "error",
      confirmButtonText: "OK"
    });
  }
}; //app.emptyInput ends here

//app.getValue gets the value of the users input, sends it to app.getWeather
app.getValueOfUserInput = function() {
  app.location = $("#city").val();
  app.getWeather(app.location);
};

//once receive temperature, it will compare it with 0
//if above 0'C, return Etsy A (Tshirt,Short Pants)
//if below 0'C, return Etsy B (jacket,  Pants)
app.getEtsyParams = temperature => {
  let aboveZeroWear = ["tshirt", "shorts"];
  let belowZeroWear = ["sweater", "pants"];
  if (temperature > 0) {
    app.callEtsyApiTwice(aboveZeroWear);
  } else {
    app.callEtsyApiTwice(belowZeroWear);
  }
};

//receive paramater (temperature) from app.getEtsyParams to call the etsy API twice
app.callEtsyApiTwice = param => {
  let etsyQuery = param.map(query => {
    console.log("query: ", query);
    return app.getEtsy(query);
  });
  $.when(...etsyQuery).then((...args) => {
    let argItem = args.map((item, index) => {
      console.log(item);
      const i = Math.floor(Math.random() * item[0].results.length);
      return item[0].results[i].MainImage.url_fullxfull;
    });
    console.log(argItem);
    app.displayEtsy(argItem); //
  });
}; //callEtsyApiTwice ends here

app.displayEtsy = item => {
  let itemDisplay = item.map((item, index) => {
    console.log(item);
    return `<img src="${item}" id="clothing-${index} ">`;
  });

  $(".displayOutfits").html("");
  $(".displayOutfits").append(itemDisplay);
};

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
        tags: item,
        includes: "MainImage"
      }
    }
  });
};

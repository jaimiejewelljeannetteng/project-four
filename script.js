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
  $("#submitButton").on("click", function() {
    app.handleSubmit();
    app.generateButton();
  });
};

//If there is error, sweetalert is presented. If there is no error, start retrieving API
app.handleSubmit = () => {
  app.handleEmptyInput();
  app.getValueOfUserInput();
  //displayWeather will show the API data according to userInput to DOM
  $(".displayWeather").val("");
};

// generate button is hidden on page load, show button on submit
app.generateButton = function() {
  if ($("#city").val() !== "") {
    $("#generate").show();
    $(".displayOutfit p").show();
    app.generateClick();
  }
};

//Listen for click to refresh, and reload new clothing.
app.generateClick = () => {
  $("#generate").on("click", function(e) {
    e.preventDefault();
    app.handleSubmit();
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
  $(".displayWeather").html(app.currentConditions)
  $.when()
  
}; //app.displayWeather ends here


app.smoothScroll = function () {
  $("#submitButton").on("click", function () {
    $("html, body").animate(
      {
        scrollTop: $(".displayWeather").offset().top
      },
      1000
    );
  });
};

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

app.handleEmptyInput = function() {
  $("#submitButton").on("click", function(e) {
    e.preventDefault();
    app.emptyInput();
  });
}; //event handler for on submit, specific to on submit  *** i think we need to rejig init and move the call app.callEtsyApiTwice outside of init, to make it global and then call it in init. is this proper name spaceing? question for helpcue ***

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
app.imageArray = [];

//receive paramater (temperature) from app.getEtsyParams to call the etsy API twice
app.callEtsyApiTwice = param => {
  let etsyQuery = param.map(query => {
    return app.getEtsy(query);
  });
  $.when(...etsyQuery).then((...args) => {
    let argItem = args.map((item, index) => {
      const i = Math.floor(Math.random() * item[0].results.length);
      app.imageArray.push(item[0].results[i].MainImage.url_fullxfull)
      // return item[0].results[i].MainImage.url_fullxfull;
    })
    
    // display images once there are two in the array
    if(app.imageArray.length === 2){
      app.displayEtsy(app.imageArray); 
      app.smoothScroll();
    }

  })
}; //callEtsyApiTwice ends here


app.displayEtsy = item => {
  let itemDisplay = item.map((item, index) => {
    return `<img src="${item}" id="clothing-${index} ">`;
  });

  $(".displayOutfits").html("");
  $(".displayOutfits").append(itemDisplay)
  $("clothing-0").fadeIn("slow")
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
        keywords: item,
        includes: "MainImage"
      }
    }
  });
};

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

app.smoothScroll = () => {
  $("html, body")
    .delay(3000)
    .animate(
      {
        scrollTop: $(".displayWeather").offset().top
      },
      1000
    );
};
//Listen for an onclick for the submit button
app.onSubmit = () => {
  $("#submitButton").on("click", function(e) {
    e.preventDefault();
    //Error handling: call app.emptyInput (sweet alert) if user input is blank, otherwise call user input, show generate button & disclaimer
    if ($("#city").val() !== "") {
      app.handleSubmit();
      app.generateButton();
    } else {
      app.emptyInput();
    }
  });
};
//app.getValueOfUserInput gets the value of the users input, sends it to app.getWeather
app.getValueOfUserInput = () => {
  app.location = $("#city").val();
  app.getWeather(app.location);
};

app.handleSubmit = () => {
  app.getValueOfUserInput();
  //displayWeather will show the API data according to userInput to DOM
  $(".displayWeather").val("");
};
// generate button is hidden on page load, show button on submit
app.generateButton = () => {
  setTimeout(() => {
    $("#generate").show();
    $(".disclaimer").show();
  }, 3000);
  app.generateClick();
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
    app.smoothScroll();
  });
}; //app.getWeather ends here

app.weatherArray = [];
app.displayWeather = data => {
  app.weatherArray.pop(); //remove content from weatherArray on each call to API (on additional submit)
  app.weatherArray.push(data);
  app.currentConditions = app.weatherArray.map(function(current) {
    let getCurrentConditionText = current.current.condition.text;
    let currentConditionText = getCurrentConditionText.toLowerCase();
    return `
            <div class="weatherDetails" >
                <h2 class="weatherSentence">In <span>${
                  current.location.name
                }</span>, the weather is ${currentConditionText} with current temperature of ${current.current.temp_c}, but it feels like ${current.current.feelslike_c} degrees celcius. Checkout your outfit below:</h2>
            </div>`;
  }); //app.currentConditions ends here

  $(".displayWeather").html("");
  $(".displayWeather").html(app.currentConditions);
}; //app.displayWeather ends here

//error handling, if user does not input city
app.emptyInput = () => {
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
app.getValueOfUserInput = () => {
  app.location = $("#city").val();
  app.getWeather(app.location);
};

//once receive temperature, it will compare it with 10
//if above 10'C, return Etsy A (tshirt", "vest", jackets", "shorts")
//if below 10'C, return Etsy B ("sweater", "blouse", "pants")
app.getEtsyParams = temperature => {
  let springTopSelection = ["tshirt", "vest", "jackets"];
  let springTopRandomIndex = Math.floor(
    Math.random() * springTopSelection.length
  );
  let springTopSelected = springTopSelection[springTopRandomIndex];
  let springBottomSelected = "shorts";

  let winterTopSelection = ["sweater", "blouse"];
  let winterTopRandomIndex = Math.floor(
    Math.random() * winterTopSelection.length
  );
  let winterTopSelected = winterTopSelection[winterTopRandomIndex];
  let winterBottomSelection = "pants";

  let springWear = [springTopSelected, springBottomSelected];

  let winterWear = [winterTopSelected, winterBottomSelection];

  if (temperature > 10) {
    app.callEtsyApiTwice(springWear);
  } else {
    app.callEtsyApiTwice(winterWear);
  }
}; //app.getEtsyParams ends here

//receive paramater (temperature) from app.getEtsyParams to call the etsy API twice
app.callEtsyApiTwice = param => {
  let etsyQuery = param.map(query => {
    return app.getEtsy(query);
  });
  $.when(...etsyQuery).then((...args) => {
    let argItem = args.map((item, index) => {
      const i = Math.floor(Math.random() * item[0].results.length);
      let etsyImage = item[0].results[i].MainImage.url_fullxfull;
      let etsyTitle = item[0].results[i].title;
      let etsyUrl = item[0].results[i].url;
      let getEtsyInfo = { etsyImage, etsyTitle, etsyUrl };
      return getEtsyInfo;
    });

    app.displayEtsy(argItem);
  });
}; //callEtsyApiTwice ends here

app.displayEtsy = items => {
  let itemDisplay = items.reduce(
    (html, { etsyImage, etsyTitle, etsyUrl }, index) => {
      let image = `<img src="${etsyImage}" id="clothing-${index}-item " alt="${etsyTitle}">`;
      let itemUrl = `<a href="${etsyUrl}"><div class="overlay"><p>Click to Shop</p></div>${image}</a>`;
      return html + itemUrl;
    },
    ""
  );
  $(".displayOutfits").html("");
  $(".displayOutfits")
    .append(itemDisplay)
    .hide()
    .delay(1000)
    .fadeIn();
};

//call to etsy using proxy server
app.getEtsy = item => {
  return $.ajax({
    url: "https://proxy.hackeryou.com",
    method: "GET",
    dataType: "json",
    data: {
      reqUrl: app.apiUrlEtsy,
      params: {
        api_key: app.apiKeyEtsy,
        category: "clothing/women/" + item,
        includes: "MainImage"
      }
    }
  });
};

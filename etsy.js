const app = {};

app.apiKeyEtsy = "rkcrycwnyei9ana141cxdioh";
app.apiUrlEtsy = "https://openapi.etsy.com/v2/shops/polomocha/listings/active";

app.init = () => {
  //attain api
  //onclick function for the input submit
  $("form").on("submit", function() {
    //When submitted, the value will get info from Weather & Etsy then show info on DOM

    //get the value of input
    //async scroll down to show weather 

    //query to getWeather, await response because all subsequent
    //logic depends on its result
    const weather = await app.getWeather(location);

    // get temperature from response
    const temperature = weather.temperature;

    // compare temperature. If temperature>0, return etsyA(includes jacket). If temperature<0, return etsyB (includes coat)
    
    const params = app.getEtsyParams(temperature);
    //once receive temperature, it will compare it with 0
    //if above 0'C, return Etsy A (Tshirt,Short Pants)
    //if below 0'C, return Etsy B (coat, Long Pants)
    //return top/bottom properties {top:shirt,bottom:pants}



    //call api twice with top/bottom then return to DOM. 
  });
};


//query the returned compareTemperature.
// Etsy A argument will be used as keyword on getEtsy.
//returned is then shown on the DOM
app.getEtsy = (query) => {
  //proxy
  $.ajax({
    url: app.apiUrlEtsy,
    method: "GET",
    dataType: "json",
    data: {
      api_key: app.apiKeyEtsy,
      keyword: query
    }
  }).then(function(response) {
    console.log(response);
  });
  //receive object
};


$('#generate').on('click', function(){
  //call api twice with top/bottom then return to DOM. 

})

$(function() {
  app.init();
});

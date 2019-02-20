const app = {};
app.apiKeyWeather = '8f6dab90acf14f9da11221736191902'
app.apiUrlWeather = 'http://api.apixu.com/v1/current.json'

app.init = function () {
    app.getWeather(); //calling ajax request
}

app.getWeather = function (toronto) {
    $.ajax({
        url: app.apiUrlWeather,
        method: 'GET',
        dataType: 'json',
        data: {
            key: app.apiKeyWeather
            q: 'toronto'
        }
    }).then(function (response) { 
        console.log(response)
    });
}


$(function () {
    app.init();
})

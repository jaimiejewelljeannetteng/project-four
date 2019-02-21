const app = {};
app.apiKeyWeather = '8f6dab90acf14f9da11221736191902';
app.apiUrlWeather = 'http://api.apixu.com/v1/current.json';

app.init = () => {
    app.getWeather(); //calling ajax request
} //app.init ends here

app.getWeather = (toronto) => {
    $.ajax({
        url: app.apiUrlWeather,
        method: 'GET',
        dataType: 'json',
        data: {
            key: app.apiKeyWeather,
            q: 'toronto'
        }
    }).then(function (response) { 
        // console.log(response.current)
        console.log(response.current.feelslike_c)
        console.log(response.current.condition.icon)
        console.log(response.current.condition.text)
    });
} //app.getWeather ends here

$(function () {
    app.init();
}) // doc ready ends here

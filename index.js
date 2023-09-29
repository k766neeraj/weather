const API_key = "3417f5d371ea80d54def13475560ea03";
const cityInput = document.getElementById("cityInput")
const search = document.getElementById("searchbtn")
const weathercard = document.querySelector(".fivedays")
const currentweather = document.querySelector(".weather-data")
const toggle = document.getElementById('toggle');

// Convert from Fahrenheit to Celsius
function fahrenheitToCelsius(fahrenheit) {
    return (fahrenheit - 32) / 1.8;
  }
// Convert from Celsius to Fahrenheit
function celsiusToFahrenheit(celsius) {
    return (celsius * 1.8) + 32;
}
// An event listener which function when a checkbutton is clicked
toggle.addEventListener('change', function() {
    if (toggle.checked) {
        // Toggle is checked (ON), do something when ON
        let data = document.getElementsByClassName('convert-item')[0]
        data.innerHTML = 'Convert to Fahrenheit and Celsius'
        // object of the temperature cards
        a=document.getElementsByClassName('chan')
        // Converting Each weather card
        for (let ind = 0; ind < a.length; ind++) {
            temp = a[ind].innerText.split(':')[1]
            let val = celsiusToFahrenheit(Number(temp))
            a[ind].innerHTML=`Temp:${val}`
            
        } 
        console.log('Toggle is ON');

    } else {
        // Toggle is not checked (OFF), do something when OFF
        let data = document.getElementsByClassName('convert-item')[0]
        data.innerHTML = 'Convert to Celsius and Fahrenheit'
        // object of the temperature of cards
        a=document.getElementsByClassName('chan')
        // Converting Each weather card
        for (let ind = 0; ind < a.length; ind++) {
            temp = a[ind].innerText.split(':')[1]
            let val = fahrenheitToCelsius(Number(temp))
            a[ind].innerHTML=`Temp:${val}`
            
        } 
        console.log('Toggle is OFF');
    }
});
// This is to insert the card of weather forecast in the HTML
const createCard = (cityname,item,index) => {
    if(index==0){
        return ` <div class="current-weather">
                 <div class="details">
                 <h2>${cityname}(${item.dt_txt.split(' ')[0]})</h2>
                 <h4 class="chan">Temp:${item.main.temp}</h4>
                 <h4>Wind:${item.wind.speed}</h4>
                 <h4>Humidity:${item.main.humidity}%</h4>
                 </div>
                 <div class="icon">
                 <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="weathet-icon">
                 <h4>${item.weather[0].description}</h4>
                 </div>
                 </div>`;
    }
    else{

        return `<div class="current-weather">
                     <div class="details">
                    <h2>${item.dt_txt.split(' ')[0]}</h2>
                    <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="weathet-icon">
                    <h4 class="chan">Temp:${item.main.temp}</h4>
                    <h4>Wind:${item.wind.speed}</h4>
                    <h4>Humidity:${item.main.humidity}%</h4>
                </div>
                </div>`
    }
}
// to get the weather from the API request
const getWeatherDetails = (cityname, lat, lon) => {

    const weather_url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`;
    fetch(weather_url).then(res => res.json()).then(data => {

        const uniqueForecast = [];
        const fivedays = data.list.filter(forecast => {
            const date = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecast.includes(date)) {
                return uniqueForecast.push(date)
            }
        })
    
        // Removing the previous vlue
        cityInput.value=""
        weathercard.innerHTML=""
        currentweather.innerHTML=""
        //  now creating each day weather foracast card
        fivedays.forEach((item,index)=> {
            if (index==0){
                currentweather.insertAdjacentHTML("beforeend",createCard(cityname,item,index));
            }
            else{
                weathercard.insertAdjacentHTML("beforeend",createCard(cityname,item,index));
            }
        })
    }).catch(() => {
        alert("An Error Occured while fetching the weather forcast");
    });
}

// to get the country from the API request
const getCity = () => {
    // Get the city name from the user
    const cityname = cityInput.value.trim();
    // If city is empty show alert
    if (!cityname) {
        return alert("City is Empty");
    }
    // api url to fetch the dta from weather api 
    const geourl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityname}&limit=1&appid=${API_key}`
    // fetching name,latitude and longitude of the entered city 
    fetch(geourl).then(res => res.json()).then(data => {
        if (!data.length) return alert(`No Coordinated found for the ${cityname}`)
        const { lat, lon, name } = data[0];
        getWeatherDetails(name, lat, lon)
    }).catch(() => {
        alert("An Error Occured while fetching the country");
    });
}
//It is an event function when search button is clickedd
search.addEventListener('click', getCity)
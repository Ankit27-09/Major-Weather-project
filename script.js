let temperature = document.querySelector('.temp');
const weather = document.querySelector('.weather');
let feellike = document.querySelector('.feel');
const visibilityIndex = document.querySelector('.visibility');
const precipitation = document.querySelector('.precipitation');
const humidity = document.querySelector('.humidity');
const searchBox = document.querySelector('.search-input');
const SearchButton = document.querySelector('.searchButton');
let fullHourly = document.querySelector('.full-hourly');
let fulldaily = document.querySelector('.full-daily');
let uvrange = document.querySelector('.uv-range');
let uvcondition = document.querySelector('.uv-condition');
let windMPH = document.querySelector('.wind-mph');
let gustsMPH = document.querySelector('.gusts-mph');
let sliderRange = document.querySelector('.slider');
let cityName = document.querySelector('.city-name');
let cityTime = document.querySelector('.time');
let animateWeather = document.querySelector('.animate-weather-condition');

// trial
let farheneitButton = document.querySelector('.change-to-farheneit');

searchBox.addEventListener("click",() => {
    searchBox.removeAttribute("placeholder");
})




SearchButton.addEventListener('click', () => {
     checkWeather(searchBox.value);
     if(searchBox.value){
      while(fullHourly.hasChildNodes()){
        fullHourly.removeChild(fullHourly.firstChild)
     }
     while(fulldaily.hasChildNodes()){
        fulldaily.removeChild(fulldaily.firstChild)
     }
    }
    searchBox.value = "";
})




async function checkWeather(city) {
    const apiKey = '3350b63f31a60b9c139d8bc8f4f3c707';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    const response = await fetch(apiUrl);
    const data = await response.json();
    cityTime.innerText = moment(Date.now()).tz(moment.tz.zonesForCountry(data.sys.country, true)[0].name).format('h:mm:ss A');
    if(parseInt(cityTime.innerText) > 12 && parseInt(cityTime.innerText) < 24 ) {
      setInterval(()=> {
         cityTime.innerText = moment(Date.now()).tz(moment.tz.zonesForCountry(data.sys.country, true)[0].name).format('h:mm:ss A');
       },1000);
    }

    else if(parseInt(cityTime.innerText) >= 0 && parseInt(cityTime.innerText) <=12 ) {
      setInterval(()=> {
         cityTime.innerText = moment(Date.now()).tz(moment.tz.zonesForCountry(data.sys.country, true)[0].name).format('H:mm:ss') + " " + "AM" ;
       },1000);

    }
    
    

    console.log(moment(Date.now()).tz(moment.tz.zonesForCountry(data.sys.country, true)[0].name).format('H:M:S'))
    temperature.innerText = Math.round(data.main.temp) + "°C";
    weather.innerText = data.weather[0].description;
    feellike.innerText = Math.round(data.main.feels_like) + "°C";
    visibilityIndex.innerText = data.visibility/1000 + " " +  "mi";
    humidity.innerText = data.main.humidity + "%"; 
    const hourlyUrl = `http://api.weatherapi.com/v1/forecast.json?key=44b591a4dccc489dad8191930241105&q=${city}&days=1&aqi=no&alerts=no`;
    const hrlyresponse = await fetch(hourlyUrl);
    const hourlydata = await hrlyresponse.json();

    precipitation.innerText = hourlydata.current.precip_mm + "''";

    cityName.innerText = data.name;
    farheneitButton.addEventListener("click",() => {
      temperature.innerText = Math.round(data.main.temp*9/5) + 32 + " " +  "F";
   })
    
    hourlydata.forecast.forecastday[0].hour.map((data,index)=>{
      

        let hourlydetails = document.createElement('div');
        hourlydetails.classList.add('hourly-details');
        if(index ==0){
         hourlydetails.classList.add('current')
      }
        let hourlyDescription = document.createElement('p');
        hourlyDescription.classList.add('hourly-desc');
        hourlydetails.appendChild(hourlyDescription);
        let hourlyTemperature = document.createElement('h2');
        hourlyTemperature.classList.add('hourly-temp');
        hourlydetails.appendChild(hourlyTemperature);
        let hourlyImage = document.createElement('img');
        hourlyImage.classList.add('hourly-img');
        hourlydetails.appendChild(hourlyImage);
        fullHourly.appendChild(hourlydetails);
        hourlyDescription.innerText = moment(data.time).format('LT');
        hourlyTemperature.innerText = Math.round(data.temp_c) + "°C";
        hourlyImage.src = data.condition.icon;

        if(data.text == "partly Cloudy") {
         animateWeather.src = "./Animations/partly clouds"
        }

        farheneitButton.addEventListener("click",() => {
         hourlyTemperature.innerText = Math.round(data.temp_f*9/5) + 32 + " " +  "F";
      })
    })
    
    let dailyUrl = `http://api.weatherapi.com/v1/forecast.json?key=44b591a4dccc489dad8191930241105&q=${city}&days=10&aqi=no&alerts=no`;
    let dailyresponse = await fetch(dailyUrl);
    let dailydata = await dailyresponse.json();

    
    dailydata.forecast.forecastday.map((data2,index)=> {

    let dailydetails = document.createElement('div');
    dailydetails.classList.add('daily-details');
    if(index == 0){
      dailydetails.classList.add('current')
   }
    let dailydesc = document.createElement('p');
    dailydesc.classList.add('daily-desc');
    dailydetails.appendChild(dailydesc);
    let dailyTemperature = document.createElement('h2');
    dailyTemperature.classList.add('daily-temp');
    dailydetails.appendChild(dailyTemperature);
    let dailyImage = document.createElement('img');
    dailyImage.classList.add('daily-img');
    dailydetails.appendChild(dailyImage);
    fulldaily.appendChild(dailydetails);
    dailydesc.innerText = moment(data2.date).format('LL'); 
    dailyTemperature.innerText = Math.round(data2.day.maxtemp_c) + "°C" ;
    dailyImage.src = data2.day.condition.icon;
    farheneitButton.addEventListener("click",() => {
      dailyTemperature.innerText = Math.round(data2.day.avgtemp_f) + "F";
    })

})
   dailydata.forecast.forecastday[0].hour.filter((ele)=>moment(ele.time).format('H')==moment(Date.now()).tz(dailydata.location.tz_id).format('H')).map((ele)=> {
      console.log(ele)
      uvrange.innerText = ele.uv;
      sliderRange.value = ele.uv
      windMPH.innerText = ele.wind_mph;
      gustsMPH.innerHTML = ele.gust_mph + "gusts" ;
      // console.log(moment(Date.now()).format('H'))
      // console.log(moment(ele.time).format('H'))
  
   })
}

function recordData (data) {
   console.log(data.ip, data.city)
   checkWeather(data.city);
}



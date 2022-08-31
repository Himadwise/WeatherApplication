const apiKey ='r3Xv6BC4NgMDD9t20mCPVA81EbuhakIH';
const listCard =document.querySelector(".list-card")
const list =document.querySelector(".list")
const searchCity =document.querySelector("#searchCity")
const cityName =document.querySelector("#cityName")
const weatherText =document.querySelector("#weatherText")
const degree =document.querySelector("#degree")
const imageTime =document.querySelector("#imageTime")




const getCityName =async (city)=>{
    let url ='http://dataservice.accuweather.com/locations/v1/cities/autocomplete';
    let query = `?apikey=${apiKey} &q=${city}`;

    const repsonse =await fetch(url+query);
    const data =await repsonse.json();
    return data;
}

searchCity.addEventListener('keyup', (e)=>{
    let respond=e.target.value;
    
    if (respond.length===0){
        listCard.classList.add("d-none")
    }
    else{
        list.innerHTML='';
        getCityName(respond.trim().toLowerCase())
        .then( data =>{
            data.forEach( cities =>{
                // console.log(cities)
                list.innerHTML+=`<h4 class ="target_class">${cities.LocalizedName}</h4>`
                listCard.classList.remove('d-none')
            })
        }).catch((error)=>{console.log(error)})
        }
    
})
list.addEventListener('click',(event)=>{
    updateToUi(event.target.innerText.toLowerCase())
})

const getCityCode= async (city)=>{
    let url ='http://dataservice.accuweather.com/locations/v1/cities/search';
    let query = `?apikey=${apiKey} &q=${city}`;

    const repsonse =await fetch(url+query);
    const data =await repsonse.json();
    return data[0];
}
const updateToUi =(city)=>{
    getCityCode(city).then( data =>{
        console.log(data)
        cityName.innerHTML =`${data.LocalizedName}, ${data.Country.LocalizedName}`;

        searchCity.value ='';
        return getWeatherInfo(data.Key)
    }).then( data =>{
        console.log(data)
        weatherText.innerText =`${data.WeatherText}`;
        degree.innerText =`${data.Temperature.Metric.Value}  ℃`;

        if(data.IsDayTime){
            imageTime.setAttribute('src','./assets/day.jpg')
        }else{
            imageTime.setAttribute('src','./assets/night.jpg')
        }
    localStorage.setItem('city', city)
    })
    listCard.classList.add('d-none')
}

const getWeatherInfo =async(cityCode)=>{
    let url ='http://dataservice.accuweather.com/currentconditions/v1/';
    let query = `${cityCode}?apikey=${apiKey}`;

    const repsonse =await fetch(url+query);
    const data =await repsonse.json();

    // console.log(data[0])
    return data[0];
}

if(localStorage.getItem('city').length>0){
    updateToUi(localStorage.getItem('city'));
}
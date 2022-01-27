const geoNamesURL = 'http://api.geonames.org/searchJSON?name=';
const weatherURL = 'https://api.weatherbit.io/v2.0/current?';
const imageURL = 'https://pixabay.com/api/?key=';
const countryURL = 'https://restcountries.com/v2/alpha/';

const geoKey = '&maxRows=1&username=ceofvo';
const weatherKey = '1a1506f763c74da4a227f8c76a2614ad';
const imageKey = '25410713-2ef68d7d88ffa4acfe35da394';

let holdData = {};

/** Function to get data from Geonames. 
 * It takes the API url, key and travel destination as arguments
**/
let getGeoData = async (geoNamesURL, travelDest, geoKey)=>{
    const response = await fetch(`${geoNamesURL}${travelDest}${geoKey}`);
    try {
        const data = await response.json();
        holdData.lat = data.geonames[0].lat;
        holdData.long = data.geonames[0].lng;
        holdData.country = data.geonames[0].countryName;
        holdData.place = data.geonames[0].name;
        holdData.countrycode = data.geonames[0].countryCode;
        return data;
    } catch (error) {
        console.log("Error getting data from geonames", error);
    }
}

/** Function to get weather data from weatherbit. 
 * It takes the API url, key, latitude and longitude as arguments
**/
let getWeatherData = async (weatherURL, weatherKey, lati, long)=>{
    const response = await fetch(`${weatherURL}lat=${lati}&lon=${long}&key=${weatherKey}&include=minutely`);
    try {
        const result = await response.json();
        holdData.temp  = result.data[0].temp;
        holdData.weathericon  = result.data[0].weather.icon;
        holdData.weatherdesc = result.data[0].weather.description;
        return result;
    } catch (error) {
        console.log("Error getting weather data", error)
    }
}

/** Function to get image from pixabay. 
 * It takes the API url, key and travel destination as arguments
**/
let getImage = async (imageURL, imageKey, travelDest)=>{
    const response = await fetch(`${imageURL}${imageKey}&q=${travelDest}&image_type=photo`);
    console.log(`${imageURL}${imageKey}&q=${travelDest}&image_type=photo`)
    
    // if(response.hits[0] == ""){
    //     console.log("No image")
    // }
    try {
        const result = await response.json();
        console.log(result)
        if(result.total === 0){
            console.log("No image")
            holdData.imageurl = '../src/client/images/no-image-found.png';
        } else {
            holdData.imageurl = result.hits[0].largeImageURL;
        }        
        return result;
    } catch (error) {
        console.log("Error getting image from pixabay: ", error);
    }
}

//Function to get country data it takes the API url and country code as arguments
let getCountryData = async (countryURL, countrycode)=>{
    const response = await fetch(`${countryURL}${countrycode}`);
    try {
        const result = await response.json();
        holdData.currency = result.currencies[0].name;
        holdData.language = result.languages[0].name
        holdData.flag = result.flags.png
        return result;
    } catch(error) {
        console.log("Error getting country data: ", error);
    }
}

//Function to post data to the server it takes the url and data as arguments
const postData = async (url, data)=>{
    const response = await fetch(url, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(data)
    });

    try {
      const newData = await response.json();
      return newData;
    } catch(error) {
      console.log("Error posting data: ", error);
    }
}

//Function to update UI with details retrived from server
const updateUI = async () => {
    const request = await fetch('/all');
  
    try{
      const allData = await request.json();

      document.querySelector('.det-img').innerHTML = `<img src='${allData.imageurl}' alt='${allData.place}'>`;
      document.querySelector('.det-intro').innerHTML = `<h4>My Trip to ${allData.place}, ${allData.country} is ${allData.due} days away!</h4>` ;
      document.querySelector('.det-dep').innerHTML = `Departure Date: ${allData.date}`;
      document.querySelector('.det-weather').innerHTML = `<p>Typical weather for then is </p> 
      Temp: ${allData.temp} C
      <div><img src='https://www.weatherbit.io/static/img/icons/${allData.weathericon}.png' alt='${allData.weatherdesc}'></div> ${allData.weatherdesc}`;
      document.querySelector('.det-facts').innerHTML = `
      <h4>Fun Facts About ${allData.country}</h4>
      <span><strong>Currency: </strong> ${allData.currency}</span>
      <span><strong>Language: </strong> ${allData.language}</span>
      <span><strong>Country Flag: </strong> <img src='${allData.flag}' alt='${allData.country} flag'></span>`;
      document.querySelector('#dest').value = "";
      document.querySelector('#date').value = "";
    
    }catch(error){
      console.log("Error updating UI: ", error);
    }
  }

//Function to process the request by calling relevant functions asyncronosly and chaining them
let processRequest =(event)=> {
    event.preventDefault();
    const travelDest =  document.querySelector('#dest').value;
    const travelDate =  document.querySelector('#date').value;

    let when = new Date(travelDate);
    let now =  new Date();

    const timeDiff = Math.abs(when - now);
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); 

    const optionsDate = {year: 'numeric', month: 'long', day: 'numeric'};
    const newDate = new Intl.DateTimeFormat('en-US', optionsDate).format(when);

    holdData.due = daysDiff;
    holdData.date = newDate;
  
    getGeoData(geoNamesURL, travelDest, geoKey)
    .then((data)=>{
      return getWeatherData(weatherURL, weatherKey, data.geonames[0].lat, data.geonames[0].lng); 
    })
    .then(()=>{
        return getImage(imageURL, imageKey, holdData.place);
      })
    .then(
    ()=>{
        return getCountryData(countryURL, holdData.countrycode)
    })
    .then(()=>{
        return postData('add', holdData );
    })
    .then(()=>{
            updateUI()           
    })
  }

export { processRequest }
let projectData  = {}

// Require Express to run server and routes
const express = require('express')
const app = express()

const path = require('path')

//Configure to use environment variable for API keys 
const dotenv = require('dotenv')
dotenv.config()


/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

app.use(express.static('dist'))

//console.log(__dirname)

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
    //res.sendFile(path.resolve('src/client/views/index.html'))
})

// designates what port the app will listen to for incoming requests
const port = process.env.PORT || 8081

const server = app.listen(port, ()=>{
    console.log(`Travel app server running on port: ${port}`);
});

app.get('/key', function (req, res) {
    let data = {key : "Nice Key"}
    //data.key = process.env.API_KEY
    res.send(data)
})

// POST route
let addData = (request, response)=> {
    projectData.due = request.body.due
    projectData.date = request.body.date
    projectData.currency = request.body.currency
    projectData.language = request.body.language   
    projectData.flag = request.body.flag
    projectData.imageurl = request.body.imageurl
    projectData.country = request.body.country
    projectData.place = request.body.place
    projectData.temp = request.body.temp
    projectData.weathericon = request.body.weathericon
    projectData.weatherdesc = request.body.weatherdesc
    response.send(projectData)
};
app.post('/add', addData);

// GET route
let sendData = (request, response)=> {
    response.send(projectData)
};
app.get('/all', sendData)


module.exports = {app}

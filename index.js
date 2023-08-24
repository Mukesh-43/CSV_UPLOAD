const express = require('express');
const path = require('path');
const port = 5000;
const app = express();
const db = require('./config/mongoose');
const expressEjsLayouts = require('express-ejs-layouts');


app.use(express.urlencoded({ extended: true })); // this is to use req.body
app.use(expressEjsLayouts); // this is to use layouts

// setting static files to assets
app.use(express.static("./assets"));

// setting the view engine as ejs
app.set('view engine','ejs');  
app.set('views','./views');

//extracting styles and scripts to layouts
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//we're connecting routes
app.use('/',require('./routes/index'));

app.listen(port,function(err){
    if(err){
        console.log(`Error in running the server:${err}`);
    }
    console.log(`Server is running in the port:${port}`);
})
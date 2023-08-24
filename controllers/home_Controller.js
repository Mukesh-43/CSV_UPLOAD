// requiring schema
const csvModelSchema = require('../models/file_Schema'); 
// requiring the File System(fs)
const fs = require('fs');
// this is for parsing csv files
const csvParser = require('csv-parser');

const path = require('path')

// function of our homePage
module.exports.home = async function(req, res){
    try{

        let csv_Files = await csvModelSchema.find({}); // finding all the files
        return res.render('home',{
            files : csv_Files,
            title: 'Home',
            })
    }catch(err){
        console.log(err);
        res.status(500).json( {message: 'Internal server error'} );
    }
    
}

// function to Upload CSV Files
module.exports.upload_File = async function(req, res){
    try{
        if(!req.file || req.file.mimetype !== 'text/csv'){ // check condition for wrong cases
            return res.status(400).send('Empty file / wrong format');
        }
        results = []; // creating an empty array
        fs.createReadStream(req.file.path).pipe(csvParser()).on('data',(data)=>{ // this allows us to open and read the file data
            results.push(data) // pushing the data to the result array
        }).on('end',async ()=>{
            if(req.file){
                let oldPath = req.file.path;
                let newPath = path.join(__dirname,'../files_to_upload',req.file.originalname);
                fs.rename(oldPath,newPath,(err)=>{
                    if(err){
                        throw err;
                    }
                });
                let csvFile = await csvModelSchema.create({ // creating new file in the schema
                    file: req.file.originalname,
                    header: results[0],
                    data: results.slice(1)
                })
                await csvFile.save();
                return res.redirect('/')
            }else{
                return res.status(400).send('Empty');
            }
        })
    }catch(err){
        console.log(err);
        res.status(500).json( {message: 'Internal server error'} );
    }
    
}

module.exports.view_File = async function(req,res){
    try{
        let csvFile = await csvModelSchema.findById(req.params.id); // finding the file in schema using id
        if(!csvFile){
            return res.status(404).send('File not found');
        }
        let uploadPath = path.join(__dirname,'../files_to_upload'); // setting the upload path
        let fileData = await new Promise((res,rej)=>{
            fs.readFile(path.join(uploadPath,csvFile.file),'utf8',(err,data)=>{ // reading the file
                if(err){
                    rej(err);
                }else{
                    let rows = data.trim().split('\n');
                    let headerRow = rows[0].split(',');
                    let dataRows = rows.slice(1).map(row => {
                        let finalData = {};
                        row.split(',').forEach((elem,index) => {
                            finalData[headerRow[index]]=elem
                        });
                        return finalData;
                    });
                    res({
                        file: csvFile.file,
                        header: headerRow,
                        data: dataRows 
                    });
                }
            })
        })
        res.render('file_page',{
            title: 'View_Page',
            fileData: fileData
        })


    }catch(err){
        console.log(err);
        res.status(500).json( {message: 'Internal server error'} );
    }
}
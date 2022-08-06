const dotenv = require('dotenv')
const fs = require('fs')
const Tour = require('./../../models/tourModel')
const mongoose = require('mongoose')
dotenv.config({path: './config.env'})
const DB = process.env.DATABASE
mongoose.connect(DB, {

}).then(con => {
  console.log(con.connections);
  console.log('DB connection succesful');
})

//Read JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

//Import Data into DB
const importData = async () => {

  try{
    await Tour.create(tours);
    console.log('Data succesfully loaded');
    process.exit();

  }

  catch(err) {
console.log(err);
  }

}

//Delete all Data from Collection

const deleteData = async() => {
  try{
    await Tour.deleteMany();
    console.log('Data succesfully deleted');
    process.exit();
  }
  catch(err) {
console.log(err);
  }
}

if(process.argv[2]==="--import") {
  importData();
} else if ( process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv)

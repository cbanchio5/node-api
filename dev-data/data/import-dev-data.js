const dotenv = require('dotenv')
const fs = require('fs')
const Tour = require('./../../models/tourModel')
const User = require('./../../models/userModel')
const Review = require('./../../models/reviewModel')
const mongoose = require('mongoose')
dotenv.config({path: './config.env'})
const DB = process.env.DATABASE
mongoose.connect(DB, {

}).then(con => {
  console.log(con.connections);
  console.log('DB connection succesful');
})

//Read JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

//Import Data into DB
const importData = async () => {

  try{
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave:false });
    await Review.create(reviews);
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
    await User .deleteMany();
    await Review.deleteMany();
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

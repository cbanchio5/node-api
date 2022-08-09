const dotenv = require('dotenv')
const mongoose = require('mongoose')
dotenv.config({path: './config.env'})
const DB = process.env.DATABASE
mongoose.connect(DB, {

}).then(con => {
  console.log(con.connections);
  console.log('DB connection succesful');
})


const app = require('./app')
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
})


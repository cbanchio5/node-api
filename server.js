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

process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  process.exit(1);
})
const server = app.listen(port, () => {
  console.log(`App is running on port ${port}`);
})

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);

  });

})

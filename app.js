const express = require('express');
const rateLimit = require('express-rate-limit')
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const helmet = require('helmet');


const app = express();



//middleware
//Set Security HTTP Headers
app.use(helmet());

//Development loggingy
console.log(process.env.NODE_ENV)
if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));

}
//Limit requests from same API
const limiter = rateLimit({
  max:100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour"
});

app.use('/api',limiter);

//Body Parser, reading data from body into req.body

app.use(express.json({ limit: '10kb'}));

//Serving static files

app.use(express.static(`${__dirname}/public`))

//Test Middleware
app.use((req, res, next) => {

  req.requestTime = new Date().toISOString();
  // console.log(req.headers)
  next();
})





app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status:'fail',
  //   message:`Can't find ${req.originalUrl} on this server`
  // });
  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.statusCode = 404;
  // err.status = 'fail';
  // next(err);
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
});

app.use(globalErrorHandler);

module.exports = app;

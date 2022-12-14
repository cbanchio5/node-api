const express = require('express');
const path = require('path')
const rateLimit = require('express-rate-limit')
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const viewRouter = require('./routes/viewRoutes')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean')
const hpp = require('hpp')
const cookieParser = require('cookie-parser')




const app = express();

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))



//middleware
//Set Security HTTP Headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'data:', 'blob:'],
      baseUri: ["'self'"],
      fontSrc: ["'self'", 'https:', 'data:'],
      // scriptSrc: ["'self'", 'https://*.cloudflare.com'],
      // scriptSrc: ["'self'", 'https://*.stripe.com'],
      scriptSrc: ["'self'", 'https://*.mapbox.com'],
      frameSrc: ["'self'", 'https://*.stripe.com'],
      objectSrc: ["'none'"],
      styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
      workerSrc: ["'self'", 'data:', 'blob:'],
      childSrc: ["'self'", 'blob:'],
      imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: ["'self'", 'blob:', 'https://*.mapbox.com'],
      upgradeInsecureRequests: [],
    },
  })
);


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
app.use(express.urlencoded({ extended:true, limit: '10kb' }))
app.use(cookieParser())

//Data Sanitization against NOSQL query Injection

app.use(mongoSanitize())


//Data Sanitization against XSS

app.use(xss())

app.use(hpp({
  whitelist: [
    'duration',
    'ratingAverage',
    'ratingQuantity',
    'maxGroupSize',
    'difficulty',
    'price'

  ]
}))



//Serving static files

// app.use(express.static(`${__dirname}/public`))
app.use(express.static(path.join(__dirname, 'public')))

//Test Middleware
app.use((req, res, next) => {

  req.requestTime = new Date().toISOString();
  console.log(req.cookies)
  // console.log(req.headers)
  next();
})



//Routes


app.use('/', viewRouter)
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

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

const AppError = require('./../utils/appError')


const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`
  return new AppError(message, 400);


}

const handeDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
  console.log(value)
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new AppError(message, 400);
}

const handeValidationErrorDB = err => {

  const error = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${error.join('. ')}`;
  return new AppError(message, 400);

}

const handleJWTError = () => {
  return new AppError('Invalid Token. Please log in again.', 401)
}

const handleJWTExpiredError = () => {
  return new AppError('Your token has expired, please log in again', 401)
}

const sendErrorDev = (err, req, res) => {
  //API error
  if(req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error:err
    });
    //Rendered error
  } else {
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    })
  }

}

const sendErrorProd = (err, req, res) => {
  //Operational Error
  //API ERROR
  if(req.originalUrl.startsWith('/api')){
    if(err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
      //Programming or other unknown error
    }
      console.error('ERROR 🛑')
       return res.status(500).json({
        status:'error',
        message:'Something went very wrong'
      })

  }
    //Rendered
    if(err.isOperational) {
      return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message
      })
      //Programming or other unknown error
    }
      console.error('ERROR 🛑')
      return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: 'Please try again later'
      })

}


module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';



  if(process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res)
  } else if (process.env.NODE_ENV === 'production') {
    console.log('Production')
    let error = { ...err };
    error.message = err.message
    if (err.name == 'CastError') error = handleCastErrorDB(err)
    if(err.code === 11000) error = handeDuplicateFieldsDB(err)
    if(err.name === 'ValidationError') error = handeValidationErrorDB(err)
    if(err.name === 'JsonWebTokenError') error = handleJWTError()
    if(err.name === 'TokenExpiredError') error = handleJWTExpiredError()

    sendErrorProd(error, req, res)
  }
}

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

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error:err
  });
}

const sendErrorProd = (err, res) => {
  //Operational Error
  if(err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
    //Programming or other unknown error
  } else {
    console.error('ERROR 🛑')
    res.status(500).json({
      status:'error',
      message:'Something went very wrong'
    })
  }

}


module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';



  if(process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res)
  } else if (process.env.NODE_ENV === 'production') {
    console.log('Production')
    let error = { ...err };
    if (err.name == 'CastError') error = handleCastErrorDB(err)
    if(err.code === 11000) error = handeDuplicateFieldsDB(err)
    if(err.name === 'ValidationError') error = handeValidationErrorDB(err)
    if(err.name === 'JsonWebTokenError') error = handleJWTError()
    if(err.name === 'TokenExpiredError') error = handleJWTExpiredError()

    sendErrorProd(error, res)
  }
}



const Tour = require('./../models/tourModel')

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));


// exports.checkID = (req, res, next, val) => {

//   console.log(`Tour id is ${val}`);
//   if (val * 1 > tours.length) {
//     return res.status(404).json({status:'failed', message: "Invalid ID"});
//   }

//   console.log("passed body check")
//   next();

// }

// exports.checkBody = (req, res, next) => {
//   console.log("Checking body");
//   if(!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status:'fail',
//       message:'Missing name or price'
//     });
//   }
//   next();

// }

exports.getALlTours = async (req, res) => {

  try {
    //Build the query
    const queryObjt = {...req.query}
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach(el => delete queryObjt[el]);

    let queryString = JSON.stringify(queryObjt)
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
    let query =  Tour.find(JSON.parse(queryString))

    //sorting
    if(req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    } else {
      query = query.sort('-createdAt')
    }

    //field limiting

    if(req.query.fields) {
      const fields = req.query.fields.split(',').join(' ')
      query = query.select(fields)
    } else {
      query = query.select('-__v')
    }
    //pagination
    const page = req.query.page *1 || 1
    const limit = req.query.limit * 1 || 100
    const skip = (page-1)*limit

    query = query.skip(skip).limit(limit)
    if(req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist')
    }

    //execute query
    const tours = await query;

    //send response
    res.status(200).json({
      status:'Sucess',
      results: tours.length,
      data: {
        tours
      }
      });
  }

  catch (err){
    res.status(404).json({
      status:'fail',
      message:err
      })
    }
  }

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status:'Sucess',
      data: {
        tour:newTour
      }
      });
  }

  catch (err){
    res.status(400).json({
      status:'fail',
      message:err
    })

  }


    }

exports.getTour = async (req, res) => {
    try{
        const tour = await Tour.findById(req.params.id)

        res.status(200).json({
          status:'success',
          data: {
            tour
          }
        })
    }

    catch(err){
      res.status(404).json({
        status:'fail',
        message:err
        })
    }
      }

exports.updateTour = async (req, res) => {

  try {

    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new:true,
      runValidators: true
    })

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    })

  }
    catch (err) {
      res.status(404).json({
        status:'fail',
        message:err
        })
        }
      }

exports.deleteTour = async (req, res) => {

  try {
    await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
      status: 'success',
      data: null
    })

  }
  catch(err){
    res.status(404).json({
      status:'fail',
      message:err
      })
  }
      }

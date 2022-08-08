const mongoose = require('mongoose')
const slugify = require('slugify')
const validator = require('validator')

const tourSchema = new mongoose.Schema({
  name:{
    type: String,
    required: [true, 'A tour must have a name'],
    unique:true,
    trim:true

  },
  slug:String,
  duration: {
    type:Number,
    required:[true, "A tour must have a durtion"]
  },
  maxGroupSize: {
    type:Number,
    required: [true, "A tour must have a group size"]
  },
  difficulty: {
    type: String,
    required:[true, 'A tour must have difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'The difficulty must be easy, medium or difficult'
    }
  },

  rating: {
    type:Number,
    default:4.5,
    min: [1.0, 'A rating must be above 1'],
    max:[5.0, 'A ratinv must be less than 5']
  },
  ratingAverage: {
    type:Number,
    default:4.5
  },
  ratingQuantity: {
    type:Number,
    default:0
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function(val) {
        //this only points to current doc on NEW document
        return val < this.price;
      },
      message:"Discount ({VALUE})is higher than the price"

  }
  },
  summary: {
    type:String,
    trim:true
  },
  description: {
    type:String,
    trim:true,
    required: [true, "A tour must have a description"]
  },
  imageCover: {
    type:String,
    required:[true, "A tour must have a cover image"]
  },
  images: [String],
  createdAt:{
    type:Date,
    default:Date.now(),
    select:false
  },

  price: {
    type:Number,
    required:[true, "A tour must have a price"]
  },
  secretTour:{
    type:Boolean,
    default:false

  },
  startDates: [Date]
  }, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
  });

  tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7;
  })

  //document middleware: runs before save command and create
  tourSchema.pre('save', function(next){
    this.slug= slugify(this.name, {lower:true});
    next();
  })

  // tourSchema.pre('save', function(next){
  //   console.log("Arribato ne")
  //   next();
  // })

  // tourSchema.post('save', function(doc, next){
  //   console.log(doc);
  //   next();
  // })

  //Query middleware
  tourSchema.pre(/^find/, function(next){
    this.find({secretTour:{$ne:true}})
    next();
  })

  tourSchema.post(/^find/, function(docs,next){

    next();
  });

  //aggregation middleware

  tourSchema.pre('aggregate', function(next){
    this.pipeline().unshift({$match: { secretTour:{$ne:true}}})
    next();
  });

  const Tour = mongoose.model('Tour', tourSchema);


  module.exports = Tour;

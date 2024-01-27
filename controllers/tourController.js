//const fs = require('fs');
const AppError = require('../utils/appError');
const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

exports.aliasTopTours = (req , res , next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAvarege,price';
    req.query.fields = 'name,price,ratingsAvarage,summary,difficulty';
    next();
}

//const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// MIDDLEWARE
/* exports.checkID = (req , res , next) => {
    //if(id > tours.length)
    //if(!tour)
    if(req.params.id * 1 > tours.length)
    {
        return res.status(404).json({
            status : 'fail',
            message : 'Invalid ID'
        });
    }

    next();
}; */

/* exports.checkBody = (req , res , next) => {
  
    if(!req.body.name || !req.body.price)
    {
       return res.status(400).json({
            status : 'fail',
            message : 'MIssing name or price'
       });
    }

    next();
}; */


// ROUTE HANDLERS
 exports.getAllTours = factory.getAll(Tour);
 
/*  catchAsync(async (req , res , next) => {
    //console.log(req.requestTime);
    //EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const tours = await features.query; 
    //query.sort().select().skip().limit()...

    res.status(200).json({
        status : 'success',
        requestedAt : req.requestTime,
        results : tours.length ,
        data : {
            tours
        } 
    });

});  */

exports.getTour = factory.getOne(Tour , {path : 'reviews'});

/* catchAsync(async (req , res , next) => {
    //console.log(req.params);

    //const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);

    res.status(200).json({
        status : 'success',
        data : {
            tour
        }
    }); 

    const tour = await Tour.findById(req.params.id).populate('reviews');
    //tour.findOne({_id: req.params.id})

    if(!tour){
      return next(new AppError('No tour found with that ID', 404));
    }

    res.status(200).json({
        status : 'success',
        data : {
           tour 
        }
    });

}); */

exports.createTour = factory.createOne(Tour);


/* catchAsync(async (req, res , next) => {
    //console.log(req.body);
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id : newId } , req.body);

    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json` , JSON.stringify(tours) , err => {
        //201 - created 
        res.status(201).json({
            status : 'success',
            data : {
                tour : newTour
            }
        });
    });  

    const newTour = new Tour({});
    newTour.save(); 

    const newTour = await Tour.create(req.body);

    res.status(201).json({
        status : 'success',
        data : {
          tour : newTour
        } 
    });

}); */

exports.updateTour = factory.updateOne(Tour);

/* exports.deleteTour = catchAsync(async (req , res) => {
    
  const tour = await Tour.findByIdAndDelete(req.params.id); 

  if(!tour)
  {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(204).json({
      status : 'success',
      data : null
  });

}); */

exports.deleteTour = factory.deleteOne(Tour);

//matching and grouping
exports.getTourStats = catchAsync(async (req , res , next) => {
  
      const stats = await Tour.aggregate([
          {
            $match : { ratingsAvarege : { $gte : 4.5 } }
          },
          {
            $group : {
              _id: { $toUpper: '$difficulty' },
              numTours: { $sum: 1 },
              numRatings: { $sum: '$ratingsQuantity' },
              avgRating: { $avg: '$ratingsAverage' },
              avgPrice: { $avg: '$price' },
              minPrice: { $min: '$price' },
              maxPrice: { $max: '$price' }
            }
          },
          {
            $sort: { avgPrice: 1 }
          }
      ]);

      res.status(200).json({
          status : 'success',
          data : {
             stats
          }
      });

});

//aggregation pipeline
exports.getMounthlyPlan = catchAsync(async (req , res , next) => {
  
      const year = req.params.year * 1; //2021
      const plan = await Tour.aggregate([
          {
              $unwind : '$startDates'
          },
          {
              $match : {
                  startDates : { 
                    $gte : new Date(`${year}-01-01`),
                    $lte : new Date(`${year}-12-31`)  
                  }
              }
          },
          {
              $group : {
                  _id : { $month : '$startDates' },
                  numTourStarts : { $sum : 1 },
                  tours : { $push : '$name' }
              }
          },
          {
              $addFields : {
                 month : '$_id'
              }
          },
          {
              $project : {
                  _id : 0
              }
          },
          {
            $sort : { numTourStarts : -1 }
          },
          {
            $limit : 12
          }
      ]);

      res.status(200).json({
        status : 'success',
        data : {
            plan
        }
      });
  
});

// ROUTES

/* app.get('/', (req , res) => {
    res.status(200).json({ message: 'Hello from the server side!' , app: 'Natours'});
});

app.post('/' , (req, res) => {
    res.send('You can post to this endpoint.');
}); */


/* app.get('/api/v1/tours' , getAllTours);
app.get('/api/v1/tours/:id' , getTour);
app.post('/api/v1/tours', createTour);
app.patch('/api/v1/tours/:id' , updateTour);
app.delete('/api/v1/tours/:id' , deleteTour); */

exports.getToursWithin = catchAsync(async (req , res , next) => {
    const {distance , latlng , unit } = req.params;

    const [lat, lng] = latlng.split(',');

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1; //radius of earth

    if(!lat || !lng)
    {
        next(new AppError('Please provide latitut and longitude in the format lat,lng.' , 400));
    }

    const tours = await Tour.find({ startLocation : { $geoWithin : { $centerSphere : [[lng , lat], radius] } } });

    res.status(200).json({
        status : 'success',
        result : tours.length,
        data : {
            data : tours
        }
    });
});
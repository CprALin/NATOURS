//const fs = require('fs');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFutures');

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
 exports.getAllTours = async (req , res) => {
    //console.log(req.requestTime);
  try 
  {
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
  }catch(err){
    res.status(400).json({
        status : 'fail',
        message : 'Empty'
    });
  } 
} 

exports.getTour = async (req , res) => {
    //console.log(req.params);

    //const id = req.params.id * 1;
   /*  const tour = tours.find(el => el.id === id);

    res.status(200).json({
        status : 'success',
        data : {
            tour
        }
    }); */

    try
    {
        const tour = await Tour.findById(req.params.id);
        //tour.findOne({_id: req.params.id})

        res.status(200).json({
            status : 'success',
            data : {
               tour 
            }
        });

    }catch(err){
        res.status(400).json({
            status : 'fail',
            message : 'Empty'
        });
    }

}

exports.createTour = async (req, res) => {
    //console.log(req.body);
  /*   const newId = tours[tours.length - 1].id + 1;
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
    });  */

    /* const newTour = new Tour({});
    newTour.save(); */
   try
   {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
        status : 'success',
        data : {
          tour : newTour
        } 
    });
   }catch(err){
        res.status(400).json({
           status : 'fail',
           message : 'Invalid data sent!'
        });
   } 
}

exports.updateTour = async (req , res) => {
  try
  { 
    
    const tour = await Tour.findByIdAndUpdate(req.params.id , req.body , {
        new : true,
        runValidators : true
    });

    res.status(200).json({
        status : 'success',
        data : {
           tour
        }
    });
  }catch(err){
    res.status(400).json({
        status : 'fail',
        message : 'Invalid data sent!'
     });
  }  
}

exports.deleteTour = async (req , res) => {
  try 
  { 
    
    await Tour.findByIdAndDelete(req.params.id); 

    res.status(204).json({
        status : 'success',
        data : null
    });
  }catch(err){
    res.status(400).json({
        status : 'fail',
        message : 'Deleted fail!'
     });
  }  
}

exports.getTourStats = async (req , res) => {
    try {
      const stats = await Tour.aggregate([
        {
          $match : { ratingsAverage : { $gte : 4.5 } }
        },
        {
          $group : {
            _id : { $toUpper : '$difficulty' },
            numTours : { $sum : 1 },
            avgRating : { $avg : '$ratingsAverage' },
            avgPrice : { $avg : '$price' },
            minPrice : { $min : '$price' },
            maxPrice : { $max : '$price' }
          }
        },
        {
            $sort : { avgPrice : 1 }
        }
      ]);

      res.status(200).json({
        status : 'success',
        data : {
            stats
        }
      });
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err
      });
    }
}

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

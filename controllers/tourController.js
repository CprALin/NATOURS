//const fs = require('fs');
const Tour = require('./../models/tourModel');

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
    //BUILD QUERY
    //Filtering
    const queryObj = {...req.query};
    const excludeFields = ['page' , 'sort' , 'limit' , 'fields'];

    excludeFields.forEach(el => delete queryObj[el]);
     
    //console.log(req.query , queryObj);
    
    //Advance filtering
    let queryStr = JSON.stringify(queryObj);
    // gte , gt , lte , lt
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    //console.log(JSON.parse(queryStr));

    let query = Tour.find(JSON.parse(queryStr));

    //{ difficulty : 'easy' , duration : { $gte : 5 }}
    
    //Sorting
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        //console.log(sortBy);
        query = query.sort(sortBy);
        // sort('price ratingAvarage')
    }else{
        query = query.sort('-createdAt');
    }

    //Field limiting
    if(req.query.fields){
        const fields = req.query.fields.split(',').join(' ');
        query = query.select(fields);
    }else{
        query = query.select('-__v');
    }

    //Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    // page=2&limit=10 , 1-10 page 1 , 11-20 page 2 , 21-30 page 3
    query = query.skip(skip).limit(limit);

    if(req.query.page){
        const numTours = await Tour.countDocuments();
        if(skip >= numTours)
        {
            throw new Error('This page does not exits');
        }
    }

    //EXECUTE QUERY
    const tours = await query; 
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
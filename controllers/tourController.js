const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// ROUTE HANDLERS
exports.getAllTours = (req , res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status : 'success',
        requestedAt : req.requestTime,
        results : tours.length ,
        data : {
            tours
        } 
    });
}

exports.getTour = (req , res) => {
    console.log(req.params);

    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);

    //if(id > tours.length)
    if(!tour)
    {
        return res.status(404).json({
            status : 'fail',
            message : 'Invalid ID'
        });
    }

    res.status(200).json({
        status : 'success',
        data : {
            tour
        }
    });
}

exports.createTour = (req, res) => {
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
}

exports.updateTour = (req , res) => {
    
    if(req.params.id * 1 > tours.length)
    {
        return res.status(404).json({
            status : 'fail',
            message : 'Invalid ID'
        });
    }

    res.status(200).json({
        status : 'success',
        data : {
            tour : 'Updated Tour'
        }
    });
}

exports.deleteTour = (req , res) => {
    
    if(req.params.id * 1 > tours.length)
    {
        return res.status(404).json({
            status : 'fail',
            message : 'Invalid ID'
        });
    }

    res.status(204).json({
        status : 'success',
        data : null
    });
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
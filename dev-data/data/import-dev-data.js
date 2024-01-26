const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path : './config.env'});
//const Tour = require('./../../models/tourModel');
const Review = require('./../../models/reviewModel');
const User = require('./../../models/userModel');

//console.log(process.env);

const DB = 'mongodb+srv://LocalDB:1qhHFY3dLAVeCw0x@atlascluster.rd7x8hu.mongodb.net/';

mongoose
  .connect(DB , {
    useNewUrlParser : true,
    useCreateIndex : true,
    useFindAndModify : false,
    useUnifiedTopology : true
  }).then(() => console.log('DB connection successful!'));

  //READ js file

  //const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json` , 'utf-8'));
  const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));
  const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

  //IMPORT DATA INTO DB
  const importData = async () => {
        try{
          //await Tour.create(tours);
          await Review.create(reviews);
          await User.create(users);
          console.log('Data successfuly loaded!');
        }catch(err){
            console.log(err);
        }
  }

  //delete all data from coletion
  const deleteData = async () => {
    try{
        //await Tour.deleteMany();
        await Review.deleteMany();
        await User.deleteMany();
        console.log('Data successfuly deleted!');
      }catch(err){
          console.log(err);
      }
  }

  if(process.argv[2] === '--import')
  {
    importData();
    process.exit();
  }else if(process.argv[2] === '--delete')
  {
    deleteData();
    process.exit();
  }

  console.log(process.argv);
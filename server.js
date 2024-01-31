//all app configurations
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path : './config.env'});

// unclean state - is need to crash
process.on('uncaughtException' , err => {
  console.log('UNCAUGHT REJECTION ! - Shutting down...');
  console.log(err.name , err.message);
  process.exit(1);  
});

const app = require('./app');

//console.log(process.env);

const DB = process.env.DATABASE.replace('<PASSWORD>' , process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(() => console.log('DB connection successful!'))
  .catch(err => console.error('DB connection error:', err));
  //.catch(err => console.log('ERROR !'));

// START SERVER     
const port = process.env.PORT || 3000;
const server = app.listen(port , () => {
    console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLER REJECTION ! - Shutting down...');
    console.log(err.name , err.message);
    server.close(() => {
      process.exit(1);  
    });
});

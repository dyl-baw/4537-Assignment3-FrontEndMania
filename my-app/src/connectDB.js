const { mongoose } = require('mongoose')
// const dotenv = require("dotenv")
// dotenv.config();
// console.log(process.env)

const connectDB = async (input) => {
  try {
    const x = await mongoose.connect("mongodb+srv://david:1111@cluster0.olk69fd.mongodb.net/assignment_3?retryWrites=true&w=majority")
    console.log("Connected to db");
    if (input.drop === true)
      mongoose.connection.db.dropDatabase();
    // console.log("Dropped db");
    // get the data from Github 
  } catch (error) {
    console.log('db error');
  }
}

module.exports = { connectDB }
import mongoose from 'mongoose';

const run =async() => {
  try {
    await mongoose.connect(process.env.MONGODBURL)
    console.log('database connection established')
  } catch (error) {
    console.log(error.message);
  }
}



export default run

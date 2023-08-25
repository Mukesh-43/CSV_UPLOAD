const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://mukeshaero43:mukeshaero43@cluster0.ogaqhy5.mongodb.net/CSV_UPLOAD?retryWrites=true&w=majority');
  console.log('MongoDB connected successfully');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
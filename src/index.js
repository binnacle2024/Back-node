import app from './app.js'
// import {connectDB} from './db.js'

// const PORT = process.env.PORT;
const PORT = 4000;
// connectDB();
app.listen(PORT)
console.log('server port', PORT);
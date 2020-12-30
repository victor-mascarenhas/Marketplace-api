const express = require('express')
const app = express()
var cors = require('cors')
const connectDB = require('./config/db')
const fileUpload = require('express-fileupload')
var bodyparser = require('body-parser')
const PORT = process.env.PORT || 4646

//Init Middleware
app.use(cors())
app.use(express.json())
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
app.use('/uploads', express.static('uploads'))

//Mongo Connect
connectDB()

app.use(fileUpload({
    createParentPath: true
}));

//Define Routes
app.get('/', (req, res) => res.send('Hello!'))
app.use('/auth', require('./routes/api/auth'))
app.use('/user', require('./routes/api/user'))
app.use('/partner', require('./routes/api/partner'))
app.use('/category', require('./routes/api/category'))
app.use('/product', require('./routes/api/product'))


const server = app.listen(PORT, () => {console.log(`Listening on: ${PORT}`)})

module.exports = {app , server}
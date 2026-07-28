const express = require('express');
const userRouter = require('./routes/user.routes')
const dotenv = require('dotenv');
dotenv.config();
const connectToDB = require('./config/db')
connectToDB();
const cookieParser = require('cookie-parser');

const app = express();
const indexRouter = require('./routes/index.routes');
const fileRouter = require('./routes/file.routes');


app.set('view engine','ejs');
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))



app.use('/',indexRouter)
app.use('/user',userRouter)
app.use('/uploads',express.static('uploads'));
app.use('/file', fileRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
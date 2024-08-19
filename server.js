const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// 1) Mongoose configuration
const db = "mongodb+srv://chiminh:minh2004@cluster0.znpzc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(db)
   .then(() => console.log('ok'))
   .catch((err) => console.error(err));

// 2) Middleware configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

// 4) Router configuration
const userRouter = require('./api/routes/userRouter');
userRouter(app);

const gradeRouter = require('./api/routes/gradeRouter');
gradeRouter(app);

const courseRouter = require('./api/routes/courseRouter');
courseRouter(app);

// Start the server (backend) port
const port = 3000;
app.listen(process.env.PORT || port, () => console.log(`Server running on port ${port}`));
// Run web app in terminal: npm start

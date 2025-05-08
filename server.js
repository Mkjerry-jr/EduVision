const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Student = require('./models/newstudentModel');
const Teacher = require('./models/newteacherModel');

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'your-secret-key',  // Change this to a random string if you are gay
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));
// Set EJS as templating engine

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');

const clusterRoutes = require("./routes/auth"); // Adjust the file name if needed
const BEORoutes = require("./routes/auth");
const headRoutes = require("./routes/auth");
const teacherRoutes = require("./routes/auth");
const studentRoutes = require("./routes/auth");
const attendance = require('./routes/auth');

app.set('trust proxy', 1)
app.use(session({
    secret: 'mkjerry',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, maxAge: 60000 }
  }))

// Use routes
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/student', studentRoutes); // Use the new student route
app.use('/', authRoutes);//submit form post method

app.use("/", BEORoutes);
app.use("/", clusterRoutes);
app.use("/", headRoutes);
app.use("/", teacherRoutes);
app.use("/", studentRoutes);
app.use("/", attendance);



app.get('/', (req, res) => {
  res.render('login');
});



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

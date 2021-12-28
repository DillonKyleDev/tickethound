const express = require('express');
const app = express();
// Accessing the path module
const path = require("path");

const cors = require('cors');
app.use(cors());
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo').default;
require('dotenv').config();
const PORT = process.env.PORT;
app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(express.static( './Client/src/App' ));
require('./config/passport');
//Routes
const LoginRouter = require('./Routes/Login');
const RegisterRouter = require('./Routes/Register');
const DashboardRouter = require('./Routes/Dashboard');
const LogoutRouter = require('./Routes/Logout');
const ProjectsRouter = require('./Routes/Projects');
const ProjectFormRouter = require('./Routes/ProjectForm');
const TicketFormRouter = require('./Routes/TicketForm');
const UserFormRouter = require('./Routes/UserForm');
const UserRouter = require('./Routes/Users');
const EditProjectRouter = require('./Routes/EditProject');
const EditTicketRouter = require('./Routes/EditTicket');
const EditUserRouter = require('./Routes/EditUser');
const DeleteProjectRouter = require('./Routes/DeleteProject');
const DeleteUserRouter = require('./Routes/DeleteUser');

//This will create a middleware.
//When you navigate to the root page, it would use the built react-app
app.use(express.static(path.resolve(__dirname, "./client/build")));

//Connect MongoDB
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log('Connected to DB');
  app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
  });
})
.catch(err => {
  console.log(err);
});

//Set up sessionStore using MongoStore/connect-mongo constructor
app.use(session({
  store: MongoStore.create({mongoUrl: process.env.DB_URI, collectionName: 'sessions'}),
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use('/login', LoginRouter);
app.use('/register', RegisterRouter);
app.use('/dashboard', DashboardRouter);
app.use('/logout', LogoutRouter);
app.use('/projects', ProjectsRouter);
app.use('/projectForm', ProjectFormRouter);
app.use('/ticketForm', TicketFormRouter);
app.use('/userForm', UserFormRouter);
app.use('/users', UserRouter);
app.use('/editProject', EditProjectRouter);
app.use('/editTicket', EditTicketRouter);
app.use('/editUser', EditUserRouter);
app.use('/deleteProject', DeleteProjectRouter);
app.use('/deleteUser', DeleteUserRouter);

app.get("*", (request, response) => {
  response.sendFile(path.resolve(__dirname, "./Client/build", "index.html"));
});

app.get('/', (req, res) => {
  res.redirect('/');
});
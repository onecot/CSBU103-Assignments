const express = require('express')
const path = require('path')
const fs = require('fs')
var cookieParser = require("cookie-parser")
var session = require("express-session")
const app = express()
const UserController = require('./controllers/user') 
const { UserModel } = require('./models')
var debug = require("debug")("index.js");

// Initialize db.json in src/models from top-level db.json on server start
const initializeDatabase = () => {
  const sourceDbPath = path.join(__dirname, '..', 'db.json')
  const targetDbPath = path.join(__dirname, 'models', 'db.json')
  
  try {
    if (fs.existsSync(sourceDbPath)) {
      const data = fs.readFileSync(sourceDbPath, 'utf8')
      fs.writeFileSync(targetDbPath, data, 'utf8')
      console.log('Database initialized from top-level db.json')
    }
  } catch (err) {
    console.error('Error initializing database:', err)
  }
}

initializeDatabase()

app.use(express.json())
app.use(express.urlencoded(({ extended: false })))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


app.use('/public', express.static(path.join(__dirname, 'public')))
app.use('/users', UserController)
app.use(cookieParser())
app.use(
  session({
    secret: "demoapp",
    name: "app",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 5000 } /* 6000 ms? 6 seconds -> wut? :S */
  })
);
const checkLoggedIn = function(request, response, next) {
  if (request.session.loggedIn) {
    // debug(
    //   "checkLoggedIn(), req.session.loggedIn:",
    //   req.session.loggedIn,
    //   "executing next()"
    // );
    next();
  } else {
    // debug(
    //   "checkLoggedIn(), req.session.loggedIn:",
    //   req.session.loggedIn,
    //   "rendering login"
    // );
    response.redirect("login");
  }
}


app.get('/', checkLoggedIn, async function (request, response) {
  // res.sendFile(path.join(__dirname,'index.html'))
  const allUsers = await UserModel.getAllUsers()
  
  console.log(allUsers)
  response.render('index', { data: allUsers || [] })
})

app.post('/login', async function(req, res) {
  const { username, password } = req.body     
    try {
        const user = await UserModel.findUserByUsername(username)
        // FAIL-FAST 
        console.log({ user });
        if (user && (user.username === username) && (user.password === password)) {
          req.session.loggedIn = true
          res.redirect('/')

        } else {
        throw new Error('Invalid username or password. Please try again.')
        // if(!user || user.username !== username || user.password !== password) throw new Error('Unauthorized access')
        // req.session.loggedIn = true
        }
    }
    catch(error) {
      console.error(error)
      res.render('login', { errorMessage: error.message })
    }
})

app.get('/login', function(req, res) {
  if(req.session.loggedIn) res.redirect('/')
  res.render('login')
})

app.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
    if(err) {
      console.error('Error destroying session:', err)
    }
    res.redirect('/login')
  })
})

app.get('/register', function(req, res) {
  if(req.session.loggedIn) return res.redirect('/')
  res.render('register')
})

app.post('/register', async function(req, res) {
  const { username, name, gender, password, confirmPassword } = req.body
  try {
    // Validate passwords match
    if (password !== confirmPassword) {
      return res.render('register', { errorMessage: 'The passwords you entered do not match. Please try again.' })
    }
    
    // Check if username already exists
    const existing = await UserModel.findUserByUsername(username)
    if (existing) {
      return res.render('register', { errorMessage: 'This username is already taken. Please choose a different one.' })
    }
    
    // Register new user
    await UserModel.registerUser({ username, name, gender, password })
    
    res.render('login', { successMessage: 'Welcome! Your account has been created successfully. Please log in to continue.' })
  } catch(error) {
    console.error(error)
    res.render('register', { errorMessage: 'We could not complete your registration. Please check your information and try again.' })
  }
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})

import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import passport from 'passport'
import mongoose from 'mongoose'
import MongoStore from 'connect-mongo'
import cors from 'cors'
import { User } from './mongoose/schema/user.js'
// Routers
import mailerRouter from "./routes/mailer.mjs"
import appointmentRouter from './routes/appointment.mjs'
import createdoctorrouter from './routes/doctor.mjs'
import getNearByHospitals from './routes/nearbyhospitals.mjs'
import userRouter from './routes/users.mjs'
// Local strategy
import './strategis/local-strategy.mjs'

dotenv.config()

const app = express()

// ✅ MongoDB Connection Function
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'doctor',
    })
    console.log("✅ MongoDB Connected Successfully")
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error)
    process.exit(1)
  }
}

const allowedOrigins = [
  'https://medipluss-fullstack.netlify.app',
  'http://localhost:3000'
];
app.use(express.json())
app.use(cookieParser('hello world'))


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("❌ CORS Blocked Origin:", origin); 
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));



// ✅ Session Middleware
app.use(session({
  secret: 'quwam_the_dev',
  saveUninitialized: false,
  resave: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    dbName: 'doctor',
    collectionName: "sessions",
  }),
 cookie: {
  maxAge: 1000 * 60 * 60 * 24, // 1 day
  httpOnly: true,
  secure: false, 
  sameSite: "none" 
}
}))

// ✅ Passport Middleware
app.use(passport.initialize())
app.use(passport.session())


// ✅ Routers
app.use(mailerRouter)
app.use(appointmentRouter)
app.use(createdoctorrouter)
app.use(getNearByHospitals)
app.use(userRouter)



// ✅ Log Session & Cookies
app.use((req, res, next) => {
  console.log('Incoming cookies:', req.cookies)
  console.log('Session ID:', req.sessionID)
  next()
})
 
// ✅ Auth Login
app.post('/api/auth/login', (request, response, next) => {
  passport.authenticate('local', (error, user, info) => {
    if (error) return response.status(500).send({ msg: error.message })
    if (!user) return response.status(401).send({ msg: info.message || "Invalid credentials" })

    request.login(user, (error) => {
      if (error) return response.status(500).send({ msg: error.message })
      return response.status(201).send({ msg: "Login successful", user })
    })
  })(request, response, next)
})


// ✅ Check Auth Status
app.get('/api/auth/status', async (request, response) => {
  if (!request.user) {
    return response.status(401).send({ message: "not authenticated" })
  }

  try {
    response.status(200).send({
      msg: "valid user",
      user: request.user,
    })
  } catch (error) {
    return response.status(500).send(error.message)
  }
})

//  create user
 app.post('/api/auth/create-user',async(request,response)=>{
     const {body}=request
     try {
         const newUser=new User(body)
        const savedUser =await newUser.save()
        return response.status(201).send(`account created succesfully${savedUser}`)
    } catch (error) {
        console.log(error.message)
        return response.status(400).send(`error${error.message}`)

    }
})



// ✅ Start Server
const PORT = process.env.PORT 
console.log(PORT)
const startServer = async () => {
  await connectDB()
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}, ${process.env.SESSION_SECRET}`))
}
startServer()

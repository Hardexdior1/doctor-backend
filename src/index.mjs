
// import express, { response } from 'express'
// import dotenv from 'dotenv'
// import cookieParser from 'cookie-parser'
// import session from 'express-session'
// import passport from 'passport'
// import mongoose from 'mongoose'
// import MongoStore from 'connect-mongo'
// import cors from 'cors'
// import { User } from './mongoose/schema/user.js'
// // Routers
// import mailerRouter from "./routes/mailer.mjs"
// import appointmentRouter from './routes/appointment.mjs'
// import createdoctorrouter from './routes/doctor.mjs'
// import getNearByHospitals from './routes/nearbyhospitals.mjs'
// import userRouter from './routes/users.mjs'
// // Local strategy
// import './strategis/local-strategy.mjs'

// dotenv.config()

// const app = express()

// // ✅ MongoDB Connection Function
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       dbName: 'doctor',
//     })
//     console.log("✅ MongoDB Connected Successfully")
//   } catch (error) {
//     console.error("❌ MongoDB Connection Error:", error)
//     process.exit(1)
//   }
// }

// const allowedOrigins = [
//   'https://medipluss-fullstack.netlify.app',
//   'http://localhost:3000',
//   'http://localhost:3001',
//   'https://quwamportfolio.netlify.app',
// ];

// app.use(express.json())
// // app.use(cookieParser('hello world'))
// app.use(cookieParser()); // No secret needed for session cookies

// // app.use(cors({
// //   origin: function (origin, callback) {
// //     console.log("Request Origin:", origin); // Debug log
// //     if (!origin || allowedOrigins.includes(origin)) {
// //       callback(null, true);
// //     } else {
// //       console.error("❌ CORS Blocked Origin:", origin); 
// //       callback(new Error("Not allowed by CORS"));
// //     }
// //   },
// //   credentials: true,
// //   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
// //   allowedHeaders: ["Content-Type", "Authorization"]
// // }));

// const corsOptions = {
//   origin: (origin, callback) => {
//     console.log("Request Origin:", origin);
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, origin || true); // Return the origin or true for non-origin requests (e.g., Postman)
//     } else {
//       console.error("❌ CORS Blocked Origin:", origin);
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

// app.use(cors(corsOptions));

// // Explicitly handle OPTIONS requests
// app.options('*', cors(corsOptions));
// // app.options('*', cors({
// //   origin: function (origin, callback) {
// //     if (!origin || allowedOrigins.includes(origin)) {
// //       callback(null, true);
// //     } else {
// //       callback(new Error("Not allowed by CORS"));
// //     }
// //   },
// //   credentials: true
// // }));


// // ✅ Session Middleware
// // app.use(session({
// //   secret: 'quwam_the_dev',
// //   saveUninitialized: false,
// //   resave: false,
// //   store: MongoStore.create({
// //     mongoUrl: process.env.MONGO_URI,
// //     dbName: 'doctor',
// //     collectionName: "sessions",
// //   }),

// // cookie: {
// //   httpOnly: true,
// //   secure: process.env.NODE_ENV === "production", 
// //   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
// //   maxAge: 24 * 60 * 60 * 1000 ,
// //   path:'/', 
// // }


// // }))
// app.use(
//   session({
//     secret: 'quwam_the_dev',
//     saveUninitialized: false,
//     resave: false,
//     store: MongoStore.create({
//       mongoUrl: process.env.MONGO_URI,
//       dbName: 'doctor',
//       collectionName: 'sessions',
//     }),
//     cookie: {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production' ? true : false, // Explicitly set secure based on environment
//       sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Use 'none' only in production with HTTPS
//       maxAge: 24 * 60 * 60 * 1000,
//       path: '/',
//     },
//   })
// );
// // ✅ Passport Middleware
// app.use(passport.initialize())
// app.use(passport.session())


// // ✅ Routers
// app.use(mailerRouter)
// app.use(appointmentRouter)
// app.use(createdoctorrouter)
// app.use(getNearByHospitals)
// app.use(userRouter)



// //  Log Session & Cookies
// // app.use((req, res, next) => {
// //   console.log('Incoming cookies:', req.cookies)

// //   console.log('Session ID:', req.sessionID)
// //   next()
// // })
// app.use((req, res, next) => {
//   console.log('Incoming Cookies:', req.cookies);
//   console.log('Signed Cookies:', req.signedCookies); // Check signed cookies
//   console.log('Session ID:', req.sessionID);
//   console.log('Session Data:', req.session); // Log session data
//   console.log('User:', req.user); // Log authenticated user
//   next();
// });
 
// app.get('/api/check',(request,response)=>{
//       return response.status(401).send({ message: "hi", cookies:request.cookies })
// })
// //  Auth Login
// app.post('/api/auth/login', (request, response, next) => {
//   passport.authenticate('local', (error, user, info) => {
//     if (error) return response.status(500).send({ msg: error.message });
//     if (!user) return response.status(401).send({ msg: info.message || 'Invalid credentials' });

//     request.login(user, (error) => {
//       if (error) return response.status(500).send({ msg: error.message });
//       return response.status(201).send({ msg: 'Login successful', user });
//     });
//   })(request, response, next);
// });

// // ✅ Check Auth Status
// app.get('/api/auth/status', async (request, response) => {
//   if (!request.user) {
//     return response.status(401).send({ message: "not authenticated" })
//   }

//   try {
//     response.status(200).send({
//       msg: "valid user",
//       user: request.user,
//     })
//   } catch (error) {
//     return response.status(500).send(error.message)
//   }
// })

// //  create user
//  app.post('/api/auth/create-user',async(request,response)=>{
//      const {body}=request
//      try {
//          const newUser=new User(body)
//         const savedUser =await newUser.save()
//         return response.status(201).send(`account created succesfully${savedUser}`)
//     } catch (error) {
//         console.log(error.message)
//         return response.status(400).send(`error${error.message}`)

//     }
// })



// // ✅ Start Server
// // const PORT = process.env.PORT 
// const PORT = process.env.PORT || 5000;

// console.log(PORT)
// const startServer = async () => {
//   await connectDB()
//   app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
// }
// startServer()
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import { User } from './mongoose/schema/user.js';
import mailerRouter from './routes/mailer.mjs';
import appointmentRouter from './routes/appointment.mjs';
import createdoctorrouter from './routes/doctor.mjs';
import getNearByHospitals from './routes/nearbyhospitals.mjs';
import userRouter from './routes/users.mjs';
import './strategis/local-strategy.mjs';

dotenv.config();

const app = express();

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'doctor',
    });
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

const allowedOrigins = [
  'https://medipluss-fullstack.netlify.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'https://quwamportfolio.netlify.app',
];

// Middleware
app.use(express.json());
app.use(cookieParser()); // No secret needed

app.use(
  cors({
    origin: (origin, callback) => {
      console.log('Request Origin:', origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin || true);
      } else {
        console.error('❌ CORS Blocked Origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.options('*', cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin || true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(
  session({
    secret: 'quwam_the_dev',
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      dbName: 'doctor',
      collectionName: 'sessions',
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Debug Middleware
app.use((req, res, next) => {
  console.log('Incoming Cookies:', req.cookies);
  console.log('Signed Cookies:', req.signedCookies);
  console.log('Session ID:', req.sessionID);
  console.log('Session Data:', req.session);
  console.log('User:', req.user);
  next();
});

// Routes
app.use(mailerRouter);
app.use(appointmentRouter);
app.use(createdoctorrouter);
app.use(getNearByHospitals);
app.use(userRouter);

app.get('/api/check', (req, res) => {
  return res.status(200).send({ message: 'hi', cookies: req.cookies });
});
app.get('/api/hi',(req,res)=>{
  return res.status(200).send({ message: 'hello man ', cookies: req.cookies });

})
app.post('/api/auth/login', (req, res, next) => {
  passport.authenticate('local', (error, user, info) => {
    if (error) return res.status(500).send({ msg: error.message });
    if (!user) return res.status(401).send({ msg: info.message || 'Invalid credentials' });

    req.login(user, (error) => {
      if (error) return res.status(500).send({ msg: error.message });
      return res.status(201).send({ msg: 'Login successful', user });
    });
  })(req, res, next);
});

app.get('/api/auth/status', async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ message: 'not authenticated' });
  }
  try {
    res.status(200).send({
      msg: 'valid user',
      user: req.user,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

app.post('/api/auth/create-user', async (req, res) => {
  const { body } = req;
  try {
    const newUser = new User(body);
    const savedUser = await newUser.save();
    return res.status(201).send(`account created successfully ${savedUser}`);
  } catch (error) {
    console.log(error.message);
    return res.status(400).send(`error ${error.message}`);
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};
startServer();
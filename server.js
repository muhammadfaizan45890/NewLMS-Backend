import express from "express";
import "dotenv/config";
import cors from "cors";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import connectDB from "./database/db.js";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import adminRoute from "./routes/adminRoute.js";
import enrollRoutes from "./routes/enrollRoutes.js";
import moduleRoutes from "./routes/moduleRoutes.js";
import refundRoutes from "./routes/refundRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";

import "./config/passport.js";

// ------------------------------------------------------------
// 1. Setup __dirname for ES modules
// ------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ------------------------------------------------------------
// 2. Middleware (order matters)
// ------------------------------------------------------------
app.use(
  cors({
    // ❌ Removed CLIENT_URL – now allowing all origins
    // For production, replace '*' with your actual frontend URL
    origin: 'https://lms-courseacademy.vercel.app',
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// ✅ Serve static folders (create them if missing)
const staticDirs = [
  { route: "/uploads", dir: "uploads" },
  { route: "/upload", dir: "upload" },
  { route: "/files", dir: "public/files" },
];
staticDirs.forEach(({ route, dir }) => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`📁 Created static directory: ${fullPath}`);
  }
  app.use(route, express.static(fullPath));
});

// ------------------------------------------------------------
// 3. Routes
// ------------------------------------------------------------
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/admin", adminRoute);
app.use("/enroll", enrollRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/refund", refundRoutes);
app.use("/notes", notesRoutes);
app.use("/certificate", certificateRoutes);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server running" });
});

// ------------------------------------------------------------
// 4. 404 handler
// ------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ------------------------------------------------------------
// 5. Global error handler
// ------------------------------------------------------------
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  if (err.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

// ------------------------------------------------------------
// 6. Start server
// ------------------------------------------------------------
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Database connected");

    console.log(`🔧 CORS origin: ${'https://lms-courseacademy.vercel.app'}`);  // updated log
    console.log(
      `🔑 Google OAuth: ${process.env.GOOGLE_CLIENT_ID ? "Loaded ✅" : "Missing ❌"}`
    );
    console.log(`📁 Uploads directory: ${path.join(__dirname, "uploads")}`);
    console.log(`📁 Files directory: ${path.join(__dirname, "public/files")}`);

    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();




// import express from "express";
// import "dotenv/config";
// import cors from "cors";
// import passport from "passport";
// import path from "path";
// import { fileURLToPath } from "url";
// import fs from "fs";

// import connectDB from "./database/db.js";

// import userRoute from "./routes/userRoute.js";
// import authRoute from "./routes/authRoute.js";
// import adminRoute from "./routes/adminRoute.js";
// import enrollRoutes from "./routes/enrollRoutes.js";
// import moduleRoutes from "./routes/moduleRoutes.js";
// import refundRoutes from "./routes/refundRoutes.js";
// import notesRoutes from "./routes/notesRoutes.js";
// import certificateRoutes from "./routes/certificateRoutes.js";
// import courseRoute from "./routes/courseRoute.js";   // ✅ Added

// import "./config/passport.js";


// // ------------------------------------------------------------
// // 1. Setup __dirname for ES modules
// // ------------------------------------------------------------

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


// const app = express();

// const PORT = process.env.PORT || 5000;


// // ------------------------------------------------------------
// // 2. Middleware
// // ------------------------------------------------------------


// app.use(
//   cors({

//     origin: "https://lms-courseacademy.vercel.app",

//     credentials: true,

//     methods: [
//       "GET",
//       "POST",
//       "PUT",
//       "DELETE",
//       "OPTIONS"
//     ],

//     allowedHeaders: [
//       "Content-Type",
//       "Authorization"
//     ],

//   })
// );



// app.use(express.json());

// app.use(
//   express.urlencoded({
//     extended:true
//   })
// );


// app.use(passport.initialize());



// // ------------------------------------------------------------
// // 3. Static folders
// // ------------------------------------------------------------


// const staticDirs = [

//   {
//     route:"/uploads",
//     dir:"uploads"
//   },

//   {
//     route:"/upload",
//     dir:"upload"
//   },

//   {
//     route:"/files",
//     dir:"public/files"
//   }

// ];



// staticDirs.forEach(({route,dir})=>{


//   const fullPath = path.join(__dirname,dir);



//   if(!fs.existsSync(fullPath)){

//     fs.mkdirSync(fullPath,{
//       recursive:true
//     });


//     console.log(
//       `📁 Created directory: ${fullPath}`
//     );

//   }



//   app.use(
//     route,
//     express.static(fullPath)
//   );


// });




// // ------------------------------------------------------------
// // 4. API Routes
// // ------------------------------------------------------------



// app.use(
//   "/auth",
//   authRoute
// );



// app.use(
//   "/user",
//   userRoute
// );



// // admin APIs
// // example:
// // GET /admin/courses

// app.use(
//   "/admin",
//   adminRoute
// );



// // courses APIs
// // example:
// // GET /courses

// app.use(
//   "/courses",
//   courseRoute
// );



// app.use(
//   "/enroll",
//   enrollRoutes
// );



// app.use(
//   "/api/modules",
//   moduleRoutes
// );



// app.use(
//   "/refund",
//   refundRoutes
// );



// app.use(
//   "/notes",
//   notesRoutes
// );



// app.use(
//   "/certificate",
//   certificateRoutes
// );





// // ------------------------------------------------------------
// // 5. Health Check
// // ------------------------------------------------------------


// app.get("/",(req,res)=>{


//   res.status(200).json({

//     status:"ok",

//     message:"Server running"

//   });


// });





// // ------------------------------------------------------------
// // 6. 404 Handler
// // ------------------------------------------------------------


// app.use((req,res)=>{


//   res.status(404).json({

//     success:false,

//     message:
//     `Route ${req.method} ${req.originalUrl} not found`

//   });


// });






// // ------------------------------------------------------------
// // 7. Error Handler
// // ------------------------------------------------------------


// app.use(
// (err,req,res,next)=>{


// console.error(
// "Unhandled error:",
// err
// );



// if(err.name==="MulterError"){


// return res.status(400).json({

// success:false,

// message:err.message

// });


// }




// res.status(500).json({


// success:false,


// message:

// process.env.NODE_ENV==="production"

// ?

// "Internal server error"

// :

// err.message


// });



// });







// // ------------------------------------------------------------
// // 8. Start Server
// // ------------------------------------------------------------



// const startServer = async()=>{


// try{


// await connectDB();


// console.log(
// "✅ Database connected"
// );



// console.log(
// `🔧 CORS origin: https://lms-courseacademy.vercel.app`
// );



// console.log(

// `🔑 Google OAuth: ${
// process.env.GOOGLE_CLIENT_ID
// ?
// "Loaded ✅"
// :
// "Missing ❌"
// }`

// );



// console.log(

// `📁 Uploads directory:
// ${path.join(__dirname,"uploads")}`

// );



// console.log(

// `📁 Files directory:
// ${path.join(__dirname,"public/files")}`

// );



// app.listen(PORT,()=>{


// console.log(
// `🚀 Server listening on port ${PORT}`
// );


// });



// }

// catch(error){


// console.error(
// "❌ Failed to start server:",
// error
// );



// process.exit(1);


// }



// };



// startServer();

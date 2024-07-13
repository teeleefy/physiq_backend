"use strict";

/** Express app for physiq. */

//NECESSARY IMPORTS FOR APP, MIDDLEWARE, AND ERROR HANDLING
const express = require("express");
const cors = require("cors");
const { NotFoundError } = require("./expressError");
const { authenticateJWT } = require("./middleware/auth.js");

//CONNECT TO ROUTES FILES
const familiesRoutes = require("./routes/families/families");
const authRoutes = require("./routes/auth/auth");
const membersRoutes = require("./routes/members/members");
const allergiesRoutes = require("./routes/allergies/allergies");
const diagnosesRoutes = require("./routes/diagnoses/diagnoses");
const doctorsRoutes = require("./routes/doctors/doctors");
const goalsRoutes = require("./routes/goals/goals");
const imagesRoutes = require("./routes/images/images");
const insuranceRoutes = require("./routes/insurance/insurance");
const medsRoutes = require("./routes/meds/meds");
const symptomsRoutes = require("./routes/symptoms/symptoms");
const visitsRoutes = require("./routes/visits/visits");


//CONNECT TO MORGAN LIBRARY FOR DETAILED BACKEND INFORMATION
const morgan = require("morgan");

//MAKE EXPRESS APP
const app = express();

//USE MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);


//URL ROUTE NAMES

app.use("/families", familiesRoutes);
app.use("/auth", authRoutes);
app.use("/members", membersRoutes);
app.use("/allergies", allergiesRoutes);
app.use("/diagnoses", diagnosesRoutes);
app.use("/doctors", doctorsRoutes);
app.use("/goals", goalsRoutes);
app.use("/images", imagesRoutes);
app.use("/insurance", insuranceRoutes);
app.use("/meds", medsRoutes);
app.use("/symptoms", symptomsRoutes);
app.use("/visits", visitsRoutes);


/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;

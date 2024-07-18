"use strict";

/** Express app for physiq. */

//NECESSARY IMPORTS FOR APP, MIDDLEWARE, AND ERROR HANDLING
const express = require("express");
const cors = require("cors");
const { NotFoundError } = require("./expressError");
const { authenticateJWT } = require("./middleware/auth.js");

//CONNECT TO ROUTES FILES
// Families Route: /families 
const familiesRoutes = require("./routes/families/families");

// Auth Route: /auth 
const authRoutes = require("./routes/auth/auth");

// Members Route: /members 
const membersRoutes = require("./routes/members/members");
const membersAllergyRoutes = require("./routes/members/allergies/allergies.js");
const membersDiagnosisRoutes = require("./routes/members/diagnoses/diagnoses.js");
const membersDoctorRoutes = require("./routes/members/doctors/doctors.js");
const membersGoalRoutes = require("./routes/members/goals/goals.js");
const membersImageRoutes = require("./routes/members/images/images.js");
const membersInsuranceRoutes = require("./routes/members/insurance/insurance.js");
const membersMedRoutes = require("./routes/members/meds/meds.js");
const membersSymptomRoutes = require("./routes/members/symptoms/symptoms.js");
const membersVisitRoutes = require("./routes/members/visits/visits.js");

// Admin Route: /admin
const adminRoutes = require("./routes/admin/admin");

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


//GET /MEMBERS ROUTES
app.use("/members", 
      membersRoutes, 
      membersAllergyRoutes, 
      membersDiagnosisRoutes,
      membersDoctorRoutes,
      membersGoalRoutes,
      membersImageRoutes,
      membersInsuranceRoutes,
      membersMedRoutes,
      membersSymptomRoutes,
      membersVisitRoutes,
    );

//admin routes
app.use("/admin", adminRoutes);
// app.use("/allergies", allergiesRoutes);




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

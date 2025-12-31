const express = require("express");
const cron = require("node-cron");
const fs = require("fs");

const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Creating a cron job which runs on every 10:00 AM, except Saturday and Sunday
// cron.schedule('0 10 * * 1-5', function() {
//     console.log("Running a task every day at 10:00 AM, except Saturday and Sunday");
// });



module.exports = { app };
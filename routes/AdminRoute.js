const express = require('express');
const adminRoute= express.Router()

const {handlePostJobs}=require('../controller/AdminController')

//POST request
adminRoute.post('/postJobs/:EMAIL_ID/:API_KEY',handlePostJobs)

//export the module
module.exports={adminRoute}

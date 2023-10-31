const mongoose=require('mongoose')

//creating the schema for the job
const JobSchema=new mongoose.Schema({

    link:{
        type:String,
        required:true
    },
    organisation:{
        type:String,
        required:true
    },
    
    title:{
        type:String,
        required:true
    }
   /*  job_qualification:{
        type:String,
        required:true
    },
    job_application_link:{
        type:String,
        required:true
    },
    job_location:{
        type:String,
        required:true
    } */

})


//exporting the module
module.exports=mongoose.model("jobs", JobSchema);
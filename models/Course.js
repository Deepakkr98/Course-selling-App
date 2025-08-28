import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  courseName: { 
    type: String, 
    required: true 
  },
  courseDesc: { 
    type: String, 
    required: true 
  },
  courseFees: { 
    type: Number, 
    required: true 
  },
  instructorName: { 
    type: String, 
    required: true 
  },
  modeOfCourse: { 
    type: String, 
    enum: ["Online", "Offline"], 
    required: true 
  },
  duration: { 
    type: String, 
    required: true 
  },
}, 
{ timestamps: true });

export default mongoose.model("Course", courseSchema);
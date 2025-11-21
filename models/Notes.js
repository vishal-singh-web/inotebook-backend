import mongoose, { model } from 'mongoose';
const { Schema } = mongoose;

const Note = new Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'user'
  },
  title: {
    type:String,
    required:true
  },
  description: {
    type:String,
    required:true,
  },
  tags: {
    type:String,
    required:true,
    default: 'General'
  },
  date: {
    type:Date,
    default:Date.now
  },
});

const Notes = mongoose.model('note',Note);

export default Notes;

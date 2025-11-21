const mongoose = require('mongoose');
const { Schema } = mongoose;

const Notes = new Schema({
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

const Notes = model('note',Notes);

export default Notes;

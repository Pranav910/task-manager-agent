import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  dueDate: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Not Started"
  }
});

export const Task = mongoose.model('Task', taskSchema);

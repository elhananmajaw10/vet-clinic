import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  specialization: {
    type: String,
    required: true,
    enum: ['general', 'surgery', 'dental', 'dermatology', 'emergency', 'internal_medicine', 'vaccination', 'grooming']
  },
  description: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  education: {
    type: String,
    required: true
  },
  available: {
    type: Boolean,
    default: true
  },
  image: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model('Doctor', doctorSchema);
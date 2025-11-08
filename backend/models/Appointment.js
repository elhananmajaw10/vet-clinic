import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  petName: {
    type: String,
    required: true,
    trim: true
  },
  petType: {
    type: String,
    required: true,
    enum: ['dog', 'cat', 'bird', 'rabbit', 'other']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  service: {
    type: String,
    required: true,
    enum: ['checkup', 'vaccination', 'grooming', 'surgery', 'dental']
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  notes: {
    type: String,
    maxlength: 500
  },
  petPhoto: {
    type: String, // URL to uploaded image
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model('Appointment', appointmentSchema);
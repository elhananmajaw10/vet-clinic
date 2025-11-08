import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  page: {
    type: String,
    required: true,
    enum: ['about', 'services', 'contact'],
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  sections: [{
    title: String,
    content: String,
    type: {
      type: String,
      enum: ['text', 'stats', 'service', 'contact_info'],
      default: 'text'
    },
    data: mongoose.Schema.Types.Mixed
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('Content', contentSchema);
import express from 'express';
import auth from '../middleware/auth.js';
import Appointment from '../models/Appointment.js';

const router = express.Router();

// Create appointment
router.post('/', auth, async (req, res) => {
  try {
    const { petName, petType, appointmentDate, service, notes } = req.body;

    // Check for existing appointment at same time (within 1 hour)
    const existingAppointment = await Appointment.findOne({
      appointmentDate: {
        $gte: new Date(new Date(appointmentDate).getTime() - 60 * 60 * 1000),
        $lte: new Date(new Date(appointmentDate).getTime() + 60 * 60 * 1000)
      }
    });
    
    if (existingAppointment) {
      return res.status(400).json({ message: 'Time slot already booked. Please choose a different time.' });
    }

    const appointment = await Appointment.create({
      petName,
      petType,
      appointmentDate,
      service,
      notes,
      doctor: req.body.doctor,
      petPhoto: req.body.petPhoto || '',
      owner: req.user.id
    });

    await appointment.populate('owner', 'name email phone');
    
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's appointments
router.get('/my-appointments', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ owner: req.user.id })
      .populate('owner', 'name email phone')
      .sort({ appointmentDate: 1 });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all appointments (admin only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const appointments = await Appointment.find()
      .populate('owner', 'name email phone')
      .sort({ appointmentDate: 1 });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update appointment (full update)
router.put('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Only admin or owner can update
    if (req.user.role !== 'admin' && appointment.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check for time conflicts (exclude current appointment)
    if (req.body.appointmentDate) {
      const existingAppointment = await Appointment.findOne({
        _id: { $ne: req.params.id }, // exclude current appointment
        appointmentDate: {
          $gte: new Date(new Date(req.body.appointmentDate).getTime() - 60 * 60 * 1000),
          $lte: new Date(new Date(req.body.appointmentDate).getTime() + 60 * 60 * 1000)
        }
      });
      
      if (existingAppointment) {
        return res.status(400).json({ message: 'Time slot already booked. Please choose a different time.' });
      }
    }

    // Update all fields
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        petName: req.body.petName,
        petType: req.body.petType,
        appointmentDate: req.body.appointmentDate,
        service: req.body.service,
        status: req.body.status,
        doctor: req.body.doctor,
        notes: req.body.notes
      },
      { new: true, runValidators: true }
    ).populate('owner', 'name email phone');

    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update appointment status only
router.patch('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Only admin or owner can update
    if (req.user.role !== 'admin' && appointment.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.body.status) {
      appointment.status = req.body.status;
    }
    await appointment.save();
    
    await appointment.populate('owner', 'name email phone');
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete appointment
router.delete('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Only admin or owner can delete
    if (req.user.role !== 'admin' && appointment.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
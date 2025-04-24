const Room = require('../models/Room');

// CREATE a room
const createRoom = async (req, res) => {
  try {
    const { createdBy } = req.body;

    // Generate a 6-character alphanumeric room code
    const code = Math.random().toString(36).substr(2, 6).toUpperCase();

    const newRoom = new Room({ code, createdBy });
    await newRoom.save();

    res.status(201).json(newRoom);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// READ a room by ID
const getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json(room);
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE a room by ID
const updateRoom = async (req, res) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.roomId,
      req.body,
      { new: true }
    );
    if (!updatedRoom) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json(updatedRoom);
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE a room by ID
const deleteRoom = async (req, res) => {
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.roomId);
    if (!deletedRoom) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json({ message: 'Room deleted' });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createRoom,
  getRoom,
  updateRoom,
  deleteRoom,
};

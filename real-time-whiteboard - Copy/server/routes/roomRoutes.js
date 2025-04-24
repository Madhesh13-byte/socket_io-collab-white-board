const express = require('express');
const router = express.Router();
const Room = require('../models/Room'); // Mongoose model
const {
  createRoom,
  getRoom,
  updateRoom,
  deleteRoom,
} = require('../controllers/roomController');

router.post('/', createRoom);           // Create
router.get('/:roomId', getRoom);        // Read
router.put('/:roomId', updateRoom);     // Update
router.delete('/:roomId', deleteRoom);  // Delete

module.exports = router;

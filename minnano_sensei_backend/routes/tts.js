const express = require('express');
const router = express.Router();
const { synthesizeSpeech, getAudioFile } = require('../controllers/ttsController');

// POST /api/tts/synthesize - Synthesize speech from text
router.post('/synthesize', synthesizeSpeech);

// GET /api/tts/audio/:filename - Get synthesized audio file
router.get('/audio/:filename', getAudioFile);

module.exports = router;
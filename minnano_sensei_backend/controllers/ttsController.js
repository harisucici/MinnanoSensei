const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config({ path: './config/config.env' });

// Create temporary directory for audio files if it doesn't exist
const tempDir = path.join(__dirname, '../temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Synthesize speech using Azure Cognitive Services
exports.synthesizeSpeech = async (req, res, next) => {
  try {
    const { text, language = 'ja-JP', voice = 'ja-JP-NanamiNeural' } = req.body;
    
    // Validate input
    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text is required'
      });
    }
    
    // Check if Azure credentials are configured
    const azureKey = process.env.AZURE_TTS_KEY;
    const azureRegion = process.env.AZURE_TTS_REGION;
    
    if (!azureKey || !azureRegion) {
      console.log('Azure TTS credentials not configured, falling back to browser TTS');
      // Return a response indicating fallback is needed
      return res.status(200).json({
        success: true,
        message: 'Azure TTS not configured, use browser fallback',
        requiresBrowserFallback: true,
        text: text
      });
    }
    
    // Generate SSML (Speech Synthesis Markup Language) for the request
    const ssml = `
    <speak version='1.0' xml:lang='${language}'>
      <voice xml:lang='${language}' name='${voice}'>
        ${text}
      </voice>
    </speak>`;

    try {
      // Make request to Azure Text-to-Speech API
      const response = await axios.post(
        `https://${azureRegion}.tts.speech.microsoft.com/cognitiveservices/v1`,
        ssml,
        {
          headers: {
            'Ocp-Apim-Subscription-Key': azureKey,
            'Content-Type': 'application/ssml+xml',
            'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
            'User-Agent': 'MinnanoSensei-TTS'
          },
          responseType: 'stream' // We'll stream the audio response
        }
      );

      // Generate a unique filename for the audio
      const filename = `tts_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.mp3`;
      const filepath = path.join(tempDir, filename);

      // Create write stream to save the audio file
      const writer = fs.createWriteStream(filepath);
      response.data.pipe(writer);

      // Wait for the file to be written completely
      writer.on('finish', () => {
        res.status(200).json({
          success: true,
          message: 'Speech synthesis completed',
          audioUrl: `/api/tts/audio/${filename}`,
          filename: filename,
          text: text
        });
      });

      writer.on('error', (err) => {
        console.error('Error writing audio file:', err);
        res.status(500).json({
          success: false,
          message: 'Error saving audio file'
        });
      });

    } catch (apiError) {
      console.error('Azure TTS API Error:', apiError.response?.data || apiError.message);
      
      // Return error but suggest fallback
      return res.status(500).json({
        success: false,
        message: 'Azure TTS service error',
        requiresBrowserFallback: true,
        text: text
      });
    }
  } catch (error) {
    console.error('TTS Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error during speech synthesis'
    });
  }
};

// Serve the generated audio file
exports.getAudioFile = async (req, res, next) => {
  try {
    const { filename } = req.params;
    const filepath = path.join(tempDir, filename);

    // Check if file exists
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({
        success: false,
        message: 'Audio file not found'
      });
    }

    // Set appropriate headers and send the file
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    
    const readStream = fs.createReadStream(filepath);
    readStream.pipe(res);
    
    // Optionally delete the file after serving to save space
    // readStream.on('end', () => {
    //   // Delete the file after it's served
    //   setTimeout(() => {
    //     try {
    //       fs.unlinkSync(filepath);
    //     } catch (e) {
    //       console.error('Error deleting temp audio file:', e);
    //     }
    //   }, 30000); // Delete after 30 seconds
    // });
  } catch (error) {
    console.error('Get Audio Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Cleanup function to remove old temporary files
exports.cleanupTempFiles = async () => {
  try {
    const files = fs.readdirSync(tempDir);
    const now = Date.now();
    
    files.forEach(file => {
      const filepath = path.join(tempDir, file);
      const stat = fs.statSync(filepath);
      const ageInMs = now - stat.mtimeMs;
      
      // Delete files older than 1 hour
      if (ageInMs > 3600000) {
        fs.unlinkSync(filepath);
        console.log(`Deleted old temp file: ${file}`);
      }
    });
  } catch (error) {
    console.error('Error cleaning up temp files:', error);
  }
};

// Schedule cleanup every hour
setInterval(() => {
  exports.cleanupTempFiles();
}, 3600000);
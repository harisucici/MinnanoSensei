# Configuration

This directory contains configuration settings for the MinnanoSensei backend.

## Environment Variables

Create a `.env` file in this directory with the following variables:

```env
NODE_ENV=development
PORT=8080
MONGODB_URI=mongodb://localhost:27017/minnano_sensei
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRE=30d
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
FROM_EMAIL=noreply@minnanosensei.com
MOCK_SERVICE_URL=http://localhost:4001
AZURE_TTS_KEY=your_azure_tts_subscription_key
AZURE_TTS_REGION=your_azure_region
```

> **Note**: Never commit actual credentials to the repository. The `.env` file is excluded by the `.gitignore` file.
# Text-to-Speech (TTS) Setup Guide

This guide explains how to configure the Azure Cognitive Services Text-to-Speech feature for Minnano Sensei.

## Prerequisites

1. Microsoft Azure Account with billing enabled
2. Azure Cognitive Services subscription

## Setup Steps

### 1. Create Azure Cognitive Services Resource

1. Go to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource" 
3. Search for "Cognitive Services"
4. Select "Cognitive Services" and click "Create"
5. Fill in the required information:
   - Subscription: Your Azure subscription
   - Resource group: Select or create one
   - Region: Select a region near your users
   - Name: Choose a unique name
   - Pricing tier: Select "F0" (free tier with 500,000 characters/month) or "S0" for production
6. Review and create the resource

### 2. Get Your Credentials

1. Once created, go to your Cognitive Services resource
2. Navigate to "Keys and Endpoint" in the left panel
3. Copy one of the keys (Key 1 or Key 2)
4. Copy the region name (e.g., "eastus", "westus", etc.)

### 3. Configure Environment Variables

Update your `config/config.env` file with the credentials:

```
AZURE_TTS_KEY=your_azure_subscription_key_here
AZURE_TTS_REGION=your_azure_region_here
```

Example:
```
AZURE_TTS_KEY=1234567890abcdef1234567890abcdef
AZURE_TTS_REGION=eastus
```

### 4. Restart the Server

After updating the environment variables, restart the backend server:

```bash
npm run dev
```

## How It Works

The TTS functionality follows this priority:

1. **Azure Cognitive Services**: If properly configured, uses high-quality neural voices
2. **Browser TTS**: Falls back to browser's built-in speech synthesis if Azure is not configured

## Supported Languages and Voices

The system defaults to Japanese voices:
- Primary: ja-JP-NanamiNeural (Female, high quality)
- Alternative: ja-JP-KeitaNeural (Male, high quality)

## Testing

Once configured, you can test the TTS functionality in the AI Practice Session. Each AI response will have a "🔊 Listen" button that should use the cloud-based neural voice instead of the browser fallback.

## Troubleshooting

- If you see "Azure TTS not configured, use browser fallback" in the logs, verify your credentials
- Check that the region name is correct (e.g., "eastus", not "East US")
- Verify that your Azure subscription is active and has sufficient quota
- Check that the Cognitive Services resource allows Text-to-Speech API calls
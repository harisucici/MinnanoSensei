## Pull Request Description

### Feature: Qwen AI Integration

This PR adds Qwen AI integration to the practice view, allowing users to interact with an AI-powered
Japanese language tutor.

### Changes Include:

- Added AI service for Qwen API integration
- Updated PracticeView component with AI interaction functionality
- Implemented proper error handling and fallback responses
- Added timer and session tracking features
- Refactored component structure to prevent import issues

### Testing Checklist:

- [ ] Practice view loads correctly
- [ ] User can send messages to AI
- [ ] AI responds appropriately (with valid API key)
- [ ] Fallback responses work when API is unavailable
- [ ] Chat history is maintained during session
- [ ] Session timer works correctly

### Environment Variables Required:

- `VUE_APP_QWEN_API_KEY`: Your Qwen API key from Alibaba Cloud DashScope

### Notes:

- Without a valid API key, the system will use mock responses
- Ensure CORS settings allow requests to Qwen API endpoint
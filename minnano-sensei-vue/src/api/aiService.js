import axios from 'axios';

// Configuration for Qwen API
const QWEN_API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
const QWEN_API_KEY = process.env.VUE_APP_QWEN_API_KEY || ''; // Store API key in environment variable

class AIService {
  constructor() {
    this.apiKey = QWEN_API_KEY;
    this.defaultModel = 'qwen-turbo'; // Using qwen-turbo for faster responses
    
    // Configure axios instance
    this.apiClient = axios.create({
      baseURL: QWEN_API_URL,
      timeout: 30000, // 30 second timeout
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Generate a response from Qwen based on user input
   * @param {string} userInput - The user's input message
   * @param {string} context - Additional context about the conversation
   * @param {Array} conversationHistory - Previous conversation messages
   * @returns {Promise<string>} The AI's response
   */
  async generateResponse(userInput, context = '', conversationHistory = []) {
    if (!this.apiKey) {
      console.warn('Qwen API key is not configured. Using mock response.');
      return this.generateMockResponse(userInput);
    }

    try {
      // Prepare the conversation history for the API
      const messages = [
        {
          role: 'system',
          content: `You are an expert Japanese language tutor called Sensei. Help users learn Japanese by providing accurate translations, 
          grammar explanations, and cultural context. Be encouraging and patient. Focus on helping users improve their Japanese skills. 
          ${context}`
        },
        ...conversationHistory.map(msg => ({
          role: msg.sender === 'ai' ? 'assistant' : 'user',
          content: msg.message
        })),
        {
          role: 'user',
          content: userInput
        }
      ];

      const response = await this.apiClient.post('', {
        model: this.defaultModel,
        messages: messages,
        temperature: 0.7, // Balance between creativity and consistency
        max_tokens: 500,
        stream: false
      });

      if (response.data.choices && response.data.choices.length > 0) {
        return response.data.choices[0].message.content;
      } else {
        throw new Error('Invalid response from Qwen API');
      }
    } catch (error) {
      console.error('Error calling Qwen API:', error);
      if (error.response) {
        console.error('API Response:', error.response.status, error.response.data);
      }
      // Fallback to mock response if API fails
      return this.generateMockResponse(userInput);
    }
  }

  /**
   * Generate a mock response for development/testing purposes
   * @param {string} userInput - The user's input
   * @returns {string} A simulated AI response
   */
  generateMockResponse(userInput) {
    const lowerInput = userInput.toLowerCase();
    
    // Simple pattern matching for demo purposes
    if(lowerInput.includes('hello') || lowerInput.includes('こんにちは') || lowerInput.includes('konnichiwa')) {
      return "Kon'nichiwa! こんにちは！ How can I help you with your Japanese studies today?";
    } else if(lowerInput.includes('thank') || lowerInput.includes('ありがとう') || lowerInput.includes('arigato')) {
      return "Dou itashimashite! どういたしまして！ You're welcome! Remember, 'arigatou gozaimasu' is more polite than 'arigatou'.";
    } else if(lowerInput.includes('grammar') || lowerInput.includes('grammer') || lowerInput.includes('文法')) {
      return "Let me explain a common grammar point: The particle 'wa' (は) marks the topic of the sentence. For example: 'Watashi wa gakusei desu' (私は学生です) means 'As for me, I am a student.'";
    } else if(lowerInput.includes('vocabulary') || lowerInput.includes('vocab') || lowerInput.includes('単語')) {
      return "Here's a useful vocabulary tip: The word 'kurasu' (クラス) means 'class' as in classroom. But be careful - in some contexts it can sound like 'class' in English. The Japanese word for 'class' (lesson) is 'jugyou' (授業).";
    } else if(lowerInput.includes('how') && lowerInput.includes('say')) {
      return "To form questions in Japanese, simply add 'ka' at the end of a statement. For example: 'Nihonjin desu' (You are Japanese) becomes 'Nihonjin desu ka?' (Are you Japanese?). The pitch usually rises at the end when asking.";
    } else if(lowerInput.includes('counting') || lowerInput.includes('numbers') || lowerInput.includes('数')) {
      return "In Japanese, counting depends on the objects being counted. For general objects, use: 1=ichi, 2=ni, 3=san, 4=yon, 5=go, 6=roku, 7=nana, 8=hachi, 9=kyuu, 10=juu. Note that 4 can be 'shi' but 'yon' is preferred to avoid association with death ('shi').";
    } else if(lowerInput.includes('polite') || lowerInput.includes('masu') || lowerInput.includes('formal')) {
      return "The '-masu' form is the polite non-past form. For example: 'tabemasu' (eat), 'nomimasu' (drink), 'ikimasu' (go). To make it past tense, use '-mashita': 'tabemashita' (ate), 'ikimashita' (went).";
    } else if(lowerInput.includes('particles') || lowerInput.includes('助詞')) {
      return "Particles are crucial in Japanese grammar. 'wa' (は) marks the topic, 'ga' (が) marks the subject, 'wo' (を) marks the direct object, 'ni' (に) indicates direction/time, and 'de' (で) indicates location of action. Example: 'Watashi wa gakkou de hon wo yomimasu' (I read books at school).";
    } else if(lowerInput.includes('help')) {
      return "I'm here to help you learn Japanese! You can ask me about grammar, vocabulary, pronunciation, or practice conversations. Try asking about particles, counters, or how to say something specific in Japanese.";
    } else {
      // Default responses
      const responses = [
        "That's a great question about Japanese! The particle 'wa' (は) is often used to mark the topic of discussion. For example: 'Nihon wa utsukushii desu' (Japan is beautiful).",
        "Interesting! In Japanese, context is very important. Sometimes you don't need to state the subject because it's understood from context. This is different from English.",
        "Great question! Remember that Japanese has different levels of politeness. The '-masu' form is polite, while the dictionary form is casual. Choose appropriately based on your relationship with the listener.",
        "Excellent! Japanese verbs conjugate differently than English verbs. The basic form doesn't change for person (I/you/he), unlike English. For example: 'iku' (to go) is the same regardless of who goes.",
        "Very good! Japanese has two types of adjectives: '-i' adjectives (like 'atsui' - hot) and '-na' adjectives (like 'shizuka na' - quiet). They conjugate differently."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  /**
   * Check if the API is properly configured
   * @returns {boolean} True if API key is configured, false otherwise
   */
  isConfigured() {
    return !!this.apiKey;
  }
}

// Export a singleton instance
const aiService = new AIService();
export default aiService;
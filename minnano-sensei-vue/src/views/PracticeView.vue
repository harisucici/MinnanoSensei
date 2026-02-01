<template>
  <div class="practice">
    <div v-if="isAuthenticated">
      <div class="practice-header">
        <h1>AI Practice Session</h1>
        <div class="session-info">
          <div class="current-streak">
            <span class="streak-icon">🔥</span>
            <span class="streak-count">{{ user.currentStreak }} day streak</span>
          </div>
          <div class="session-timer">
            <span class="timer-icon">⏱️</span>
            <span class="timer-count">{{ formatTime(sessionTime) }}</span>
          </div>
        </div>
      </div>
      
      <div class="practice-container">
        <div class="chat-area">
          <div id="chat-messages" ref="chatContainer">
            <div 
              v-for="message in conversation" 
              :key="message.id" 
              :class="['message', `${message.sender}-message`]"
            >
              <div class="message-content">
                <div class="message-header">
                  <strong>{{ message.sender === 'ai' ? 'Sensei:' : 'You:' }}</strong>
                  <span class="timestamp">{{ formatTimestamp(message.timestamp) }}</span>
                </div>
                <div class="message-body">{{ message.message }}</div>
                <!-- Voice player for AI messages -->
                <div v-if="message.sender === 'ai'" class="voice-control">
                  <VoicePlayer :text="message.message" lang="ja-JP" />
                </div>
              </div>
            </div>
          </div>
          
          <div class="input-area">
            <textarea 
              v-model="userInput" 
              @keydown.enter.exact.prevent="handleEnter"
              @keydown.shift.enter.exact="handleShiftEnter"
              placeholder="Type your Japanese question or practice sentence here..." 
              ref="inputArea"
            ></textarea>
            <div class="input-controls">
              <button @click="sendMessage" :disabled="isSending" class="send-btn">
                <span v-if="!isSending">Send</span>
                <span v-else>Sending...</span>
              </button>
              <button @click="clearConversation" class="clear-btn">Clear</button>
            </div>
          </div>
        </div>
        
        <div class="practice-sidebar">
          <div class="tips-section">
            <h3>Practice Tips</h3>
            <ul>
              <li>Ask about specific grammar points</li>
              <li>Request example sentences</li>
              <li>Practice conversation scenarios</li>
              <li>Ask for corrections</li>
              <li>Learn cultural context</li>
            </ul>
          </div>
          
          <div class="grammar-help">
            <h3>Quick Grammar Help</h3>
            <div class="grammar-item" @click="insertGrammar('は (wa) - Topic marker')">
              <span class="grammar-pattern">は (wa)</span>
              <span class="grammar-desc">Topic marker</span>
            </div>
            <div class="grammar-item" @click="insertGrammar('です (desu) - Copula')">
              <span class="grammar-pattern">です (desu)</span>
              <span class="grammar-desc">Copula</span>
            </div>
            <div class="grammar-item" @click="insertGrammar('を (wo) - Direct object')">
              <span class="grammar-pattern">を (wo)</span>
              <span class="grammar-desc">Direct object</span>
            </div>
          </div>
          
          <div class="session-summary">
            <h3>Today's Progress</h3>
            <div class="summary-item">
              <span class="summary-label">Messages</span>
              <span class="summary-value">{{ conversation.length }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Learning Time</span>
              <span class="summary-value">{{ formatTime(sessionTime) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Streak Maintained</span>
              <span class="summary-value">✓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="auth-required">
      <h2>Access Denied</h2>
      <p>Please sign in to access the AI practice session.</p>
      <router-link to="/login" class="cta-button">Sign In</router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import VoicePlayer from '@/components/VoicePlayer.vue'; // Import the voice player component

// Inline simplified AI service to avoid import issues
const aiService = {
  async generateResponse(userInput, context = '', conversationHistory = []) {
    // Check if API key is configured
    // Log environment variables for debugging
    console.log('Environment variables:', import.meta.env);
    console.log('VUE_APP_QWEN_API_KEY:', import.meta.env.VUE_APP_QWEN_API_KEY);
    
    const apiKey = import.meta.env.VUE_APP_QWEN_API_KEY || '';
    
    // Verify the API key format (should start with 'sk-' for Qwen)
    if (!apiKey.startsWith('sk-')) {
      console.warn('Invalid API key format. Qwen API keys should start with "sk-". Using mock response.');
      return this.generateMockResponse(userInput);
    }
    
    if (!apiKey) {
      console.warn('Qwen API key is not configured. Using mock response.');
      console.warn('Make sure your .env file has the correct variable name starting with VUE_APP_');
      return this.generateMockResponse(userInput);
    }

    try {
      // Prepare the conversation history for the API
      const messages = [
        {
          role: 'system',
          content: `You are an expert Japanese language tutor called Sensei. Help users learn Japanese by providing accurate translations, 
          grammar explanations, and cultural context. Be encouraging and patient. Focus on helping users improve their Japanese skills. 
          Respond primarily in Japanese. Only use English when explaining complex grammar concepts or when the user specifically requests English explanations.
          Always prioritize Japanese responses for all regular interactions, example sentences, and practice exercises.
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

      const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'qwen-turbo',
          messages: messages,
          temperature: 0.7,
          max_tokens: 500,
          // Add preference for Japanese language in the request
          user: "japanese-learner-mode"
        })
      });

      console.log('API Response Status:', response.status); // Debug log
      console.log('API Response Headers:', [...response.headers.entries()]); // Debug log
      
      if (!response.ok) {
        const errorText = await response.text(); // Get error details
        console.error('API Error Response:', errorText);
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response Data:', data); // Debug log
      
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      } else {
        throw new Error('Invalid response from Qwen API');
      }
    } catch (error) {
      console.error('Error calling Qwen API:', error.message || error);
      console.error('Full error details:', error);
      // Fallback to mock response if API fails
      return this.generateMockResponse(userInput);
    }
  },

  generateMockResponse(userInput) {
    const lowerInput = userInput.toLowerCase();
    
    // Simple pattern matching for demo purposes
    if(lowerInput.includes('hello') || lowerInput.includes('こんにちは') || lowerInput.includes('konnichiwa')) {
      return "こんにちは！今日はどのようにお手伝いできますか？(Hello! How can I help you today?)";
    } else if(lowerInput.includes('thank') || lowerInput.includes('ありがとう') || lowerInput.includes('arigato')) {
      return "どういたしまして！「ありがとう」よりも「ありがとうございます」の方が丁寧です。(You're welcome! 'Arigatou gozaimasu' is more polite than 'arigatou'.)";
    } else if(lowerInput.includes('grammar') || lowerInput.includes('grammer') || lowerInput.includes('文法')) {
      return "文法ポイント：助詞「は」（は）は文の主題を示します。例：「私は学生です」は「As for me, I am a student」という意味です。(Grammar point: The particle 'wa' (は) marks the topic of the sentence. For example: 'Watashi wa gakusei desu' means 'As for me, I am a student.')";
    } else if(lowerInput.includes('vocabulary') || lowerInput.includes('vocab') || lowerInput.includes('単語')) {
      return "語彙のヒント：「クラス」は教室という意味ですが、「授業」（じゅぎょう）が授業（lesson）の正しい言葉です。(Vocabulary hint: 'Kurasu' (classroom) sounds like 'class' in English, but 'jugyou' (授業) is the correct word for 'class' as in lesson.)";
    } else if(lowerInput.includes('how') && lowerInput.includes('say')) {
      return "質問を作るには、文の終わりに「か」を付けます。例：「日本人です」→「日本人ですか？」(To form questions, add 'ka' at the end of a statement. For example: 'Nihonjin desu' → 'Nihonjin desu ka?')";
    } else if(lowerInput.includes('counting') || lowerInput.includes('numbers') || lowerInput.includes('数')) {
      return "数え方は物によって異なります。一般的には：1=いち、2=に、3=さん、4=よん、5=ご、6=ろく、7=なな、8=はち、9=きゅう、10=じゅう。(Counting depends on the objects: 1=ichi, 2=ni, 3=san, 4=yon, 5=go, 6=roku, 7=nana, 8=hachi, 9=kyuu, 10=juu.)";
    } else if(lowerInput.includes('polite') || lowerInput.includes('masu') || lowerInput.includes('formal')) {
      return "「ます」形は丁寧語です。例：「食べます」「飲みます」「行きます」。過去形は「ました」：「食べました」「行きました」。(The '-masu' form is polite: 'tabemasu', 'nomimasu', 'ikimasu'. Past tense: '-mashita': 'tabemashita', 'ikimashita'.)";
    } else if(lowerInput.includes('particles') || lowerInput.includes('助詞')) {
      return "助詞は重要です。「は」（は）は主題、「が」（が）は主語、「を」（を）は目的語、「に」（に）は方向・時間、「で」（で）は動作の場所を示します。(Particles are crucial: 'wa' (topic), 'ga' (subject), 'wo' (object), 'ni' (direction/time), 'de' (location of action).)";
    } else if(lowerInput.includes('help')) {
      return "日本語学習をお手伝いします！文法、語彙、発音、会話練習について質問してください。(I'm here to help you learn Japanese! Ask me about grammar, vocabulary, pronunciation, or conversation practice.)";
    } else {
      // Default responses
      const responses = [
        "良い質問ですね！「は」（は）助詞は文の主題を示します。例：「日本は美しいです」(That's a great question! The particle 'wa' (は) marks the topic of discussion. For example: 'Nihon wa utsukushii desu' - Japan is beautiful.)",
        "日本語では文脈がとても重要です。主語を省略できることがあります。(In Japanese, context is very important. Sometimes you can omit the subject.)",
        "日本語には丁寧語と常体があります。「ます」形は丁寧語、「辞書形」は常体です。(Japanese has polite and casual forms. '-masu' form is polite, dictionary form is casual.)",
        "動詞の活用は英語とは異なります。人称によって変化しません。(Japanese verb conjugation differs from English. It doesn't change for person.)",
        "形容詞には「い」形容詞（熱い - atsui）と「な」形容詞（静かな - shizuka na）があります。(Japanese has two types of adjectives: '-i' adjectives like 'atsui' and '-na' adjectives like 'shizuka na'.)"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
};

export default {
  name: 'PracticeView',
  components: {
    VoicePlayer // Register the voice player component
  },
  data() {
    return {
      userInput: '',
      isSending: false,
      sessionTime: 0,
      timerInterval: null
    };
  },
  computed: {
    ...mapGetters(['getConversation', 'isAuthenticated', 'getUser']),
    conversation() {
      return this.getConversation;
    },
    user() {
      return this.getUser;
    }
  },
  methods: {
    ...mapActions(['addMessage', 'clearConversation']),
    async sendMessage() {
      if (!this.userInput.trim() || this.isSending) return;
      
      // Add user message
      const userMessage = {
        id: Date.now(),
        sender: 'user',
        message: this.userInput,
        timestamp: new Date()
      };
      
      this.addMessage(userMessage);
      this.userInput = '';
      this.isSending = true;
      
      try {
        // Get AI response from Qwen
        const context = `The user is learning Japanese. Provide helpful, educational responses about Japanese language, grammar, vocabulary, and culture. Keep responses informative but concise.`;
        
        // Prepare conversation history (last 5 messages to avoid exceeding token limits)
        const recentConversation = this.conversation.slice(-5);
        
        const aiResponse = await aiService.generateResponse(
          userMessage.message,
          context,
          recentConversation
        );
        
        const aiMessage = {
          id: Date.now() + 1,
          sender: 'ai',
          message: aiResponse,
          timestamp: new Date()
        };
        
        this.addMessage(aiMessage);
      } catch (error) {
        console.error('Error getting AI response:', error);
        // Fallback to mock response
        const fallbackResponse = this.generateFallbackResponse(userMessage.message);
        const aiMessage = {
          id: Date.now() + 1,
          sender: 'ai',
          message: fallbackResponse,
          timestamp: new Date()
        };
        
        this.addMessage(aiMessage);
      } finally {
        this.isSending = false;
      }
      
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    handleEnter() {
      this.sendMessage();
    },
    handleShiftEnter(event) {
      // Allow shift+enter for new line
      const textarea = event.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      
      this.userInput = text.substring(0, start) + '\n' + text.substring(end);
      
      // Move cursor to new position
      this.$nextTick(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      });
    },
    generateFallbackResponse(userInput) {
      const lowerInput = userInput.toLowerCase();
      
      // Simple pattern matching for fallback
      if(lowerInput.includes('hello') || lowerInput.includes('こんにちは') || lowerInput.includes('konnichiwa')) {
        return "こんにちは！今日はどのようにお手伝いできますか？(Hello! How can I help you today?)";
      } else if(lowerInput.includes('thank') || lowerInput.includes('ありがとう') || lowerInput.includes('arigato')) {
        return "どういたしまして！「ありがとう」よりも「ありがとうございます」の方が丁寧です。(You're welcome! 'Arigatou gozaimasu' is more polite than 'arigatou'.)";
      } else if(lowerInput.includes('grammar') || lowerInput.includes('grammer') || lowerInput.includes('文法')) {
        return "文法ポイント：助詞「は」（は）は文の主題を示します。例：「私は学生です」は「As for me, I am a student」という意味です。(Grammar point: The particle 'wa' (は) marks the topic of the sentence. For example: 'Watashi wa gakusei desu' means 'As for me, I am a student.')";
      } else if(lowerInput.includes('vocabulary') || lowerInput.includes('vocab') || lowerInput.includes('単語')) {
        return "語彙のヒント：「クラス」は教室という意味ですが、「授業」（じゅぎょう）が授業（lesson）の正しい言葉です。(Vocabulary hint: 'Kurasu' (classroom) sounds like 'class' in English, but 'jugyou' (授業) is the correct word for 'class' as in lesson.)";
      } else if(lowerInput.includes('how') && lowerInput.includes('say')) {
        return "質問を作るには、文の終わりに「か」を付けます。例：「日本人です」→「日本人ですか？」(To form questions, add 'ka' at the end of a statement. For example: 'Nihonjin desu' → 'Nihonjin desu ka?')";
      } else if(lowerInput.includes('counting') || lowerInput.includes('numbers') || lowerInput.includes('数')) {
        return "数え方は物によって異なります。一般的には：1=いち、2=に、3=さん、4=よん、5=ご、6=ろく、7=なな、8=はち、9=きゅう、10=じゅう。(Counting depends on the objects: 1=ichi, 2=ni, 3=san, 4=yon, 5=go, 6=roku, 7=nana, 8=hachi, 9=kyuu, 10=juu.)";
      } else if(lowerInput.includes('polite') || lowerInput.includes('masu') || lowerInput.includes('formal')) {
        return "「ます」形は丁寧語です。例：「食べます」「飲みます」「行きます」。過去形は「ました」：「食べました」「行きました」。(The '-masu' form is polite: 'tabemasu', 'nomimasu', 'ikimasu'. Past tense: '-mashita': 'tabemashita', 'ikimashita'.)";
      } else if(lowerInput.includes('particles') || lowerInput.includes('助詞')) {
        return "助詞は重要です。「は」（は）は主題、「が」（が）は主語、「を」（を）は目的語、「に」（に）は方向・時間、「で」（で）は動作の場所を示します。(Particles are crucial: 'wa' (topic), 'ga' (subject), 'wo' (object), 'ni' (direction/time), 'de' (location of action).)";
      } else if(lowerInput.includes('help')) {
        return "日本語学習をお手伝いします！文法、語彙、発音、会話練習について質問してください。(I'm here to help you learn Japanese! Ask me about grammar, vocabulary, pronunciation, or conversation practice.)";
      } else {
        // Default responses
        const responses = [
          "良い質問ですね！「は」（は）助詞は文の主題を示します。例：「日本は美しいです」(That's a great question! The particle 'wa' (は) marks the topic of discussion. For example: 'Nihon wa utsukushii desu' - Japan is beautiful.)",
          "日本語では文脈がとても重要です。主語を省略できることがあります。(In Japanese, context is very important. Sometimes you can omit the subject.)",
          "日本語には丁寧語と常体があります。「ます」形は丁寧語、「辞書形」は常体です。(Japanese has polite and casual forms. '-masu' form is polite, dictionary form is casual.)",
          "動詞の活用は英語とは異なります。人称によって変化しません。(Japanese verb conjugation differs from English. It doesn't change for person.)",
          "形容詞には「い」形容詞（熱い - atsui）と「な」形容詞（静かな - shizuka na）があります。(Japanese has two types of adjectives: '-i' adjectives like 'atsui' and '-na' adjectives like 'shizuka na'.)"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.chatContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },
    formatTimestamp(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },
    insertGrammar(grammarText) {
      this.userInput += grammarText;
      this.$nextTick(() => {
        this.$refs.inputArea.focus();
      });
    },
    startTimer() {
      this.timerInterval = setInterval(() => {
        this.sessionTime++;
      }, 1000);
    },
    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    }
  },
  mounted() {
    this.startTimer();
    this.$nextTick(() => {
      this.scrollToBottom();
    });
  },
  updated() {
    this.scrollToBottom();
  },
  beforeUnmount() {
    this.stopTimer();
  }
}
</script>

<style scoped>
.practice {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-size: 14px; /* Consistent font size */
}

.practice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem; /* Reduced padding */
  background: white;
  border-bottom: 1px solid #eee;
  flex-shrink: 0; /* Prevent header from shrinking */
  height: 60px; /* Set fixed height */
  min-height: 60px; /* Ensure minimum height */
}

.practice-header h1 {
  margin: 0;
  color: #333;
  font-size: 1.2rem; /* Smaller font size */
}

.session-info {
  display: flex;
  gap: 1rem; /* Reduced gap */
}

.current-streak, .session-timer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem; /* Smaller font size */
  color: #666;
}

.streak-icon, .timer-icon {
  font-size: 1rem; /* Smaller icons */
}

.practice-container {
  display: flex;
  flex: 1;
  overflow: hidden;
  height: calc(100vh - 60px); /* Account for header height */
}

.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%; /* Ensure full height */
}

#chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem; /* Reduced padding */
  background-color: #f9f9f9;
  height: calc(100% - 120px); /* Account for input area and controls */
  max-height: calc(100vh - 170px); /* Maximum height accounting for all elements */
  scroll-behavior: smooth; /* Smooth scrolling behavior */
}

.input-area {
  padding: 1rem; /* Reduced padding */
  background: white;
  border-top: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* Reduced gap */
  flex-shrink: 0; /* Prevent input area from shrinking */
  height: 120px; /* Fixed height for input area */
  min-height: 120px; /* Minimum height */
}

.message-content {
  max-width: 80%;
  padding: 0.75rem; /* Reduced padding */
  border-radius: 8px; /* Slightly smaller border radius */
  line-height: 1.4; /* Tighter line height */
  font-size: 0.9rem; /* Smaller font size */
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  font-size: 0.8rem; /* Smaller font size */
}

.timestamp {
  color: #999;
  font-weight: normal;
}

.input-area {
  padding: 1rem; /* Reduced padding */
  background: white;
  border-top: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* Reduced gap */
}

.input-area textarea {
  flex: 1;
  padding: 0.75rem; /* Reduced padding */
  border: 1px solid #ddd;
  border-radius: 4px; /* Smaller border radius */
  resize: vertical;
  min-height: 70px; /* Reduced min height */
  font-size: 0.9rem; /* Smaller font size */
  font-family: inherit;
}

.input-controls {
  display: flex;
  gap: 0.5rem;
}

.send-btn, .clear-btn {
  padding: 0.5rem 1rem; /* Reduced padding */
  border: none;
  border-radius: 4px; /* Smaller border radius */
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem; /* Smaller font size */
}

.practice-sidebar {
  width: 250px; /* Reduced width */
  background: white;
  border-left: 1px solid #eee;
  padding: 1rem; /* Reduced padding */
  overflow-y: auto;
  font-size: 0.9rem; /* Smaller font size */
}

.tips-section h3, .grammar-help h3, .session-summary h3 {
  margin-top: 0;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
  font-size: 1rem; /* Smaller font size */
}

.tips-section ul {
  padding-left: 1rem; /* Reduced padding */
  font-size: 0.85rem; /* Smaller font size */
  color: #666;
}

.grammar-help {
  margin: 1rem 0; /* Reduced margin */
}

.grammar-item {
  padding: 0.5rem; /* Reduced padding */
  border: 1px solid #eee;
  border-radius: 4px; /* Smaller border radius */
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 0.85rem; /* Smaller font size */
}

.grammar-pattern {
  font-weight: bold;
  color: #1a73e8;
  display: block;
}

.grammar-desc {
  font-size: 0.75rem; /* Smaller font size */
  color: #666;
}

.session-summary {
  margin-top: 1rem; /* Reduced margin */
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 0; /* Reduced padding */
  border-bottom: 1px solid #f5f5f5;
}

.summary-label {
  color: #666;
  font-size: 0.8rem; /* Smaller font size */
}

.summary-value {
  font-weight: 500;
  color: #333;
}

.auth-required {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  padding: 1.5rem; /* Reduced padding */
  background: #f5f7fa;
  font-size: 14px; /* Consistent font size */
}

.auth-required h2 {
  color: #1a73e8;
  margin-bottom: 1rem;
  font-size: 1.2rem; /* Smaller font size */
}

.auth-required p {
  margin-bottom: 1.5rem;
  color: #666;
  max-width: 400px;
  font-size: 0.9rem; /* Smaller font size */
}

.cta-button {
  background-color: #1a73e8;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem; /* Reduced padding */
  font-size: 1rem; /* Appropriate font size */
  border-radius: 20px; /* More rounded */
  cursor: pointer;
  font-weight: bold;
  text-decoration: none;
  display: inline-block;
  transition: transform 0.3s, box-shadow 0.3s;
}
</style>

.message {
  margin-bottom: 1.5rem;
  display: flex;
}

.user-message {
  justify-content: flex-end;
}

.ai-message {
  justify-content: flex-start;
}

.message-content {
  max-width: 80%;
  padding: 1rem;
  border-radius: 10px;
  line-height: 1.5;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.timestamp {
  color: #999;
  font-weight: normal;
}

.user-message .message-content {
  background-color: #1a73e8;
  color: white;
  border-bottom-right-radius: 0;
}

.ai-message .message-content {
  background-color: #e8f0fe;
  color: #202124;
  border-bottom-left-radius: 0;
}

.input-area {
  padding: 1.5rem;
  background: white;
  border-top: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-area textarea {
  flex: 1;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.input-controls {
  display: flex;
  gap: 0.5rem;
}

.send-btn, .clear-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
}

.send-btn {
  background-color: #1a73e8;
  color: white;
}

.send-btn:hover:not(:disabled) {
  background-color: #0d62d0;
}

.clear-btn {
  background-color: #f0f0f0;
  color: #333;
}

.clear-btn:hover {
  background-color: #e0e0e0;
}

.send-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.practice-sidebar {
  width: 300px;
  background: white;
  border-left: 1px solid #eee;
  padding: 1.5rem;
  overflow-y: auto;
}

.tips-section h3, .grammar-help h3, .session-summary h3 {
  margin-top: 0;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.tips-section ul {
  padding-left: 1.2rem;
  font-size: 0.9rem;
  color: #666;
}

.grammar-help {
  margin: 1.5rem 0;
}

.grammar-item {
  padding: 0.75rem;
  border: 1px solid #eee;
  border-radius: 5px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.grammar-item:hover {
  background-color: #f5f5f5;
}

.grammar-pattern {
  font-weight: bold;
  color: #1a73e8;
  display: block;
}

.grammar-desc {
  font-size: 0.8rem;
  color: #666;
}

.session-summary {
  margin-top: 1.5rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f5f5f5;
}

.summary-label {
  color: #666;
  font-size: 0.9rem;
}

.summary-value {
  font-weight: 500;
  color: #333;
}

.auth-required {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  padding: 2rem;
  background: #f5f7fa;
}

.auth-required h2 {
  color: #1a73e8;
  margin-bottom: 1rem;
}

.auth-required p {
  margin-bottom: 1.5rem;
  color: #666;
  max-width: 400px;
}

.cta-button {
  background-color: #1a73e8;
  color: white;
  border: none;
  padding: 12px 30px;
  font-size: 1.1rem;
  border-radius: 30px;
  cursor: pointer;
  font-weight: bold;
  text-decoration: none;
  display: inline-block;
  transition: transform 0.3s, box-shadow 0.3s;
}

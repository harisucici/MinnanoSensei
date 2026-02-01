<template>
  <div class="voice-player" v-if="showControls">
    <button 
      @click="speak(text)" 
      :disabled="isPlaying || isLoading" 
      class="speak-btn" 
      :title="buttonTitle"
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false"
    >
      <span v-if="isLoading">⏳</span>
      <span v-else-if="!isPlaying">🔊</span>
      <span v-else>⏹️</span>
      <span v-if="isHovering && !isLoading">{{ isPlaying ? 'Stop' : 'Listen' }}</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'VoicePlayer',
  props: {
    text: {
      type: String,
      required: true
    },
    lang: {
      type: String,
      default: 'ja-JP' // Japanese by default
    },
    showControls: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isPlaying: false,
      isLoading: false,
      isHovering: false,
      audio: null
    };
  },
  computed: {
    buttonTitle() {
      if (this.isLoading) return 'Processing speech...';
      return this.isPlaying ? 'Stop pronunciation' : 'Listen to pronunciation';
    }
  },
  methods: {
    async speak(text) {
      if (this.isPlaying) {
        this.stop();
        return;
      }

      // Clean the text to focus on Japanese content for better pronunciation
      const cleanedText = this.cleanJapaneseText(text);
      
      this.isLoading = true;
      
      try {
        // Call backend TTS service
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/tts/synthesize`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: cleanedText,
            language: this.lang,
            voice: 'ja-JP-NanamiNeural' // High quality Japanese neural voice
          })
        });
        
        const result = await response.json();
        
        if (result.success) {
          if (result.requiresBrowserFallback) {
            // If backend indicates fallback is needed, use browser TTS
            this.fallbackSpeak(cleanedText);
          } else if (result.audioUrl) {
            // Play the audio from the backend service
            this.playBackendAudio(result.audioUrl);
          } else {
            // Default to browser fallback if no audio URL returned
            this.fallbackSpeak(cleanedText);
          }
        } else {
          // Use fallback if backend service fails
          this.fallbackSpeak(cleanedText);
        }
      } catch (error) {
        console.error('TTS API Error:', error);
        // Use fallback if API fails
        this.fallbackSpeak(cleanedText);
      } finally {
        this.isLoading = false;
      }
    },
    
    async playBackendAudio(audioUrl) {
      // Create new audio element
      this.audio = new Audio(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}${audioUrl}`);
      
      this.audio.onplay = () => {
        this.isPlaying = true;
      };
      
      this.audio.onended = () => {
        this.isPlaying = false;
      };
      
      this.audio.onerror = (error) => {
        console.error('Audio playback error:', error);
        this.isPlaying = false;
        // Fallback to browser TTS if audio playback fails
        this.fallbackSpeak(this.text);
      };
      
      try {
        await this.audio.play();
      } catch (error) {
        console.error('Error playing audio:', error);
        this.isPlaying = false;
        // Fallback to browser TTS if audio playback fails
        this.fallbackSpeak(this.text);
      }
    },
    
    async fallbackSpeak(text) {
      if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        if (this.audio) {
          this.audio.pause();
          this.audio = null;
        }
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = this.lang;
        
        // Try to get a Japanese voice specifically
        const voices = speechSynthesis.getVoices();
        const japaneseVoice = voices.find(voice => 
          voice.lang.includes('ja') || 
          voice.name.toLowerCase().includes('japanese') ||
          voice.name.toLowerCase().includes('kyoko') ||
          voice.name.toLowerCase().includes('ocho') ||
          voice.name.toLowerCase().includes('haruka') ||
          voice.name.toLowerCase().includes('hikari')
        );
        
        if (japaneseVoice) {
          utterance.voice = japaneseVoice;
        }
        
        // Configure voice properties for clear pronunciation
        utterance.rate = 0.85; // Slightly slower for clarity
        utterance.pitch = 1.0;
        utterance.volume = 0.9;
        
        utterance.onstart = () => {
          this.isPlaying = true;
        };
        
        utterance.onend = () => {
          this.isPlaying = false;
        };
        
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
          this.isPlaying = false;
        };
        
        speechSynthesis.speak(utterance);
      } else {
        console.error('Speech Synthesis not supported in this browser');
        alert('Text-to-speech is not supported in your browser.');
      }
    },
    
    stop() {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        this.isPlaying = false;
      }
    },
    
    cleanJapaneseText(text) {
      // Extract Japanese characters (hiragana, katakana, kanji) and common punctuation
      // Keep Latin characters only if they're part of romaji or mixed text
      const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\u3400-\u4DBF\uFF66-\uFF9F\u3000-\u303F\uFF00-\uFFEFa-zA-Z0-9\s\.,!?;:\-'"()[\]{}]+/g;
      const matches = text.match(japaneseRegex);
      
      if (matches) {
        // Join the matches and clean up extra spaces
        let cleaned = matches.join(' ').replace(/\s+/g, ' ').trim();
        
        // If the cleaned text is mostly non-Japanese, return the original
        const japaneseCharCount = (cleaned.match(/[\u3040-\u30FF\u4E00-\u9FFF]/g) || []).length;
        const totalCharCount = cleaned.length;
        
        // If less than 30% of characters are Japanese, return original text
        if (totalCharCount > 0 && japaneseCharCount / totalCharCount < 0.3) {
          return text;
        }
        
        return cleaned;
      }
      
      // If no Japanese characters found, return original
      return text;
    }
  },
  mounted() {
    // Load voices when component mounts
    if ('speechSynthesis' in window) {
      // Some browsers need a little delay to load voices
      setTimeout(() => {
        speechSynthesis.getVoices();
      }, 100);
      
      speechSynthesis.onvoiceschanged = () => {
        // Voices loaded - no action needed, they'll be used when speak is called
      };
    }
  },
  beforeUnmount() {
    this.stop();
  }
};
</script>

<style scoped>
.voice-player {
  display: inline-block;
  margin-left: 0.5rem;
  vertical-align: middle;
}

.speak-btn {
  background: none;
  border: 1px solid #ddd;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  background-color: #f8f9fa;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.speak-btn:hover {
  background-color: #e9ecef;
  border-color: #adb5bd;
}

.speak-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #f8f9fa;
}

.speak-btn span {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
</style>
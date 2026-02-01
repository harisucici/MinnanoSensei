<template>
  <div class="auth-container">
    <div class="auth-form">
      <h2>{{ isLogin ? 'Welcome Back' : 'Join Minnano Sensei' }}</h2>
      <p class="subtitle">{{ isLogin ? 'Sign in to continue your Japanese learning journey' : 'Create an account to start learning Japanese' }}</p>
      
      <!-- Toggle between login and register -->
      <div class="auth-toggle">
        <button 
          :class="['toggle-btn', { active: isLogin }]" 
          @click="setLoginMode(true)"
        >
          Sign In
        </button>
        <button 
          :class="['toggle-btn', { active: !isLogin }]" 
          @click="setLoginMode(false)"
        >
          Register
        </button>
      </div>
      
      <!-- Social Login Buttons -->
      <div class="social-login">
        <button class="social-btn google" @click="socialLogin('google')">
          <span class="social-icon">🔍</span> Continue with Google
        </button>
        <button class="social-btn apple" @click="socialLogin('apple')">
          <span class="social-icon">🍎</span> Continue with Apple
        </button>
        <button class="social-btn wechat" @click="socialLogin('wechat')">
          <span class="social-icon">💬</span> Continue with WeChat
        </button>
        <button class="social-btn line" @click="socialLogin('line')">
          <span class="social-icon">💬</span> Continue with LINE
        </button>
      </div>
      
      <div class="divider">
        <span>OR</span>
      </div>
      
      <!-- Email/Phone Login Form -->
      <form @submit.prevent="handleSubmit" class="main-form">
        <!-- Email/Phone Field -->
        <div class="input-group">
          <label for="identifier">Email or Phone Number</label>
          <input
            id="identifier"
            v-model="credentials.identifier"
            type="text"
            :placeholder="isLogin ? 'Enter email or phone' : 'Enter email or phone'"
            required
          />
        </div>
        
        <!-- Password Field -->
        <div class="input-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="credentials.password"
            type="password"
            placeholder="Enter password"
            required
            minlength="6"
          />
        </div>
        
        <!-- Confirm Password for Registration -->
        <div v-if="!isLogin" class="input-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="credentials.confirmPassword"
            type="password"
            placeholder="Confirm password"
            required
            minlength="6"
          />
        </div>
        
        <!-- Native Language Selection for Registration -->
        <div v-if="!isLogin" class="input-group">
          <label for="nativeLanguage">Native Language</label>
          <select id="nativeLanguage" v-model="credentials.nativeLanguage" required>
            <option value="">Select your native language</option>
            <option value="English">English</option>
            <option value="Chinese">中文</option>
            <option value="Korean">한국어</option>
            <option value="Vietnamese">Tiếng Việt</option>
            <option value="Thai">ภาษาไทย</option>
            <option value="Indonesian">Bahasa Indonesia</option>
            <option value="Spanish">Español</option>
            <option value="French">Français</option>
            <option value="German">Deutsch</option>
            <option value="Russian">Русский</option>
          </select>
        </div>
        
        <!-- Learning Goal Selection for Registration -->
        <div v-if="!isLogin" class="input-group">
          <label for="learningGoal">Learning Goal</label>
          <select id="learningGoal" v-model="credentials.learningGoal" required>
            <option value="">Select your learning goal</option>
            <option value="Travel Communication">Travel Communication</option>
            <option value="Business Japanese">Business Japanese</option>
            <option value="Academic Studies">Academic Studies</option>
            <option value="General Conversation">General Conversation</option>
            <option value=" JLPT Preparation">JLPT Preparation</option>
          </select>
        </div>
        
        <!-- Forgot Password Link (only for login) -->
        <div v-if="isLogin" class="form-footer">
          <a href="#" @click.prevent="forgotPassword" class="forgot-password">Forgot Password?</a>
        </div>
        
        <!-- Submit Button -->
        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account') }}
        </button>
      </form>
      
      <!-- Error Message -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'LoginForm',
  setup() {
    const router = useRouter();
    const store = useStore();
    
    const isLogin = ref(true);
    const loading = ref(false);
    const error = ref('');
    
    const credentials = reactive({
      identifier: '',
      password: '',
      confirmPassword: '',
      nativeLanguage: '',
      learningGoal: ''
    });
    
    const setLoginMode = (login) => {
      isLogin.value = login;
      error.value = '';
      credentials.identifier = '';
      credentials.password = '';
      credentials.confirmPassword = '';
      credentials.nativeLanguage = '';
      credentials.learningGoal = '';
    };
    
    const validateForm = () => {
      if (!isLogin.value) {
        // Validation for registration
        if (credentials.password !== credentials.confirmPassword) {
          error.value = 'Passwords do not match';
          return false;
        }
        if (!credentials.nativeLanguage) {
          error.value = 'Please select your native language';
          return false;
        }
        if (!credentials.learningGoal) {
          error.value = 'Please select your learning goal';
          return false;
        }
      }
      
      // Basic validation for both login and register
      if (credentials.password.length < 6) {
        error.value = 'Password must be at least 6 characters';
        return false;
      }
      
      return true;
    };
    
    const handleSubmit = async () => {
      if (!validateForm()) return;
      
      loading.value = true;
      error.value = '';
      
      try {
        if (isLogin.value) {
          // Login logic
          await store.dispatch('login', {
            identifier: credentials.identifier,
            password: credentials.password
          });
          
          // Redirect to intended destination or home
          const route = router.currentRoute.value;
          const redirect = route.query.redirect || '/';
          router.push(redirect);
        } else {
          // Registration logic
          await store.dispatch('register', {
            email: credentials.identifier.includes('@') ? credentials.identifier : null,
            phone: credentials.identifier.includes('@') ? null : credentials.identifier,
            password: credentials.password,
            name: credentials.identifier.includes('@') ? credentials.identifier.split('@')[0] : credentials.identifier,
            nativeLanguage: credentials.nativeLanguage,
            learningGoal: credentials.learningGoal
          });
          
          // Redirect to home after registration
          router.push('/');
        }
      } catch (err) {
        error.value = err.message || 'An error occurred';
      } finally {
        loading.value = false;
      }
    };
    
    const socialLogin = async (provider) => {
      loading.value = true;
      error.value = '';
      
      try {
        // Mock social login implementation
        console.log(`Attempting ${provider} login...`);
        
        // Create mock user data based on provider
        let mockUser = {
          name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
          email: `${provider}@example.com`,
          nativeLanguage: 'English',
          learningGoal: 'General Conversation',
          level: 'Beginner (N5-N4)',
          completedLessons: 0,
          totalLessons: 20,
          totalStudyTime: 0,
          currentStreak: 0,
          achievements: [],
          authToken: `mock_${provider}_token_${Date.now()}`
        };
        
        // For WeChat, we might have different naming
        if (provider === 'wechat') {
          mockUser.name = '微信用户';
          mockUser.email = 'wechat@example.com';
        }
        
        // Update user in store
        await store.dispatch('loginSuccess', mockUser);
        
        // Redirect to dashboard
        const redirect = router.currentRoute.value.query.redirect || '/';
        router.push(redirect);
        
        console.log(`${provider} login successful`);
      } catch (err) {
        error.value = `Social login with ${provider} failed`;
      } finally {
        loading.value = false;
      }
    };
    
    const forgotPassword = () => {
      alert('Password reset functionality would be implemented here. In a real app, this would send a reset link to the user\'s email.');
    };
    
    // Mock login function
    const loginUser = async (identifier, password) => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation - accept any credentials for demo
      if (identifier && password) {
        // Create mock user data
        const mockUser = {
          name: '山田太郎',
          email: identifier.includes('@') ? identifier : `user+${identifier}@example.com`,
          nativeLanguage: 'English',
          learningGoal: 'General Conversation',
          level: 'Beginner (N5-N4)',
          completedLessons: 3,
          totalLessons: 20,
          totalStudyTime: 42,
          currentStreak: 7,
          achievements: [
            { id: 1, title: 'First Steps', description: 'Completed your first lesson', icon: 'verified', earned: true },
            { id: 2, title: 'Fire Starter', description: 'Maintained a 7-day study streak', icon: 'local_fire_department', earned: true },
            { id: 3, title: 'Scholar', description: 'Completed 5 lessons', icon: 'school', earned: true }
          ]
        };
        
        // Update user in store
        store.dispatch('updateUser', mockUser);
        
        // Redirect to dashboard
        router.push('/');
      } else {
        throw new Error('Invalid credentials');
      }
    };
    
    // Mock registration function
    const registerUser = async (userData) => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create mock user data after registration
      const mockUser = {
        name: userData.identifier.includes('@') ? userData.identifier.split('@')[0] : userData.identifier,
        email: userData.identifier.includes('@') ? userData.identifier : `user+${userData.identifier}@example.com`,
        nativeLanguage: userData.nativeLanguage,
        learningGoal: userData.learningGoal,
        level: 'Beginner (N5-N4)',
        completedLessons: 0,
        totalLessons: 20,
        totalStudyTime: 0,
        currentStreak: 0,
        achievements: []
      };
      
      // Update user in store
      store.dispatch('updateUser', mockUser);
      
      // Redirect to dashboard
      router.push('/');
    };
    
    return {
      isLogin,
      loading,
      error,
      credentials,
      setLoginMode,
      handleSubmit,
      socialLogin,
      forgotPassword
    };
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
}

.auth-form {
  width: 100%;
  max-width: 450px;
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.auth-form h2 {
  text-align: center;
  color: #1a73e8;
  margin-bottom: 0.5rem;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
}

.auth-toggle {
  display: flex;
  background: #f5f7fa;
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 1.5rem;
}

.toggle-btn {
  flex: 1;
  padding: 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 6px;
  font-weight: 500;
  color: #666;
  transition: all 0.3s;
}

.toggle-btn.active {
  background: white;
  color: #1a73e8;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.social-login {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 1.5rem;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
}

.social-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.social-btn.google { border-color: #dd4b39; color: #dd4b39; }
.social-btn.apple { border-color: #000; color: #000; }
.social-btn.wechat { border-color: #07c160; color: #07c160; }
.social-btn.line { border-color: #06c755; color: #06c755; }

.divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #ddd;
}

.divider span {
  padding: 0 10px;
  color: #666;
  font-size: 14px;
}

.main-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-group label {
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.input-group input,
.input-group select {
  padding: 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.input-group input:focus,
.input-group select:focus {
  outline: none;
  border-color: #1a73e8;
  box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
}

.form-footer {
  display: flex;
  justify-content: flex-end;
}

.forgot-password {
  color: #1a73e8;
  text-decoration: none;
  font-size: 14px;
}

.forgot-password:hover {
  text-decoration: underline;
}

.submit-btn {
  width: 100%;
  padding: 16px;
  background: #1a73e8;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background: #0d62d0;
}

.submit-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.error-message {
  margin-top: 1rem;
  padding: 12px;
  background: #ffebee;
  color: #c62828;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
}

.social-icon {
  font-size: 18px;
}
</style>
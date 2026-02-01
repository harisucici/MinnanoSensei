<template>
  <div class="home">
    <div v-if="isAuthenticated && user && userStats">
      <div class="dashboard-header">
        <div class="greeting">
          <h1>Hello, {{ user.name.split(' ')[0] }}!</h1>
          <p class="subheading">Ready to continue your Japanese learning journey?</p>
        </div>
        <div class="quick-actions">
          <button @click="continueLearning" class="action-btn primary">Continue Learning</button>
          <button @click="startPractice" class="action-btn secondary">Practice with AI</button>
        </div>
      </div>

      <section class="progress-overview">
        <div class="stats-container">
          <div class="stat-card primary">
            <div class="stat-icon">📚</div>
            <div class="stat-content">
              <div class="stat-value">{{ userStats.completedLessons }}/{{ userStats.totalLessons }}</div>
              <div class="stat-label">Lessons Completed</div>
            </div>
          </div>
          <div class="stat-card secondary">
            <div class="stat-icon">⏱️</div>
            <div class="stat-content">
              <div class="stat-value">{{ userStats.totalStudyTime }}h</div>
              <div class="stat-label">Study Time</div>
            </div>
          </div>
          <div class="stat-card accent">
            <div class="stat-icon">🔥</div>
            <div class="stat-content">
              <div class="stat-value">{{ userStats.currentStreak }} days</div>
              <div class="stat-label">Current Streak</div>
            </div>
          </div>
          <div class="stat-card neutral">
            <div class="stat-icon">🎯</div>
            <div class="stat-content">
              <div class="stat-value">{{ userStats.progressPercentage }}%</div>
              <div class="stat-label">Overall Progress</div>
            </div>
          </div>
        </div>
        
        <div class="progress-chart">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: userStats.progressPercentage + '%' }"></div>
          </div>
          <p>{{ userStats.completedLessons }} of {{ userStats.totalLessons }} lessons completed</p>
        </div>
      </section>

      <section class="recommended">
        <h2>Recommended for You</h2>
        <div class="recommendations-grid">
          <div class="recommendation-card" @click="goToNextLesson">
            <div class="rec-icon">📖</div>
            <h3>Next Lesson</h3>
            <p>Continue with {{ getNextLessonTitle }}</p>
            <div class="rec-meta">
              <span class="difficulty">{{ getNextLessonLevel }}</span>
            </div>
          </div>
          <div class="recommendation-card" @click="startPractice">
            <div class="rec-icon">🤖</div>
            <h3>AI Practice Session</h3>
            <p>Practice your Japanese with our AI tutor</p>
            <div class="rec-meta">
              <span class="topic">Conversation</span>
            </div>
          </div>
          <div class="recommendation-card" @click="reviewAchievements">
            <div class="rec-icon">🏆</div>
            <h3>Your Achievements</h3>
            <p>Check your earned badges and milestones</p>
            <div class="rec-meta">
              <span class="count">{{ user.achievements ? user.achievements.length : 0 }} badges</span>
            </div>
          </div>
        </div>
      </section>

      <section class="features">
        <h2>Learning Features</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📋</div>
            <h3>Structured Curriculum</h3>
            <p>Follow the proven Minna no Nihongo textbook series with guided lessons</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🤖</div>
            <h3>AI Tutor</h3>
            <p>Get personalized feedback from your virtual Japanese sensei</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Progress Tracking</h3>
            <p>Monitor your learning journey with detailed statistics</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎮</div>
            <h3>Achievements</h3>
            <p>Earn badges and celebrate your learning milestones</p>
          </div>
        </div>
      </section>
    </div>
    <div v-else class="welcome-guest-full">
      <section class="hero">
        <h2>Master Japanese with AI</h2>
        <p>Personalized lessons based on the Minna no Nihongo curriculum</p>
        <router-link to="/login" class="cta-button">Sign In to Start Learning</router-link>
      </section>

      <section class="features-preview">
        <h2>Learning Made Effective</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📋</div>
            <h3>Structured Curriculum</h3>
            <p>Follow the proven Minna no Nihongo textbook series with guided lessons</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🤖</div>
            <h3>AI Tutor</h3>
            <p>Get personalized feedback from your virtual Japanese sensei</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Progress Tracking</h3>
            <p>Monitor your learning journey with detailed statistics</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎮</div>
            <h3>Achievements</h3>
            <p>Earn badges and celebrate your learning milestones</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'HomeView',
  computed: {
    ...mapGetters(['isAuthenticated', 'getUser', 'getUserStats', 'getLessons']),
    user() {
      return this.getUser;
    },
    userStats() {
      return this.getUserStats;
    },
    getNextLessonTitle() {
      // Return the title of the next lesson to complete
      if (this.user && this.user.completedLessons >= 0) {
        const nextLessonIndex = this.user.completedLessons;
        const lessons = this.getLessons;
        if (nextLessonIndex < lessons.length) {
          return lessons[nextLessonIndex].title;
        }
        return "Review Lessons";
      }
      return "はじめての日本語";
    },
    getNextLessonLevel() {
      // Return the level of the next lesson
      if (this.user && this.user.completedLessons >= 0) {
        const nextLessonIndex = this.user.completedLessons;
        const lessons = this.getLessons;
        if (nextLessonIndex < lessons.length) {
          return "N5 Level";
        }
      }
      return "N5 Level";
    }
  },
  methods: {
    continueLearning() {
      if (this.user && this.user.completedLessons > 0) {
        this.$router.push('/lessons');
      } else {
        this.goToFirstLesson();
      }
    },
    startPractice() {
      this.$router.push('/practice');
    },
    goToNextLesson() {
      this.$router.push('/lessons');
    },
    goToFirstLesson() {
      this.$router.push('/lessons');
    },
    reviewAchievements() {
      this.$router.push('/profile');
    }
  },
  created() {
    // Ensure Vuex store is initialized
    if (!this.isAuthenticated) {
      // If user is not authenticated, ensure we're not blocking unauthenticated access
      // The template already handles both authenticated and unauthenticated states
    }
  }
}
</script>

<style scoped>
.home {
  width: 100%;
  padding: 0 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem 0;
  flex-wrap: wrap;
  gap: 1rem;
}

.greeting h1 {
  margin: 0;
  color: #333;
  font-size: 2rem;
}

.subheading {
  margin: 0.5rem 0 0;
  color: #666;
  font-size: 1.1rem;
}

.quick-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s;
  border: none;
  font-size: 1rem;
}

.action-btn.primary {
  background-color: #1a73e8;
  color: white;
}

.action-btn.primary:hover {
  background-color: #0d62d0;
  transform: translateY(-2px);
}

.action-btn.secondary {
  background-color: white;
  color: #1a73e8;
  border: 1px solid #1a73e8;
}

.action-btn.secondary:hover {
  background-color: #f5f9ff;
  transform: translateY(-2px);
}

.progress-overview {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  margin-bottom: 2rem;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 8px;
  color: white;
}

.stat-card.primary {
  background: linear-gradient(135deg, #1a73e8, #3a9dff);
}

.stat-card.secondary {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.stat-card.accent {
  background: linear-gradient(135deg, #f093fb, #f5576c);
}

.stat-card.neutral {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
}

.stat-icon {
  font-size: 1.5rem;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: bold;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

.progress-chart {
  margin-top: 1.5rem;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background-color: #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1a73e8, #667eea);
  transition: width 0.4s ease;
}

.progress-chart p {
  text-align: center;
  margin-top: 0.75rem;
  color: #666;
  font-size: 0.9rem;
}

.recommended {
  margin: 2rem 0;
}

.recommended h2 {
  color: #333;
  margin-bottom: 1.5rem;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.recommendation-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #eee;
}

.recommendation-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  border-color: #1a73e8;
}

.rec-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.recommendation-card h3 {
  margin: 0 0 0.5rem;
  color: #333;
}

.recommendation-card p {
  margin: 0 0 1rem;
  color: #666;
  font-size: 0.95rem;
}

.rec-meta {
  display: flex;
  gap: 0.5rem;
}

.rec-meta span {
  background: #f0f7ff;
  color: #1a73e8;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.features, .features-preview {
  margin: 3rem 0;
}

.features h2, .features-preview h2 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  background: white;
  padding: 1.75rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  text-align: center;
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: #1a73e8;
  margin: 1rem 0 0.75rem;
}

.feature-card p {
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.hero {
  text-align: center;
  padding: 3rem 0;
  background: linear-gradient(135deg, #1a73e8, #667eea);
  color: white;
  border-radius: 10px;
  margin-bottom: 3rem;
}

.hero h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}

.cta-button {
  background-color: #fff;
  color: #1a73e8;
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

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.welcome-guest-full {
  width: 100%;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .greeting {
    text-align: center;
  }
  
  .quick-actions {
    justify-content: center;
  }
  
  .stats-container {
    grid-template-columns: 1fr;
  }
}
</style>
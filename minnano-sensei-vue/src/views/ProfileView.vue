<template>
  <div class="profile">
    <div v-if="isAuthenticated && user">
      <h1>Your Learning Dashboard</h1>
      <div class="dashboard-layout">
        <!-- Profile Card -->
        <div class="profile-section">
          <div class="profile-card">
            <div class="avatar">
              <span class="initials">{{ userInitials }}</span>
            </div>
            <div class="user-info">
              <h3>{{ user.name }}</h3>
              <p><strong>Email:</strong> {{ user.email }}</p>
              <p><strong>Native Language:</strong> {{ user.nativeLanguage }}</p>
              <p><strong>Learning Goal:</strong> {{ user.learningGoal }}</p>
              <p><strong>Current Level:</strong> {{ user.level }}</p>
            </div>
            
            <div class="profile-actions">
              <button @click="editProfile" class="btn btn-secondary">Edit Profile</button>
              <button @click="changePassword" class="btn btn-secondary">Change Password</button>
            </div>
          </div>
        </div>
        
        <!-- Stats and Achievements Side by Side -->
        <div class="side-sections">
          <div class="stats-section">
            <h3>Learning Statistics</h3>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value">{{ userStats.completedLessons }}</div>
                <div class="stat-label">Lessons</div>
                <div class="stat-sublabel">Completed</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">{{ userStats.totalStudyTime }}</div>
                <div class="stat-label">Hours</div>
                <div class="stat-sublabel">Studied</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">{{ userStats.currentStreak }}</div>
                <div class="stat-label">Day</div>
                <div class="stat-sublabel">Streak</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">{{ userStats.progressPercentage }}%</div>
                <div class="stat-label">Overall</div>
                <div class="stat-sublabel">Progress</div>
              </div>
            </div>
            
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: userStats.progressPercentage + '%' }"></div>
            </div>
            <p class="progress-text">{{ userStats.completedLessons }} of {{ userStats.totalLessons }} lessons completed</p>
          </div>
          
          <div class="achievements-section">
            <h3>Achievements</h3>
            <div class="achievements-grid" v-if="user.achievements && user.achievements.length > 0">
              <div 
                v-for="achievement in user.achievements" 
                :key="achievement.id" 
                class="achievement-card"
                :class="{ earned: achievement.earned }"
              >
                <div class="achievement-icon">{{ getIconForAchievement(achievement.icon) }}</div>
                <div class="achievement-details">
                  <h4 class="achievement-title">{{ achievement.title }}</h4>
                  <p class="achievement-desc">{{ achievement.description }}</p>
                </div>
                <div v-if="achievement.earned" class="achievement-status">
                  <span class="earned-badge">Earned</span>
                </div>
              </div>
            </div>
            <div v-else class="no-achievements">
              <p>No achievements yet. Keep learning to earn badges!</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Recommended Next Steps -->
      <div class="recommendations">
        <h3>Continue Your Journey</h3>
        <div class="recommendation-cards">
          <div class="recommendation-card" @click="goToNextLesson">
            <h4>Next Lesson</h4>
            <p>Continue with your structured learning path</p>
            <div class="card-icon">📚</div>
          </div>
          <div class="recommendation-card" @click="goToPractice">
            <h4>AI Practice</h4>
            <p>Practice what you've learned with our AI tutor</p>
            <div class="card-icon">🤖</div>
          </div>
          <div class="recommendation-card" @click="reviewProgress">
            <h4>Review Progress</h4>
            <p>See detailed analytics of your learning</p>
            <div class="card-icon">📊</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="auth-required">
      <h2>Access Denied</h2>
      <p>Please sign in to view your profile and learning dashboard.</p>
      <router-link to="/login" class="cta-button">Sign In</router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ProfileView',
  computed: {
    ...mapGetters(['getUser', 'isAuthenticated', 'getUserStats']),
    user() {
      return this.getUser;
    },
    userStats() {
      return this.getUserStats;
    },
    userInitials() {
      if (!this.user || !this.user.name) return 'U';
      const names = this.user.name.split(' ');
      return names.map(name => name.charAt(0)).join('').substring(0, 2).toUpperCase();
    }
  },
  methods: {
    getIconForAchievement(iconName) {
      const icons = {
        verified: '✅',
        local_fire_department: '🔥',
        school: '🎓',
        mic: '🎤',
        emoji_events: '🏆',
        star: '⭐'
      };
      return icons[iconName] || '🏆';
    },
    editProfile() {
      alert('Profile editing functionality would be implemented here. In a real app, this would open a modal or navigate to an edit page.');
    },
    changePassword() {
      alert('Password change functionality would be implemented here. In a real app, this would open a password change form.');
    },
    goToNextLesson() {
      // Find the next incomplete lesson
      this.$router.push('/lessons');
    },
    goToPractice() {
      this.$router.push('/practice');
    },
    reviewProgress() {
      alert('Detailed progress review would be shown here. In a real app, this would show comprehensive analytics about your learning journey.');
    }
  }
}
</script>

<style scoped>
.profile {
  width: 100%;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (min-width: 992px) {
  .dashboard-layout {
    flex-direction: row;
  }
  
  .profile-section {
    flex: 1;
    min-width: 300px;
  }
  
  .side-sections {
    flex: 1;
    min-width: 300px;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
}

.profile-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
  text-align: center;
  height: 100%;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #1a73e8;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 2rem;
  color: white;
}

.user-info {
  text-align: left;
  margin: 1.5rem 0;
}

.user-info h3 {
  margin: 0 0 1rem;
  color: #333;
}

.user-info p {
  margin: 0.5rem 0;
  color: #666;
}

.profile-actions {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  text-align: center;
  transition: background-color 0.3s;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

.stats-section {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
  height: 100%;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin: 1.5rem 0;
}

.stat-card {
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #1a73e8;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.stat-sublabel {
  font-size: 0.8rem;
  color: #999;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  margin: 1.5rem 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1a73e8, #667eea);
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}

.achievements-section {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
}

.achievements-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.achievement-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  opacity: 0.6;
}

.achievement-card.earned {
  opacity: 1;
  background: #e8f5e9;
  border: 1px solid #c8e6c9;
}

.achievement-icon {
  font-size: 2rem;
  min-width: 40px;
  text-align: center;
}

.achievement-details {
  flex: 1;
}

.achievement-title {
  margin: 0 0 0.25rem;
  color: #2e7d32;
  font-size: 1rem;
}

.achievement-desc {
  margin: 0;
  font-size: 0.85rem;
  color: #666;
}

.achievement-status {
  text-align: right;
}

.earned-badge {
  background-color: #4caf50;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.no-achievements {
  padding: 2rem;
  text-align: center;
  color: #666;
}

.recommendations {
  margin-top: 2rem;
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
}

.recommendations h3 {
  margin-bottom: 1.5rem;
  color: #333;
}

.recommendation-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.recommendation-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.recommendation-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  border-color: #1a73e8;
}

.recommendation-card h4 {
  margin: 0 0 0.5rem;
  color: #1a73e8;
}

.recommendation-card p {
  margin: 0 0 1rem;
  color: #666;
  font-size: 0.9rem;
}

.card-icon {
  position: absolute;
  right: 1rem;
  top: 1rem;
  font-size: 2rem;
  opacity: 0.2;
}

.auth-required {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
}

.auth-required h2 {
  color: #1a73e8;
  margin-bottom: 1rem;
}

.auth-required p {
  margin-bottom: 1.5rem;
  color: #666;
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
</style>
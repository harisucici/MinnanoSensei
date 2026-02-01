<template>
  <div id="app">
    <header v-if="showHeader">
      <nav class="navbar">
        <div class="nav-brand">
          <router-link to="/" class="brand-link">
            <h1>📚 Minnano Sensei</h1>
          </router-link>
        </div>
        <ul class="nav-menu">
          <li><router-link to="/" class="nav-link" active-class="active">Home</router-link></li>
          <li v-if="isAuthenticated">
            <router-link to="/lessons" class="nav-link" active-class="active">Lessons</router-link>
          </li>
          <li v-if="isAuthenticated">
            <router-link to="/practice" class="nav-link" active-class="active">Practice</router-link>
          </li>
          <li v-if="isAuthenticated">
            <router-link to="/profile" class="nav-link" active-class="active">Profile</router-link>
          </li>
          <li v-if="isAuthenticated">
            <button @click="logout" class="logout-btn">Logout</button>
          </li>
          <li v-if="!isAuthenticated">
            <router-link to="/login" class="nav-link" active-class="active">Login</router-link>
          </li>
        </ul>
        <div class="hamburger" @click="toggleMobileMenu">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </div>
      </nav>
    </header>

    <main>
      <router-view :isAuthenticated="isAuthenticated" />
    </main>

    <footer v-if="showFooter">
      <p>&copy; 2025 Minnano Sensei - AI-Powered Japanese Learning</p>
    </footer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'App',
  computed: {
    ...mapGetters(['isAuthenticated']),
    showHeader() {
      // Don't show header on login page
      return this.$route.name !== 'login';
    },
    showFooter() {
      // Don't show footer on login page
      return this.$route.name !== 'login';
    }
  },
  methods: {
    ...mapActions(['logout']),
    toggleMobileMenu() {
      const navMenu = document.querySelector('.nav-menu');
      navMenu.classList.toggle('active');
    }
  },
  mounted() {
    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        const navMenu = document.querySelector('.nav-menu');
        navMenu.classList.remove('active');
      });
    });
  }
}
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-size: 14px; /* Reduce base font size */
}

.brand-link {
  text-decoration: none;
  color: inherit;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem; /* Reduced padding */
  background-color: #1a73e8;
  color: white;
  height: 50px; /* Set fixed height */
  min-height: 50px; /* Ensure minimum height */
}

.nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 1rem; /* Reduced gap */
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.3rem 0.7rem; /* Reduced padding */
  border-radius: 4px;
  transition: background-color 0.3s;
  font-size: 0.9rem; /* Smaller font size */
}

.nav-link:hover, .nav-link.active {
  background-color: rgba(255, 255, 255, 0.2);
}

.logout-btn {
  background: none;
  border: none;
  color: white;
  text-decoration: none;
  padding: 0.3rem 0.7rem; /* Reduced padding */
  margin: 0 0.3rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 0.9rem; /* Smaller font size */
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.hamburger {
  display: none;
  flex-direction: column;
  cursor: pointer;
}

.bar {
  width: 25px;
  height: 3px;
  background-color: white;
  margin: 3px 0;
  transition: 0.3s;
}

main {
  flex: 1;
  padding: 1.5rem 0; /* Reduced padding */
  overflow-x: hidden; /* Prevent horizontal scroll */
}

footer {
  text-align: center;
  padding: 1rem; /* Reduced padding */
  background-color: #f5f5f5;
  color: #666;
  margin-top: auto;
  font-size: 0.85rem; /* Smaller font size */
}

/* Global styles to reduce overall font sizes */
h1 {
  font-size: 1.5rem !important; /* Reduce h1 size */
  margin: 0;
}

h2 {
  font-size: 1.3rem !important; /* Reduce h2 size */
}

h3 {
  font-size: 1.1rem !important; /* Reduce h3 size */
}

body {
  font-size: 14px; /* Base font size */
}

@media (max-width: 768px) {
  .nav-menu {
    position: fixed;
    left: -100%;
    top: 50px; /* Adjusted for smaller navbar */
    flex-direction: column;
    background-color: #1a73e8;
    width: 100%;
    text-align: center;
    transition: 0.3s;
    box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
    padding: 1.5rem 0; /* Reduced padding */
  }

  .nav-menu.active {
    left: 0;
  }

  .hamburger {
    display: flex;
  }
}
</style>
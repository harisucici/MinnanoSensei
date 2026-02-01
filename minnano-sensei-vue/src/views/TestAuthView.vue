<template>
  <div class="test-auth">
    <h1>Authentication Test</h1>
    <div v-if="isAuthenticated">
      <p>You are logged in as: {{ user.name }}</p>
      <p>Email: {{ user.email }}</p>
      <p>Native Language: {{ user.nativeLanguage }}</p>
      <button @click="logout">Logout</button>
    </div>
    <div v-else>
      <p>You are not logged in.</p>
      <p><router-link to="/login">Go to Login</router-link></p>
    </div>
    <p><router-link to="/">Back to Home</router-link></p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'TestAuthView',
  computed: {
    ...mapGetters(['isAuthenticated', 'getUser']),
    user() {
      return this.getUser;
    }
  },
  methods: {
    ...mapActions(['logout'])
  }
}
</script>

<style scoped>
.test-auth {
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}
</style>
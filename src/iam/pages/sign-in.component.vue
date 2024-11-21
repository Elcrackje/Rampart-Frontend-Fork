<script>
import {useAuthenticationStore} from "../services/authentication.store.js";
import {SignInRequest} from "../model/sign-in.request.js";

export default {
  name: "sign-in",
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    onSignIn() {
      let authenticationStore = useAuthenticationStore();
      let signInRequest = new SignInRequest(this.username, this.password);
      authenticationStore.signIn(signInRequest, this.$router);
    }
  }
}
</script>


<template>
  <div class="auth-container">
    <div class="auth-card">
      <h3>Sign In</h3>
      <p class="description">Please enter your credentials to sign in.</p>
      <form @submit.prevent="onSignIn">
        <div class="field">
          <pv-float-label>
            <label for="username">Username</label>
            <pv-input-text id="username" v-model="username" :class="{'p-invalid': !username}"/>
            <small v-if="!username" class="p-invalid">Username is required.</small>
          </pv-float-label>
        </div>
        <div class="field">
          <pv-float-label>
            <label for="password">Password</label>
            <pv-input-text id="password" v-model="password" :class="{'p-invalid': !password}" type="password"/>
            <small v-if="!password" class="p-invalid">Password is required.</small>
          </pv-float-label>
        </div>
        <div class="field">
          <pv-button type="submit">Sign In</pv-button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #1f1f1f, #3f3f3f);
}

.auth-card {
  background: #2b2b2b;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
  color: #fff;
}

.auth-card h3 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #00d1b2;
}

.auth-card .description {
  margin-bottom: 2rem;
  color: #b5b5b5;
}

.field {
  margin-bottom: 1.5rem;
}

.pv-float-label label {
  color: #b5b5b5;
}

.pv-input-text {
  background: #3f3f3f;
  border: none;
  color: #fff;
}

.pv-input-text.p-invalid {
  border-color: #ff3860;
}

.p-invalid {
  color: #ff3860;
}

.pv-button {
  background: #00d1b2;
  border: none;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.pv-button:hover {
  background: #00b89c;
}
</style>
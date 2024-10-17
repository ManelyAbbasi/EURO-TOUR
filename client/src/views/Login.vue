<template>
  <!-- Parent container for the split layout -->
  <div class="split-container">
    <!-- Left side: light blue background -->
    <div class="left-side">
      <!-- Logo section -->
      <div class="logo">
        <router-link to="/">
          <img src="@/assets/vertical-logo.png" alt="Euro Tour logo" draggable="false" class="logo-img">
        </router-link>
      </div>
    </div>

    <!-- Right side: Form with dark blue background -->
    <div class="right-side">

    <!-- Display for small screens -->
    <img src="@/assets/vertical-logo.png" alt="Tablet Logo" class="tablet-logo-img" draggable="false" />
    <img src="@/assets/vertical-logo.png" alt="Mobile Logo" class="mobile-logo-img" draggable="false" />

      <div class="container">
        <!-- Container for the form -->
        <div class="form-entries">
          <!-- 1st row: username -->
          <div class="row-form">
            <input class="input" name="username" id="usernameID" type="text" v-model="username" placeholder="username">
            <p v-if="usernameError" class="error-message">{{ usernameError }}</p>
          </div>

          <!-- 2nd row: password -->
          <div class="row-form">
            <input class="input" name="password" id="passwordID" type="password" v-model="password" placeholder="password">
            <p v-if="passwordError" class="error-message">{{ passwordError }}</p>
          </div>

          <!-- Login button -->
          <div class="button-container">
            <button class="btn" type="button" @click="loginButton" :disabled="isEmpty">log in</button>
          </div>

           <!-- Don't have an account section -->
        <div class="create-account-container">
          <span>new to euro trip? </span>
          <router-link to="/signup" class="create-account-link"> create an account</router-link>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Api } from '../Api'

export default {
  name: 'login',
  data() {
    return {
      username: '',
      password: '',
      usernameError: '',
      passwordError: ''
    }
  },
  methods: {
    async loginButton() {
      // Reset error messages
      this.usernameError = ''
      this.passwordError = ''

      if (!this.isEmpty) {
        try {
          const userCredentials = {
            username: this.username,
            password: this.password
          }

          const response = await Api.post('/users/login', userCredentials)

          const authToken = response.headers['x-auth-token']
          if (authToken) {
            localStorage.setItem('x-auth-token', authToken)
            this.$router.push({ name: 'home' })
          } else {
            console.error('login failed: no auth token received')
          }
        } catch (error) {
          // Handle specific error cases
          if (error.response && error.response.status === 404) {
            this.usernameError = 'there in no account with this username'
          } else if (error.response && error.response.status === 401) {
            this.passwordError = 'password does not match the username'
          } else {
            console.error('login error:', error)
            alert('login failed. please try again.')
          }
        }
      }
    }
  },
  computed: {
    isEmpty() {
      return this.username === '' || this.password === ''
    }
  }
}
</script>

<style scoped>
.split-container {
  display: flex;
  height: 100vh;
}

.left-side {
  flex: 1;
  background-color: #9BA9B6;
}

.right-side {
  flex: 1.5;
  background-color: #42515e;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  margin-bottom: 20px;
}

.logo-img {
  width: 80%;
  max-width: 500px;
  margin-top: 40%;
  margin-left: 9%;
}

.tablet-logo-img {
  display: none;
}

.mobile-logo-img {
  display: none;
}

.row-form {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.input {
  color: #759CAB;
  font-size: 16px;
  padding: 12px 20px;
  font-family: 'Lexend Deca', sans-serif;
  border: rgba(0, 0, 0, 0.301);
  background-color: rgba(0, 0, 0, 0.301);
  width: 50%;
  outline: none;
  margin-top: 2%;
}

.button-container {
  display: flex;
  display: row;
  gap: 30px;
  justify-content: center;
  padding-top: 2%;
}

button:active {
  transform: translate(0em, 0.2em);
}

/* Button click animation disabled when form is empty */
button:active[disabled] {
  transform: none;
}

.btn {
  color: #EDF7FB;
  font-size: 2.5vh;
  border: #759CAB;
  background-color: #759CAB;
  cursor: pointer;
  border-radius: 0px;
  width: 15%;
  font-family: 'Lexend Deca', sans-serif;
}

.btn:hover {
  background-color: #759CAB;
  color: #EDF7FB;
}

.btn:disabled {
  color: #EDF7FB;
  font-size: 2.5vh;
  border: 2px solid #757575;
  background-color: #42515e;
  font-family: 'Lexend Deca', sans-serif;
  cursor: not-allowed;
}

.create-account-container {
  text-align: center;
  margin-top: 5px;
  font-family: 'Lexend Deca', sans-serif;
  color: #757575;
}

.create-account-link {
  text-decoration: underline;
  color: #757575;
  transition: color 0.3s;
}

.create-account-link:hover {
  color: #759CAB;
}

.error-message {
  color: #bc672a;
  font-family: 'Lexend Deca', sans-serif;
  font-size: 12px;
  margin-left: 13rem;
}

@media screen and (max-width: 320px) {
  .mobile-logo-img {
    display: block;
    width: 70%;
    margin-bottom: 1rem;
  }

  .tablet-logo-img {
    display: none !important;
  }

  .btn {
    color: #EDF7FB;
    font-size: 2.5vh;
    border: #759CAB;
    background-color: #759CAB;
    cursor: pointer;
    border-radius: 0px;
    width: 30%;
    font-family: 'Lexend Deca', sans-serif;
  }

  .input {
    color: #759CAB;
    font-size: 16px;
    padding: 12px 20px;
    font-family: 'Lexend Deca', sans-serif;
    border: rgba(0, 0, 0, 0.301);
    background-color: rgba(0, 0, 0, 0.301);
    width: 85%;
    outline: none;
    margin-top: 2%;
  }

  .create-account-container {
    font-size:smaller;
  }

}

@media screen and (max-width: 768px) {
  .split-container {
    flex-direction: column;
  }

.left-side {
  display: none;
}

.right-side {
  background-color: #759CAB;
}

.container {
  margin-bottom:7rem;
}

.tablet-logo-img {
  display: block;
  width: 40%;
  margin-bottom: 1rem;
}

.input {
  color: #0c556a;
}

.btn {
  color: #EDF7FB;
  border: #0c556a;
  background-color: #0c556a;
}

.btn:disabled {
  border: 2px solid #0c556a;
  background-color: #759CAB;
}

.create-account-container {
  color: #0c556a;
}

.create-account-link {
  color: #0c556a;
}

.create-account-link:hover {
  color: #EDF7FB;
}
}

@media screen and (max-width: 1200px){
  .logo-img {
  margin-top: 50%;
}
}

</style>

<template>
    <!-- Parent container for the split layout -->
    <div class="split-container">
      <!-- Left side: light blue background -->
      <div class="signup-left-side">
        <!-- Logo section -->
        <div class="signup-logo">
          <router-link to="/">
            <img src="@/assets/vertical-logo.png" alt="Euro Tour logo" draggable="false" class="signup-logo-img">
          </router-link>
        </div>
      </div>

      <!-- Right side: Form with dark blue background -->
      <div class="signup-right-side">

        <img src="@/assets/vertical-logo.png" alt="Tablet Logo" class="signup-tablet-logo-img" draggable="false" />
        <img src="@/assets/vertical-logo.png" alt="Mobile Logo" class="signup-mobile-logo-img" draggable="false" />

        <div class="signup-container">
          <!-- Container for the form -->
          <div class="signup-form-entries">
            <!-- 1st row: username -->
            <div class="signup-row-form">
              <input class="signup-input" name="username" id="usernameID" type="text" v-model="username" placeholder="username">
            </div>

            <!-- 2nd row: password -->
            <div class="signup-row-form">
              <input class="signup-input" name="password" id="passwordID" type="password" v-model="password" placeholder="password">
            </div>

            <!-- 3rd row: confirm password -->
            <div class="signup-row-form">
              <input class="signup-input" name="confirm password" id="confirmpasswordID" type="password" v-model="confirmpassword" placeholder="confirm password">
            </div>

            <!-- 4th row: date of birth -->
            <div class="signup-row-form dob-row">
             <label for="dob">date of birth</label><br />
             <div class="dob-container">
              <select v-model="birthDay" class="signup-input dob-select">
              <option disabled value="">day</option>
              <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
            </select>

            <select v-model="birthMonth" class="signup-input dob-select">
              <option disabled value="">month</option>
              <option v-for="(month, index) in months" :key="index" :value="index + 1">{{ month }}</option>
            </select>

            <select v-model="birthYear" class="signup-input dob-select">
              <option disabled value="">year</option>
              <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
            </select>
        </div>
        </div>

            <!-- Sign up button -->
            <div class="signup-button-container">
              <button class="signup-btn" type="button" @click="saveButton()" :disabled="isEmpty">sign up</button>
            </div>

             <!-- Already have an account section -->
          <div class="signup-login-container">
            <span>already have an account? </span>
            <router-link to="/login" class="login-link">log in</router-link>
          </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { Api } from '../Api'

export default {
  name: 'SignUp',
  data() {
    return {
      username: '',
      password: '',
      confirmpassword: '',
      birthDay: '',
      birthMonth: '',
      birthYear: '',
      months: [
        'jan', 'feb', 'mar', 'apr', 'may', 'jun',
        'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
      ],
      days: Array.from({ length: 31 }, (_, i) => i + 1), // Generates an array [1, 2, ..., 31]
      years: Array.from({ length: 2012 - 1920 + 1 }, (_, i) => 2012 - i) // Generates array [2012, 2011, ..., 1920]
    }
  },
  methods: {
    async saveButton() {
      if (!this.isEmpty) {
        console.log('Form submitted')
      }
      try {
        const birthDate = `${this.birthYear}-${this.birthMonth.toString().padStart(2, '0')}-${this.birthDay.toString().padStart(2, '0')}`
        console.log('Birth Date:', birthDate)

        const user = {
          username: this.username,
          password: this.password,
          birthDate: birthDate,
          isLGBTQIA: false,
          gender: 'other',
          isAdmin: false
        }

        console.log('User object:', user)
        const response = await Api.post('/api/users', user)
        console.log('response', response)
        console.log('header', response.headers)
        localStorage.setItem('x-auth-token', response.headers['x-auth-token'])
        this.$router.push({ name: 'home' })
      } catch (error) {
        console.error(error)
      }
      if (!this.isEmpty) {
        console.log('Form submitted')
      }
    }
  },
  computed: {
    isEmpty() {
      return this.username === '' ||
             this.password === '' ||
             this.confirmpassword === '' ||
             this.birthDay === '' ||
             this.birthMonth === '' ||
             this.birthYear === '' ||
             this.password !== this.confirmpassword
    }
  }
}
</script>

<style scoped>
/* Split container for vertical layout */
.split-container {
  display: flex;
  height: 100vh;
}

.signup-left-side {
  flex: 1;
  background-color: #9BA9B6;
}

.signup-right-side {
  flex: 1.5;
  background-color: #42515e;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.signup-logo {
  margin-bottom: 20px;            /* Space between logo and form */
}

.signup-logo-img {
  width: 80%;
  max-width: 500px;
  margin-top: 35%;
  margin-left: 9%;
}

.signup-tablet-logo-img {
  display: none;
}

.signup-mobile-logo-img {
  display: none;
}

/* Styling for the row of the name, username and password */
.signup-row-form {
  display: flex;
  margin-top: 2%;
  align-items: center;
  flex-direction: column;
}

/* Styling specific to the input fields */
.signup-input {
  color: #759CAB;
  font-size: 16px;
  padding: 12px 20px;
  font-family: 'Lexend Deca', sans-serif;
  border: rgba(0, 0, 0, 0.301);
  background-color: rgba(0, 0, 0, 0.301);
  width: 120%;
  outline: none;
}

.dob-container {
  display: flex;
  justify-content: space-between;  /* Evenly space the selects */
  width: 85%;
  margin-top: -30px;
  margin-left: 150px;
  font-family: 'Lexend Deca', sans-serif;
}

.dob-container select {
  color:#757575;
  background-color: rgba(0, 0, 0, 0.301);
  font-family: 'Lexend Deca', sans-serif;
  border: rgba(0, 0, 0, 0.301);
  padding: 12px 20px;
  width: 30%;
  font-size: 13px;
}

.dob-container select:focus {
  color: #759CAB;
}

/* Style for the Date of Birth label */
.signup-row-form label {
  position: relative;
  left: -210px;
  top: 30px;
  font-family: 'Lexend Deca', sans-serif;
  font-size: 16px;
  color: #757575;
}

.signup-button-container {
  display: flex;
  display: row;
  gap: 30px;
  justify-content: center;
  padding-top: 2%;
  font-family: 'Lexend Deca', sans-serif;
}

/* Click animation for the button */
button:active {
  transform: translate(0em, 0.2em);
}

/* Button click animation disabled when form is empty */
button:active[disabled] {
  transform: none;
}

.signup-btn {
  color: #EDF7FB;
  font-size: 2.5vh;
  border: #759CAB;
  background-color: #759CAB;
  cursor: pointer;
  border-radius: 0px;
  margin-top: 50px;
  width: 30%;
}

.signup-btn:hover {
  background-color: #759CAB;
  color: #EDF7FB;
}

/* Styling for the button when disabled */
.signup-btn:disabled {
  color: #EDF7FB;
  font-size: 2.5vh;
  border: 2px solid #757575;
  background-color: #42515e;
  font-family: 'Lexend Deca', sans-serif;
  cursor: not-allowed;
}

.signup-login-container {
  text-align: center;
  margin-top: 5px;
  font-family: 'Lexend Deca', sans-serif;
  color: #757575;
}

.login-link {
  text-decoration: underline; /* Make the link underlined */
  color: #757575;
  transition: color 0.3s; /* Smooth transition for color change */
}

.login-link:hover {
  color: #759CAB;
}

@media screen and (max-width: 320px) {

.signup-mobile-logo-img {
  display: block;
  width: 70%;
  margin-bottom: 1rem;
}

.signup-tablet-logo-img {
  display: none !important;
}

.signup-input {
  width: 80%;
}

.dob-container {
  width: 81%;
  margin-top: -10px;
  margin-left: 4px;
}

.signup-row-form label {
  left: -60px;
  top: 10px;
}
}

@media screen and (max-width: 768px) {

.signup-left-side {
  display: none;
}

.signup-right-side {
  background-color: #759CAB;
}

.split-container {
    flex-direction: column;
  }

.signup-tablet-logo-img {
  display: block;
  width: 40%;
  margin-bottom: 1rem;
}

::placeholder {
  color: #42515e;
  opacity: 1;
}

.signup-row-form label {
  color: #42515e;
  opacity: 1;
}

.dob-container select {
  color:#42515e;
}

.dob-container select:focus {
  color: #0c556a;
}

.signup-input {
  color: #0c556a;
  text-decoration-color: #42515e;
}

.signup-btn {
  color: #EDF7FB;
  border: #0c556a;
  background-color: #0c556a;
  margin-top:1rem;
}

.signup-btn:disabled {
  border: 2px solid #0c556a;
  background-color: #759CAB;
}

.signup-login-container {
  color: #0c556a;
}

.login-link {
  color: #0c556a;
}

.login-link:hover {
  color: #EDF7FB;
}
}

@media screen and (max-width: 1200px){
  .signup-logo {
    margin-top: 10%;
  }
}

</style>

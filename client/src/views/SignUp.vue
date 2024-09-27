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
        <div class="container">
          <!-- Container for the form -->
          <div class="form-entries">
            <!-- 1st row: username -->
            <div class="row-form">
              <input class="input" name="username" id="usernameID" type="text" v-model="username" placeholder="username">
            </div>

            <!-- 2nd row: password -->
            <div class="row-form">
              <input class="input" name="password" id="passwordID" type="password" v-model="password" placeholder="password">
            </div>

            <!-- 3rd row: confirm password -->
            <div class="row-form">
              <input class="input" name="confirm password" id="confirmpasswordID" type="password" v-model="confirmpassword" placeholder="confirm password">
            </div>

            <!-- 4th row: date of birth -->
            <div class="row-form">
              <label for="dob">date of birth</label><br />
              <div class="dob-container">
                <select v-model="birthDay" class="input dob-select">
                  <option disabled value="">day</option>
                  <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
                </select>

                <select v-model="birthMonth" class="input dob-select">
                  <option disabled value="">month</option>
                  <option v-for="(month, index) in months" :key="index" :value="index + 1">{{ month }}</option>
                </select>

                <select v-model="birthYear" class="input dob-select">
                  <option disabled value="">year</option>
                  <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                </select>
              </div>
            </div>

            <!-- Sign up button -->
            <div class="button-container">
              <button class="btn" type="button" @click="saveButton()" :disabled="isEmpty">sign up</button>
            </div>

             <!-- Already have an account section -->
          <div class="login-container">
            <span>already have an account? </span>
            <router-link to="/login" class="login-link">log in</router-link>
          </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
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
      years: Array.from({ length: 2012 - 1920 + 1 }, (_, i) => 2012 - i), // Generates array [2012, 2011, ..., 1920]
    }
  },
  methods: {
    saveButton() {
      if (!this.isEmpty) {
        // Add your logic to save or submit the form here
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
             this.birthYear === ''
    }
  }
}
</script>

<style scoped>
/* Split container for vertical layout */
.split-container {
  display: flex;                /* Horizontal layout */
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
  margin-bottom: 20px;            /* Space between logo and form */
}

.logo-img {
  width: 80%;
  max-width: 500px;
  margin-top: 30%;
}

/* Styling for the row of the name, username and password */
.row-form {
  display: flex;
  margin-top: 2%;
  align-items: center;
  flex-direction: column;
}

/* Styling specific to the input fields */
.input {
  color: #759CAB;
  font-size: 16px;
  padding: 12px 20px;
  font-family: 'Lexend Deca', sans-serif;
  border: rgba(0, 0, 0, 0.301);
  background-color: rgba(0, 0, 0, 0.301);
  width: 50%;
  outline: none;
}

.dob-container {
  display: flex;
  justify-content: space-between;  /* Evenly space the selects */
  width: 37%;
  margin-top: -30px;
  margin-left: 110px;
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
.row-form label {
  position: relative;
  left: -180px;
  top: 30px;
  font-family: 'Lexend Deca', sans-serif;
  font-size: 16px;
  color: #757575;
}

.button-container {
  display: flex;
  display: row;
  gap: 30px;
  justify-content: center;
  padding-top: 2%;
}

/* Click animation for the button */
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
  margin-top: 50px;
  width: 15%;
}

.btn:hover {
  background-color: #759CAB;
  color: #EDF7FB;
}

/* Styling for the button when disabled */
.btn:disabled {
  color: #EDF7FB;
  font-size: 2.5vh;
  border: 2px solid #757575;
  background-color: #42515e;
  font-family: 'Lexend Deca', sans-serif;
  cursor: not-allowed;
}

.login-container {
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

</style>

<template>
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
        <label for="dob">Date of Birth</label><br />
           <!-- Day selection -->
           <select v-model="birthDay">
          <option disabled value="">Select Day</option>
          <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
        </select>

        <!-- Month selection -->
        <select v-model="birthMonth">
          <option disabled value="">Select Month</option>
          <option v-for="(month, index) in months" :key="index" :value="index+1">{{ month }}</option>
        </select>

        <!-- Year selection -->
        <select v-model="birthYear">
          <option disabled value="">Select Year</option>
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>

      <!-- Sign up button -->
      <div class="button-container">
        <button class="btn" type="button" @click="saveButton()" :disabled="isEmpty">sign up</button>
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
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
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

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

            <!-- Login button -->
            <div class="button-container">
              <button class="btn" type="button" @click="saveButton()" :disabled="isEmpty">log in</button>
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
export default {
  name: 'login',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    saveButton() {
      if (!this.isEmpty) {
        console.log('Form submitted')
      }
    }
  },
  computed: {
    isEmpty() {
      return this.username === '' ||
             this.password === ''
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

.create-account-container {
  text-align: center;
  margin-top: 5px;
  font-family: 'Lexend Deca', sans-serif;
  color: #757575;
}

.create-account-link {
  text-decoration: underline; /* Make the link underlined */
  color: #757575;
  transition: color 0.3s; /* Smooth transition for color change */
}

.create-account-link:hover {
  color: #759CAB;
}

</style>

<template>
  <div class="maincities-body-container">
    <header class="euro-tour-header">
      <div class="logo-wrapper">
        <router-link to="/" class="logo">
          <img src="@/assets/horizontal-logo.png" alt="Euro Tour logo" />
        </router-link>
      </div>
      <nav class="navbar">
        <router-link to="/favourites" class="navbar-item">
          <i class="fa-regular fa-heart"></i> favourites
        </router-link>
        <router-link to="/maincities" class="navbar-item">
          <i class="fa-solid fa-city"></i> cities
        </router-link>
        <router-link to="/mainplaces" class="navbar-item"><i class="fa-solid fa-map-pin"></i> places to visit</router-link>
        <b-dropdown
          size="lg"
          variant="link"
          toggle-class="text-decoration-none"
          no-caret
          class="navbar-item dropdown"
        >
          <template #button-content>
            <img src="@/assets/signed-in-icon.png" alt="Signed In" class="dropdown-icon" />
          </template>
          <b-dropdown-item class="dropdown-item logout" @click="logout">Log out</b-dropdown-item>
          <b-dropdown-item class="dropdown-item" to="/profile">Profile</b-dropdown-item>
        </b-dropdown>
      </nav>
    </header>

    <form class="user-form">
      <b-row>
        <label for="username">current username</label>
        <input type="text" id="username" class="input-field" v-model="username" />

        <label for="password">password</label>
        <input type="password" id="password" class="input-field" v-model="password" />
      </b-row>

      <b-row>
        <div class="gender-selection">
          <label for="gender">What is your gender?</label>
          <div class="gender-buttons">
            <div class="gender-item">
              <div
                class="gender-button"
                data-value="male"
                :class="{ active: activeGender === 'male' }"
                @click="selectGender('male')"
              ></div>
              <label for="male" class="gender-label">male</label>
            </div>
            <div class="gender-item">
              <div
                class="gender-button"
                data-value="female"
                :class="{ active: activeGender === 'female' }"
                @click="selectGender('female')"
              ></div>
              <label for="female" class="gender-label">female</label>
            </div>
            <div class="gender-item">
              <div
                class="gender-button"
                data-value="non-binary"
                :class="{ active: activeGender === 'non-binary' }"
                @click="selectGender('non-binary')"
              ></div>
              <label for="non-binary" class="gender-label non-binary-label">non-binary</label>
            </div>
            <div class="gender-item">
              <div
                class="gender-button"
                data-value="other"
                :class="{ active: activeGender === 'other' }"
                @click="selectGender('other')"
              ></div>
              <label for="other" class="gender-label">other</label>
            </div>
          </div>
        </div>
      </b-row>

      <b-row>
        <div class="sexuality-selection">
          <label for="lgbtqia">Are you a member of LGBTQIA+?</label>
          <div class="sexuality-buttons">
            <div class="sexuality-item">
              <div
                class="sexuality-button"
                data-value="yes"
                :class="{ active: activeLGBTQIA === 'yes' }"
                @click="selectLGBTQIA('yes')"
              ></div>
              <label for="yes" class="sexuality-label">yes</label>
            </div>
            <div class="sexuality-item">
              <div
                class="sexuality-button"
                data-value="no"
                :class="{ active: activeLGBTQIA === 'no' }"
                @click="selectLGBTQIA('no')"
              ></div>
              <label for="no" class="sexuality-label">no</label>
            </div>
          </div>
        </div>
      </b-row>

      <b-row class="save-row">
        <div class="save-changes-container">
          <button class="save-button" type="button" @click="saveChanges($event)">save changes</button>
          <span class="saved-message" v-if="isSaved">saved!</span>
        </div>
      </b-row>

      <b-row class="delete-row">
        <b-col>        <h4 class="delete-title">Do you want to delete your account?</h4>
        </b-col>
        <b-col>        <button class="delete-button" type="button" @click="deletePopUp">delete account</button>
        </b-col>
      </b-row>
    </form>
    <div class="delete-popup" v-if="deleteInProcess">
      <div class="popup-header">
        <button @click="closeDeletePopUp">X</button>
      </div>
      <div class="popup-body">
        <p>Are you sure you want to delete your account?</p>

        <label for="usernameDeleting">enter your username</label>
        <input type="text" id="usernameDeleting" class="input-field" v-model="usernameDeleting" />
        <label for="passwordDeleting">enter your password</label>
        <input type="password" id="passwordDeleting" class="input-field" v-model="passwordDeleting" />
        <div class="delete-button-wrapper">
          <button @click="deleteAccount($event)">Delete Account</button>
        </div>
      </div>
    </div>

    <footer class="footer">
      <div class="footer-text">
        <p> &copy; 2024 copyright: eurotrip.com</p>
      </div>
      <div class="top-icon">
        <a href="#"><i class="fa-solid fa-caret-up"></i></a>
      </div>
    </footer>
  </div>
</template>

<script>
import { Api } from '../Api' // Assuming your backend API call method is in Api.js

export default {
  data() {
    return {
      username: '', // Add username field to bind to the input
      password: '', // Add password field to bind to the input
      activeGender: null, // Initialize active gender
      activeLGBTQIA: null, // Initialize active LGBTQIA status
      isSaved: false, // Track if the "saved!" message should be shown
      deleteInProcess: false,
      usernameDeleting: '', // For delete popup
      passwordDeleting: '' // For delete popup
    }
  },
  computed: {
    isLoggedIn() {
      return this.loggedInStatus // Use reactive loggedInStatus property
    }
  },
  methods: {
    selectGender(gender) {
      this.activeGender = gender // Set active gender to the clicked button
    },
    selectLGBTQIA(status) {
      this.activeLGBTQIA = status // Directly set to 'yes' or 'no'
    },
    async saveChanges(event) {
      event.preventDefault() // Prevent form submission

      const userCredentials = {
        username: this.username,
        password: this.password,
        gender: this.activeGender,
        // eslint-disable-next-line eqeqeq
        isLGBTQIA: this.activeLGBTQIA === 'yes'
      }

      try {
        // Get the auth token from local storage (or where it's stored after login)
        const authToken = localStorage.getItem('x-auth-token')

        // Make sure you have a token
        if (!authToken) {
          throw new Error('No auth token found. Please log in.')
        }

        const response = await Api.put(`/users/${this.username}`, userCredentials, {
          headers: {
            'x-auth-token': authToken // Set the token in the request headers
          }
        })

        if (response.status === 200) {
          this.isSaved = true
          console.log('User information updated successfully:', response.data)
        }
      } catch (error) {
        console.error('Update error:', error)
        alert('You are not allowed to change your username, and password can not be empty.')
      }
    },
    deletePopUp() {
      this.deleteInProcess = true
    },
    closeDeletePopUp() {
      this.deleteInProcess = false
    },
    async deleteAccount(event) {
      if (event) {
        event.preventDefault() // This prevents the default form or button submission behavior
      }
      try {
        const authToken = localStorage.getItem('x-auth-token') // Get auth token from localStorage
        if (!authToken) throw new Error('No auth token found. Please log in.')
        const response = await Api.delete(`/users/${this.usernameDeleting}`, {
          headers: {
            'x-auth-token': authToken // Send token for authorization
          }
        })

        if (response.status === 200) {
          console.log('Account deleted successfully')
          this.logout()
        }
      } catch (error) {
        console.error('Error deleting account:', error)
        alert('Error deleting account. Please check your credentials.')
      }
    },
    logout() {
      localStorage.removeItem('x-auth-token')
      this.loggedInStatus = false
      this.$router.push('/')
    }
  },
  mounted() {
    // Check login status when the component is mounted
    const loggedInStatus = !!localStorage.getItem('x-auth-token')
    console.log('User logged in status:', loggedInStatus)
    // Create a link element for Font Awesome (for icons, if needed)
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css'
    link.integrity = 'sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==' // Replace this with the correct integrity hash
    link.crossOrigin = 'anonymous'
    link.referrerPolicy = 'no-referrer'
    // Append the link element to the head
    document.head.appendChild(link)
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@100..900&display=swap');

.maincities-body-container {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    list-style-type: none;
    text-decoration: none;
    border: none;
    outline: none;
    font-family: "Lexend Deca", sans-serif;
    background-color: #42515e;
    display: flex;
    flex-wrap: wrap; /* Allow wrapping of items */
}

.euro-tour-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1rem 5%; /* Adjust padding for more space */
  background-color: rgba(155, 169, 182, 1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 900;
}

.b-dropdown .dropdown-menu {
  width: auto; /* Ensure the width adjusts to content */
  white-space: nowrap; /* Prevent wrapping of text inside dropdown */
  padding: 0; /* Ensure padding doesn't push content */
  margin: 0;
  border: 1px solid rgba(0, 0, 0, 0.15); /* Consistent border */
  border-radius: 0.25rem;
}

.b-dropdown .dropdown-item{
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  text-align: inherit;
  border: none; /* Remove border */
}

.dropdown-icon {
  max-height: 3rem;
}

.navbar-item {
  border: none; /* Remove borders to prevent overflow */
  margin: 0 1rem;
  text-decoration: none;
}

.navbar a {
  font-size: 1.5rem;
  color: #edf7fb;
  transition: 0.3s;
  text-decoration: none;
}

.navbar a:hover,
.logo-wrapper img,
.navbar a:hover .fa-solid {
  color: #bc672a !important;
}

.logo img{
  max-height: 4rem;
}

a img {
  max-height: 1rem;
  color: #42515e;
}

.user-form {
  flex-direction: column;
  margin-top: 10rem;
  margin-left: 23rem;
  width: 50%;
}

label {
  color: #8FC6DF;
  font-size: 1.1rem;
  font-family: 'Lexend Deca', sans-serif;
  text-align: left;
}

h4 {
  color: #edf7fb;
  font-size: 1.1rem;
  font-family: 'Lexend Deca', sans-serif;
  text-align: left;
  white-space: nowrap;
}

.delete-button {
  background-color: #233341;
  color: #9BA9B6;
  border: none;
  padding: 0.3rem 1.3rem;
  font-size: 1rem;
  cursor: pointer;
}

.delete-row{
  display: flex;
  justify-content: flex-start;
  padding: 0 1.5rem 1.5rem 1.5rem;
  gap: 1rem;
}

.delete-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -35%); /* Center the popup */
  background-color: aliceblue; /* White background */
  border-radius: 8px; /* Rounded corners */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); /* Shadow for depth */
  z-index: 10; /* Place above the overlay */
  min-width: 300px; /* Set a width for the popup */
  max-width: 600px;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #cfd3d4; /* Light grey background */
  border-top-left-radius: 8px; /* Round corners for the header */
  border-top-right-radius: 8px; /* Round corners for the header */
}

.popup-header button{
  margin-left: auto; /* Ensures the button is pushed to the right */
  border: none;
  display: flex;
  justify-content: flex-end;
}

.popup-body label,
.popup-body p{
  list-style-type: none; /* Remove the default bullets */
  padding: 0; /* Remove default padding */
  margin: 0; /* Remove default margin */
}

.popup-body {
  padding: 2rem;
  display: flex;
  flex-direction: column;
}

.popup-body input{
  width: 100%;
}

.delete-button-wrapper{
  justify-content: center;
  display: flex;
}

.popup-body button{
  width: 40%;
  background-color: #233341;
  color: #edf7fb;
  transition: all 0.3s;
  border: none;
  padding: 0.5rem 1rem;
}

.popup-body button:hover{
  background-color: #edf7fb;
  color: #233341;
  transform: scale(1.03);
  border: 1px solid #233341;
}

p{
  color: #233341;
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0.5rem 1rem 1.5rem;
}

.popup-body p,
.popup-body button{
  justify-content: center;
  display: flex;
}

.input-field {
  color: #bc672a;
  font-size: 1rem;
  padding: 12px 20px;
  font-family: 'Lexend Deca', sans-serif;
  border: rgba(0, 0, 0, 0.301);
  background-color: rgba(0, 0, 0, 0.301);
  width: 50rem;
  outline: none;
  margin-bottom: 2rem;
}

.gender-selection {
    display: flex;
    margin-top: 2rem;
    margin-bottom: 2rem;
}

.non-binary-label {
  white-space: nowrap; /* Prevents breaking non-binary across lines */
}

.sexuality-selection {
    display: flex;
    margin-top: 1rem;
    margin-bottom: 1rem;
}

.gender-selection label, .sexuality-selection label {
    color: #8FC6DF;
    font-size: 1.1rem;
    font-family: 'Lexend Deca', sans-serif;
}

.gender-buttons, .sexuality-buttons {
    display: flex;
    gap: 4rem; /* Space between buttons */
    margin-left: 2rem;
}

.gender-item, .sexuality-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.gender-button, .sexuality-button {
    width: 1.2rem;
    height: 1.2rem;
    background-color: rgba(0, 0, 0, 0.301);
    cursor: pointer;
    border: 2px solid transparent; /* For a smooth transition */
    transition: background-color 0.3s, border-color 0.3s; /* Transition effect */
}

.gender-button:hover, .sexuality-button:hover {
    border-color: #bc672a;
}

.gender-button.active, .sexuality-button.active {
    background-color: #bc672a;
}

.save-changes-container {
  display: flex;
  align-items: center; /* Aligns button and message vertically */
  margin-left: 18rem;
  margin-top: 2rem;
  margin-bottom: 5rem;
}

.save-button {
  background-color: #bc672a;
  color: #edf7fb;
  border: none;
  padding: 0.3rem 1.3rem;
  font-size: 1rem;
  cursor: pointer;
}

.saved-message {
  margin-left: 1rem; /* Adds space between the button and the saved message */
  color: #8FC6DF;
  font-size: 1rem;
  font-family: 'Lexend Deca', sans-serif;
}

.footer{
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    padding: 1rem;
    background-color: #9BA9B6;
    width: 100%;
}

.footer-text p{
    color: #045768;
    font-size: 1rem;
    margin: 1rem;
    padding: 0 0 1rem;
}

.top-icon a{
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    background-color: #edf7fb;
    border-radius: 50%;
    transition: all 0.5s;
}

.top-icon a:hover{
    box-shadow: 0 0 1 #045768;
}

.top-icon a i{
    font-size: 2rem;
    color: #045768;
}

@media screen and (max-width:1200px) {
    html{
        font-size: 55%;
    }
}

@media screen and (max-width: 991px){
    section{
        padding: 10rem 3% 2rem;
    }
    .euro-tour-header{
        padding: 2rem 3%;
    }
    .footer{
        padding: 2rem 3%;
    }
    .get-to-know-wrapper{
        padding: 7rem;
    }
}

@media screen and (max-width: 768px){
    .navbar{
        width: 100%;
        display: flex;
        justify-content: space-evenly;
        flex-wrap: wrap;
        align-items: center;
    }
    .euro-tour-header{
        flex-direction: column;
        gap: 2rem;
    }
    .layout-wrapper,
    .get-to-know-wrapper{
        flex-direction: column;
        display: flex;
    }
    .layout-wrapper p{
        font-size: 2.5rem;
    }
    .layout-wrapper h1{
        font-size: 5rem;
    }
}

@media screen and (max-width:576px) {
    html{
        font-size: 50%;
    }
}

@media screen and (max-width:350px) {
    .layout-wrapper img{
        width: 90vw;
    }
    .footer{
        flex-direction: column-reverse;
    }
}
</style>

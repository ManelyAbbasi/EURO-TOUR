<template>
    <div class="maincities-body-container">
      <header class="euro-tour-header">
        <logo class="logo-wrapper">
          <router-link to="/" class="logo">
            <img src="@/assets/horizontal-logo.png" alt="Euro Tour logo" />
          </router-link>
        </logo>
        <nav class="navbar">
          <a href="#favourites" class="navbar-item"><i class="fa-regular fa-heart" style="color: #edf7fb;"></i> favourites</a>
          <router-link to="/maincities" class="navbar-item maincities-navbar-item"
            ><i class="fa-solid fa-city"></i> cities</router-link>
          <a href="#placesToVisit" class="navbar-item"
            ><i class="fa-solid fa-map-pin"></i> places to visit</a>
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
            <!-- Dropdown items -->
            <b-dropdown-item class="dropdown-item logout" @click="logout">Log out</b-dropdown-item>
            <b-dropdown-item class="dropdown-item" to="/profile">Profile</b-dropdown-item>
          </b-dropdown>
        </nav>
      </header>

      <form class="user-form">
        <b-row>
      <label for="username">username</label>
      <input type="text" id="username" class="input-field"/>

      <label for="password">password</label>
      <input type="password" id="password" class="input-field"/>
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
        <label for="non-binary" class="gender-label">non-binary</label>
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

<b-row>
  <div class="save-changes-container">
    <button class="save-button" @click="saveChanges">save changes</button>
    <span class="saved-message" v-if="isSaved">saved!</span>
  </div>
</b-row>

      </form>

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
export default {
  data() {
    return {
      activeGender: null, // Initialize active gender
      activeLGBTQIA: null, // Initialize active LGBTQIA status
      isSaved: false // Track if the "saved!" message should be shown
    }
  },
  methods: {
    selectGender(gender) {
      this.activeGender = gender // Set active gender to the clicked button
    },
    selectLGBTQIA(status) {
      this.activeLGBTQIA = status // Set active LGBTQIA status to the clicked button
    },
    saveChanges() {
      // Show the "saved!" message when the button is clicked
      this.isSaved = true
    },
    logout() {
      localStorage.removeItem('x-auth-token')
      this.loggedInStatus = false
      this.$router.push('/')
    }
  },
  mounted() {
    // Create a link element for Font Awesome (for icons, if needed)
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css'
    link.integrity = 'sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=='
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
  background-color: purple !important;
  border: 1px solid rgba(0, 0, 0, 0.15); /* Consistent border */
  border-radius: 0.25rem;
}

.b-dropdown .dropdown-item{
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  color: blueviolet !important;
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

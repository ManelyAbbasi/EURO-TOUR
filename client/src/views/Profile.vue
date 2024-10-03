<template>
    <div class="maincities-body-container">
      <header class="euro-tour-header">
        <logo class="logo-wrapper">
          <router-link to="/" class="logo">
            <img src="@/assets/horizontal-logo.png" alt="Euro Tour logo" />
          </router-link>
        </logo>
        <nav class="navbar">
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
              <img src="@/assets/sign-in-icon.png" alt="Sign In" class="dropdown-icon" />
            </template>
            <!-- Dropdown items -->
            <b-dropdown-item class="dropdown-item" to="/login">Log in</b-dropdown-item>
            <b-dropdown-item class="dropdown-item" to="/signup">Sign up</b-dropdown-item>
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
      activeGender: null // Initialize active gender
    }
  },
  methods: {
    selectGender(gender) {
      this.activeGender = gender // Set active gender to the clicked button
    }
  },
  mounted() {
    // Create a link element
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css';
    link.integrity = 'sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==';
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
    flex-wrap: wrap;
    display: flex;
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

.dropdown-item:hover {
  background-color: blueviolet /* Hover effect */
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

.maincities-navbar-item,
.maincities-navbar-item i{
    color: #bc672a!important;
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
  width: 100%;
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
}

.gender-selection label {
    color: #8FC6DF; /* Label color */
    font-size: 1.1rem;
    font-family: 'Lexend Deca', sans-serif;
}

.gender-buttons {
    display: flex;
    gap: 4rem; /* Space between buttons */
    margin-left: 2rem;
}

.gender-item {
    display: flex; /* Flex container for button and label */
    align-items: center; /* Center items vertically */
    gap: 0.5rem;
}

.gender-button {
    width: 1.2rem;
    height: 1.2rem;
    background-color: rgba(0, 0, 0, 0.301); /* Default button color */
    cursor: pointer;
    border: 2px solid transparent; /* For a smooth transition */
    transition: background-color 0.3s, border-color 0.3s; /* Transition effect */
}

.gender-button:hover {
    border-color: #FF7F30; /* Change border color on hover */
}

.gender-button.active {
    background-color: #FF7F30; /* Color when button is active */
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

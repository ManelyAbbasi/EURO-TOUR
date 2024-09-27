<template>
  <div class="body-container">
    <header class="euro-tour-header">
      <logo class="logo-wrapper">
        <router-link to="/"  class="logo"><img src="@/assets/horizontal-logo.png" alt="Euro Tour logo"></router-link>
      </logo>
      <nav class="navbar">
        <a href="#cities" class="navbar-item"><img src="@/assets/cities.png"/> cities</a>
        <a href="#placesToVisit" class="navbar-item"><img src="@/assets/places.png"/> places to visit</a>
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
    <main>
      <div class="layout-wrapper">
          <div class="right-side-panel">
            <h1 class="hello">Hello!</h1>
            <p class="welcome-text">Make the most of your
              upcoming travels! With your <b>preferences</b>
              and our <b>recommendations</b> you will have
              the experience of a <b>lifetime</b></p>
          </div>
          <div class="left-side-panel">
          <!-- map -->
          <EuroMap class="euromap"/>
          </div>
      </div>
    </main>
  </div>
</template>

<script>
// @ is an alias to /src
import { Api } from '@/Api'
import EuroMap from '@/views/Map.vue' // Adjust the path as necessary

export default {
  components: {
    EuroMap
  },
  name: 'home',
  data() {
    return {
      message: 'none'
    }
  },
  methods: {
    getMessage() {
      Api.get('/')
        .then(response => {
          this.message = response.data.message
        })
        .catch(error => {
          this.message = error
        })
    }
  },
  mounted() {
    // Create a link element
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

<style>
@import url('https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@100..900&display=swap');

*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    list-style-type: none;
    text-decoration: none;
    border: none;
    outline: none;
    font-family: "Lexend Deca", sans-serif;
    color: #bc672a;
}

.body-container{
  display: flex;
  flex-wrap: wrap;
  background-color: #42515e;
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
  padding: 0.5rem 1rem; /* Add appropriate padding */
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
.logo-wrapper img {
  color: #bc672a;
}

.layout-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;  /* Create two equal columns */
  grid-gap: 20px;  /* Optional: Add some space between columns */
  padding: 7rem 9% 2rem;
  width: 100%;
  border: 2px solid blue;
}

.left-side-panel, .right-side-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid orange;
}

.right-side-panel {
  display: flex;
  flex-direction: column;
}

.logo img{
  border: 3px solid pink;
  max-height: 4rem;
}

.hello {
  font-size: 3rem;
}

.welcome-text {
  font-size: 2rem;
  border: 2px solid purple;
  border: 2rem;;
}

a img {
  max-height: 1rem;
  color: #42515e;
}

.btn_message {
  margin-bottom: 1em;
}

.euromap{
  width: 150%
}
</style>

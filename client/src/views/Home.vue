<template>
  <div class="body-container">
    <header class="euro-tour-header">
      <logo class="logo-wrapper">
        <router-link to="/"  class="logo"><img src="@/assets/horizontal-logo.png" alt="Euro Tour logo"></router-link>
      </logo>
      <nav class="navbar">
        <a href="#cities"><img src="@/assets/cities.png"/>cities</a>
        <a href="#placesToVisit"><img src="@/assets/places.png"/>places to visit</a>
        <b-nav-item-dropdown right>
        <!-- Custom button with your image -->
        <template #button>
          <button class="btn dropdown-toggle" type="button">
            <img src="@/assets/sign-in-icon.png" alt="Sign In" class="dropdown-icon" />
          </button>
        </template>
        <!-- Dropdown items -->
        <b-dropdown-item href="#">Log In</b-dropdown-item>
        <b-dropdown-item href="#">Sign Up</b-dropdown-item>
      </b-nav-item-dropdown>
      </nav>
      <div class="user">
      </div>
    </header>
    <main>
      <div class="layout-wrapper">
          <div class="right-side-panel">
            <h1 class="hello">Hello!</h1>
            <p class="welcome-text">Make the most of your
              upcoming travels! With your preferences
              and our recommendations you will have
              the experience of a lifetime</p>
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
  border: 2px solid green;
  background-color: #42515e;
}

.euro-tour-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1rem 9%; /* Adjust padding for more space */
  background-color: rgba(155, 169, 182, 1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 900;
  border: 2px solid red;
}

.navbar a {
  font-size: 1.5rem;
  color: #edf7fb;
  margin-left: 4rem;
  border: 3px solid cyan;
  transition: 0.3s;
}

.navbar a:hover,
.logo-wrapper img {
  color: #bc672a;
}

.layout-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;  /* Create two equal columns */
  grid-gap: 20px;  /* Optional: Add some space between columns */
  padding: 10rem 9% 2rem;
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

.dropdown-icon {
  width: 30px; /* Adjust the size as needed */
  height: 30px; /* Adjust the size as needed */
}

.euromap{
  width: 150%
}
</style>

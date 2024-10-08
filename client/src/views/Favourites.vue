<template>
  <div class="maincities-body-container">
    <header class="euro-tour-header">
      <logo class="logo-wrapper">
        <router-link to="/" class="logo">
          <img src="@/assets/horizontal-logo.png" alt="Euro Tour logo" />
        </router-link>
      </logo>
      <nav class="navbar">
        <router-link to="/maincities" class="navbar-item maincities-navbar-item">
          <i class="fa-solid fa-city"></i> cities
        </router-link>
        <a href="#placesToVisit" class="navbar-item">
          <i class="fa-solid fa-map-pin"></i> places to visit
        </a>
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
          <b-dropdown-item class="dropdown-item" to="/login">Log in</b-dropdown-item>
          <b-dropdown-item class="dropdown-item" to="/signup">Sign up</b-dropdown-item>
        </b-dropdown>
      </nav>
    </header>

    <div class="favourites-container">
      <div v-if="favourites.length === 0" class="no-favourites">
        <div class="empty-heart-icon">
          <i class="fa-regular fa-heart" style="color: #bc672a;"></i>
        </div>
        <h2>You currently have no favourites</h2>
        <p>cities and places you save will be shown here</p>
      </div>

      <div v-else>
        <!-- Display Favourites -->
        <h2>Your Favourites:</h2>
        <ul>
          <li v-for="favourite in favourites" :key="favourite._id" class="favourite-item">
            <!-- Assuming you need to fetch the city name using the city ID -->
            <div class="city-country-text">
              <p class="cityname-text">{{ favourite.city }}</p> <!-- Display city ID -->
              <p>{{ favourite.places.length > 0 ? favourite.places.join(', ') : 'No associated places' }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <footer class="footer">
      <div class="footer-text">
        <p>&copy; 2024 copyright: eurotrip.com</p>
      </div>
      <div class="top-icon">
        <a href="#"><i class="fa-solid fa-caret-up"></i></a>
      </div>
    </footer>
  </div>
</template>

<script>
import { Api } from '@/Api' // Import your API handling

export default {
  data() {
    return {
      favourites: [] // Initially empty array for favourites
    }
  },

  async mounted() {
    this.getFavorites() // Fetch favorites when the component is mounted
    this.loadFontAwesome()
  },

  methods: {
    async getFavorites() {
      const sessionKey = localStorage.getItem('x-auth-token') // Assuming token is stored in localStorage
      try {
        const response = await Api.get('/users/favorites', { headers: { 'x-auth-token': sessionKey } })
        if (response.data && response.data.favourites) {
          this.favourites = response.data.favourites // Update favourites with response
        } else {
          this.favourites = []
        }
      } catch (error) {
        console.error('Error fetching favorites:', error)
        this.favourites = [] // Reset to empty if error occurs
      }
    },

    loadFontAwesome() {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css'
      link.integrity = 'sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=='
      link.crossOrigin = 'anonymous'
      link.referrerPolicy = 'no-referrer'
      document.head.appendChild(link)
    }
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

.favourites-container {
  width: 100%;
  padding: 15rem 0;
  text-align: center;

}

.empty-heart-icon {
  margin-bottom: 2rem;
}

.empty-heart-icon i {
  font-size: 10rem;
}

.no-favourites h2 {
  font-size: 2.5rem;
  margin: 0.5rem 0;
  color: #8FC6DF;
  font-weight: bold;
}

.no-favourites p {
  font-size: 1.45rem;
  color: #8FC6DF;
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

.favourites-list {
  margin-top: 2rem;
}

.favourite-item {
  font-size: 1.2rem;
  color: #8FC6DF;
  margin: 0.5rem 0;
}

.city-country-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.cityname-text {
  font-weight: bold; /* Make city name bold */
}
</style>

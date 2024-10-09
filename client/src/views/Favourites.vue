<template>
  <div class="maincities-body-container">
    <header class="euro-tour-header">
      <logo class="logo-wrapper">
        <router-link to="/" class="logo">
          <img src="@/assets/horizontal-logo.png" alt="Euro Tour logo" />
        </router-link>
      </logo>
      <nav class="navbar">
        <router-link to="/favourites" class="navbar-item maincities-navbar-item active">
          <i class="fa-solid fa-heart"></i> favourites
        </router-link>
        <router-link to="/maincities" class="navbar-item">
          <i class="fa-solid fa-city"></i> cities
        </router-link>
        <router-link to="/placesToVisit" class="navbar-item">
          <i class="fa-solid fa-map-pin"></i> places to visit
        </router-link>
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
          <template v-if="isLoggedIn">
            <b-dropdown-item class="dropdown-item" @click="logout">Log out</b-dropdown-item>
            <b-dropdown-item class="dropdown-item" to="/profile">Profile</b-dropdown-item>
          </template>
          <template v-else>
            <b-dropdown-item class="dropdown-item" to="/login">Log in</b-dropdown-item>
            <b-dropdown-item class="dropdown-item" to="/signup">Sign up</b-dropdown-item>
          </template>
        </b-dropdown>
      </nav>
    </header>

    <div class="favourites-container">
      <div v-if="favourites.favouriteCities.length === 0 && favourites.favouritePlaces.length === 0" class="no-favourites">
        <div class="empty-heart-icon">
          <i class="fa-regular fa-heart" style="color: #bc672a;"></i>
        </div>
        <h2>You currently have no favourites</h2>
        <p>Cities and places you save will be shown here</p>
      </div>

      <!-- Favourites found -->
      <div v-else>
        <!-- Cities -->
        <div v-if="Array.isArray(favourites.favouriteCities) && favourites.favouriteCities.length > 0" class="cities-list">
          <div v-for="city in favourites.favouriteCities" :key="city.cityId" class="favourite-box">
            <p class="favourite-text">{{ city.cityName }}, {{ city.country }}</p>
          </div>
        </div>

        <!-- Places -->
        <div v-if="Array.isArray(favourites.favouritePlaces) && favourites.favouritePlaces.length > 0" class="places-list">
          <div v-for="place in favourites.favouritePlaces" :key="place.placeId" class="favourite-box">
            <p class="favourite-text">{{ place.placeName }}, {{ place.cityName }}</p>
          </div>
        </div>
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
import { Api } from '@/Api'

export default {
  data() {
    return {
      favourites: { favouriteCities: [], favouritePlaces: [] }, // Updated to reflect the response structure
      loggedInStatus: !!localStorage.getItem('x-auth-token')
    }
  },
  computed: {
    isLoggedIn() {
      return this.loggedInStatus
    }
  },
  methods: {
    async fetchFavourites() {
      try {
        const response = await Api.get('/users/favorites', {
          headers: {
            'x-auth-token': localStorage.getItem('x-auth-token')
          }
        })
        if (response.data) {
          this.favourites.favouriteCities = response.data.favouriteCities || []
          this.favourites.favouritePlaces = response.data.favouritePlaces || []
        } else {
          this.favourites = { favouriteCities: [], favouritePlaces: [] }
        }
      } catch (error) {
        console.error('Error fetching favourites:', error)
        this.favourites = { favouriteCities: [], favouritePlaces: [] }
      }
    },
    logout() {
      localStorage.removeItem('x-auth-token')
      console.log('Logged out successfully')
      this.loggedInStatus = false
      this.$router.push('/')
    }
  },
  mounted() {
    this.loggedInStatus = !!localStorage.getItem('x-auth-token')
    console.log('Is user logged in?', this.isLoggedIn)
    if (!this.isLoggedIn) {
      this.$router.push('/login')
    } else {
      this.fetchFavourites()
    }

    // Create a link element for the font-awesome CSS
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

.favourite-box {
  background-color: #3498db;
  color: #ecf0f1;
  padding: 15px;
  margin: 10px 0;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.favourite-box p {
  margin: 0;
}

.cityname {
  font-size: 18px;
  font-weight: bold;
}

.country, .city {
  font-size: 16px;
}

.no-favourites {
  text-align: center;
}

.empty-heart-icon {
  font-size: 50px;
  color: #bc672a;
  margin-bottom: 20px;
}

</style>

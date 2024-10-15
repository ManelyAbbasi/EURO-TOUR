<template>
    <div class="city-page-body-container">
      <header class="euro-tour-header">
        <div class="logo-wrapper">
          <router-link to="/" class="logo">
            <img src="@/assets/horizontal-logo.png" alt="Euro Tour logo" />
          </router-link>
        </div>
        <nav class="navbar">
          <a href="#favourites" class="navbar-item"><i class="fa-regular fa-heart" style="color: #edf7fb;"></i> favourites</a>
          <router-link to="/maincities" class="navbar-item maincities-navbar-item"
            ><i class="fa-solid fa-city"></i> cities</router-link>
          <router-link to="/mainplaces" class="navbar-item"><i class="fa-solid fa-map-pin" style="color: #edf7fb;"></i> places to visit</router-link>
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

      <main>
      <div class="city-layout-wrapper">
        <div class="maincities-left-side-panel">
          <h1>{{ city.cityName }}</h1>
          <p>Country: {{ city.country }}</p>
          <p>Rating: {{ city.rating }}</p>
          <p>Good to Know: {{ city.goodToKnow }}</p>
          <h2>Places to Visit</h2>
          <ul>
            <li v-for="place in city.placesToVisit" :key="place">{{ place }}</li>
          </ul>
        </div>
      </div>
    </main>

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
import { Api } from '@/Api'

export default {
  data() {
    return {
      city: {}, // Object to hold city details
      loggedInStatus: !!localStorage.getItem('x-auth-token') // Reactive property for login status
    }
  },
  computed: {
    isLoggedIn() {
      return this.loggedInStatus // Use reactive `loggedInStatus` property
    }
  },
  methods: {
    async getCityDetails() {
      try {
        const cityId = this.$route.params.cityid
        console.log('City ID:', cityId)
        const response = await Api.get(`/cities/${cityId}`)
        console.log('API Response:', response.data) // Log the entire response

        // Check if the response has the necessary fields
        if (response.data && response.data._id) { // Check if the city ID is present
        // Directly map the response to your city object
          this.city = {
            cityName: response.data.cityName,
            country: response.data.country,
            rating: response.data.rating,
            goodToKnow: response.data.goodToKnow,
            placesToVisit: response.data.placesToVisit.map(placeId => placeId), // Assuming these are just IDs for places
            facts: response.data.facts, // Include any other fields you need
            statistics: response.data.statistics,
            tags: response.data.tags
          }
          console.log(this.city) // Log the city object for verification
        } else {
          console.warn('City not found in response') // This should not trigger now
          this.city = {} // Handle case where city is not found
        }
      } catch (error) {
        console.error('Error fetching city details:', error)
        this.city = {} // Handle API error gracefully
      }
    },
    logout() {
      // Remove the authentication token from localStorage
      localStorage.removeItem('x-auth-token')
      console.log('Logged out successfully')
      // Update the reactive `loggedInStatus` property to force reactivity
      this.loggedInStatus = false
      // Redirect the user to the homepage (or login page)
      this.$router.push('/')
    }
  },
  mounted() {
    this.getCityDetails()
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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@100..900&display=swap');

.city-page-body-container{
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
    flex-wrap: wrap;
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

.b-dropdown .dropdown-item {
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  text-align: inherit;
  border: none;
  font-size: 1.5rem;
  color: #edf7fb;
  transition: color 0.3s;
}

.b-dropdown .dropdown-item:hover {
  color: #bc672a !important;
}

.navbar-item.dropdown .dropdown-item {
  font-size: 1rem;
  color: #edf7fb !important;
}

.dropdown-item {
  margin: 0;
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

.city-layout-wrapper {
  display: flex;
  padding: 9rem 9% 2rem;
  width: 100%;
}

.maincities-right-side-panel .maincities-left-side-panel {
  display: flex;
  justify-content: center;
  align-items: center;
}

.maincities-left-side-panel {
  display: flex;
  flex-direction: row;
  background-color: #edf7fb;

}

.heading {
    font-size: 1.5em;
    font-weight: bold;
}

.maincities-right-side-panel {
    background-color: #759cab;
    flex-direction: column;
    display: flex;
    align-items: center;
    min-width: 30vw;
}

.maincities-right-side-panel h2 {
    color: #045768;
    font-size: 2rem;
    padding: 0.5rem;
    margin: 1rem 0;
}

.maincities-right-side-panel h4 {
    color: #045768;
    font-size: 1.5rem;
}

.maincities-button-wrapper {
    flex-direction: row;
    display: flex;
    gap: 2rem;
}

.maincities-button-wrapper .maincities-tags-btn,
.maincities-button-wrapper .maincities-ratings-btn {
    display: inline-block;
    padding: 0.5rem 2rem;
    color: #edf7fb;
    background-color: #9BA9B6;
    border: none;
    text-align: center;
    transition: 0.8s all;
    max-width: 7rem;
    text-decoration: none; /* Removes underline from links */

}

.maincities-button-wrapper .maincities-tags-btn:hover,
.maincities-button-wrapper .maincities-ratings-btn:hover {
    color: #edf7fb;
    background-color: #bc672a;
    transform: scale(1.05);
}

.trending-cities-wrapper {
  gap: 2rem;
}

.trending-city-wrapper {
  max-width: 20rem;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
  justify-content:last baseline;
}

.trending-city-wrapper p{
  font-size: 1rem;
  align-content: center;
  padding: 0.5rem;
  justify-items: center;
  margin: 0.5rem;
}

.trending-cities-img {
  max-width: 35%;
  margin: 1rem;
}

.trending-city-wrapper img{
  border: 1px solid #edf7fb;
}

.logo img{
  max-height: 4rem;
}

a img {
  max-height: 1rem;
  color: #42515e;
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

.slide-title{
  font-size: 3rem;
}

.maincities-left-side-panel{
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 50vw;
  align-content: flex-start;
}

.pagination-wrapper{
  order: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 1rem;
}

#city-slide{
  order: 1;
  padding: 1.5rem;
}

.detail-about-city{
    color: #759CAB;
    font-size: 1.2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.detail-item{
  padding: 1rem 0;
}

.detail-about-city p,
.places-list li a{
  text-align: left;
  margin: 0.1px;
  color: #759CAB;
  font-size: 1.1rem;
}

.places-list li a{
  text-decoration: none;
  transition: all 0.5s;
}

.places-list li a:hover{
  text-decoration-line: underline;
  color: #acbbc1;
}

.star-rating{
  text-align: left;
  font-size: 2rem;
}

.star-rating i {
  margin-right: 5px; /* Increase space between stars */
}

.rating-text {
  margin-left: 0.5rem;
  font-size: 0.6em;
  color: #42515E;
}

.tag-bubble{
  background-color: #CAC4D0;
  color: #edf7fb;
  border-radius: 5px;
  border: 3px solid white;
  padding: 10px 30px;
  margin: 12px;
  font-size: 0.8rem;
}

.tag-container{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
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
    .layout-wrapper{
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

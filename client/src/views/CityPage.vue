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
            <h1 class="title-city">{{ city.cityName }}, {{ city.country }}</h1>
            <div class="star-rating">
                <span class="stars">
                    <i v-for="star in 5"
                    :key="star"
                    :class="['fa-star', city.rating >= star ? 'fas' : 'far']"
                    style="color: #bc672a;"></i>
                </span>
                <span class="rating-text">{{ city.rating }}/5.0</span>
            </div>
            <div class="good-to-know-wrapper">
                <p><strong class="heading">Good to know:</strong></p>
                <p class="detail-text">{{ city.goodToKnow }}</p>
            </div>
            <div class="facts-wrapper">
                <p><strong class="heading">Facts:</strong></p>
                <p class="detail-text">{{ city.facts }}</p>
            </div>
            <div class="statistics-wrapper">
                <p><strong class="heading">Statistics:</strong></p>
                <p class="detail-text">{{ city.statistics }}</p>
            </div>
            <div class="tags-wrapper">
                <p><strong class="heading">Tags:</strong></p>
              <div class="tag-container">
              <div
                  v-for="tag in city.tags"
                  :key="tag"
                  class="tag-bubble"
                >
                  {{ tag }}
                </div>
              </div>
            </div>
            <div class="places-wrapper">
                <p><strong class="heading">Places to Visit:</strong></p>
                <ul class="places-list">
                    <li v-for="place in placesToVisit" :key="place.address">
                    <a :href="`/mainplaces/`">{{ place.placeName }}</a>
                    </li>
                </ul>
            </div>
            <div class="main-cities-link-wrapper">
              <router-link to="/maincities" class="city-link">back to cities</router-link>
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
      placesToVisit: [],
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
    async getPlaces() {
      try {
        const cityId = this.$route.params.cityid
        const response = await Api.get(`/cities/${cityId}/placesToVisit`)
        console.log('API Response:', response.data)
        if (response.data && Array.isArray(response.data)) {
          this.placesToVisit = response.data.map(place => ({
            placeName: place.placeName,
            address: place.address
          }))
        } else {
          console.warn('No places found or places is not an array')
          this.places = [] // Correctly clear the places array
        }
        console.log(response.data.placesToVisit)
      } catch (error) {
        console.error('Error fetching places details:', error.message)
        this.places = [] // Handle API error gracefully
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
    this.getPlaces()
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

/*EVERY page stylings*/

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

/*city page stylings*/
.city-layout-wrapper {
  display: flex;
  flex-direction: column;
  background-color: #edf7fb;
  align-content: center;
  justify-items: center;
  margin: 10rem 7rem 4rem 7rem;
  padding: 3rem;
  gap: 1.5rem;
}

.city-layout-wrapper p{
    color: #759cab;
}

.title-city{
    font-size: 4rem;
    color: #759cab;
}

.heading {
    font-size: 2rem;
    font-weight: bold;
}

.star-rating{
  text-align: left;
  font-size: 2.5rem;
}

.star-rating i {
  margin-right: 5px; /* Increase space between stars */
}

.rating-text {
  margin-left: 0.5rem;
  font-size: 0.7em;
  color: #42515E;
}

.detail-text {
  font-size: 1.2rem;
  color: #045768 !important;
}

.places-list li a{
  text-decoration: none;
  transition: all 0.5s;
  color: #045768;
  font-size: 1.2rem;
}

.places-list li a:hover{
  text-decoration-line: underline;
  color: #acbbc1;
  transform: scale(1.05);
}

.main-cities-link-wrapper{
    justify-content: flex-end;
    display: flex;
    padding: 0;
    margin: 0;
}

.main-cities-link-wrapper a{
  color: #bc672a;
  text-decoration: none;
  transition: all 0.5s;
  font-size: 1.6rem;
}

.main-cities-link-wrapper a:hover{
  text-decoration-line: underline;
  color: #acbbc1;
  transform: scale(1.05);
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

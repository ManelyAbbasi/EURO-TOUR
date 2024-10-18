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
              <div class="places-wrapper-header">
                <p><strong class="heading">Places to Visit:</strong></p>
                <div v-if="isAdmin" class="admin-buttons">
                    <button class="create-place-button" @click="createPlaceInCity()"><i class="fa-solid fa-file-pen" style="color: #bc672a;"></i></button>
                </div>
              </div>
                <ul class="places-list">
                    <li v-for="place in placesToVisit" :key="place.address">
                        <router-link :to="`/place/${place.address}`" class="place-link">• {{ place.placeName }}</router-link>
                        <div v-if="isAdmin" class="admin-buttons">
                          <button class="delete-place-button" @click="deletePlaceFromCity(place.address)"><i class="fa-solid fa-trash-can" style="color: #bc672a;"></i></button>
                        </div>
                     </li>
                </ul>
            </div>
            <div class="main-cities-link-wrapper">
              <router-link to="/maincities" class="city-link">back to cities</router-link>
            </div>
      </div>

<!-- New City Form Popup -->
<div class="new-place-popup" :class="{ show: showNewPlaceForm }" v-if="showNewPlaceForm">
  <div class="popup-header">
    <h3>Create New Place</h3>
    <button class="close-button" @click="closeNewPlaceForm">X</button>
  </div>
  <div class="popup-body">
    <form @submit.prevent="submitNewPlace">
      <div class="form-layout">
        <div class="form-left">
          <label for="placeName">Place Name:</label>
          <input type="text" id="placeName" v-model="newPlaceName" required />

          <label for="address">Address:</label>
          <input type="text" id="address" v-model="address" placeholder="Enter the address..." />

          <label for="content">Content:</label>
          <textarea id="content" v-model="content" placeholder="Enter important information..."></textarea>

          <label for="rating">Rating:</label>
          <input type="number" id="rating" v-model="rating" min="0" max="10" step="0.1" placeholder="Enter a rating (0-5)" />

          <div class="submit-wrapper">
            <button type="submit">Submit</button>
          </div>
        </div>
        <div class="form-right">
          <label for="tags">Tags:</label>
          <div class="tags">
            <label v-for="tag in tagOptions" :key="tag">
              <input type="checkbox" :value="tag" v-model="selectedTags" />
              {{ tag }}
            </label>
          </div>
        </div>
      </div>
    </form>
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
      showNewPlaceForm: false,
      isAdmin: false,
      tagOptions: [ // List of tag options
        'historical',
        'adventurous',
        'party',
        'sight-seeing',
        'recently opened',
        'nature',
        'beachy',
        'museum',
        'food',
        'popular',
        'affordable',
        'high-end',
        'lgbtq+ friendly',
        'quiet',
        'shopping',
        '18+'
      ],
      selectedTags: [],
      placesToVisitLink: '', // New property to store the link to places to visit
      loggedInStatus: !!localStorage.getItem('x-auth-token') // Reactive property for login status
    }
  },
  async created() {
    await this.checkIfAdmin() // Check if the user is an admin when the component is created
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
        const response = await Api.get(`/api/cities/${cityId}`)
        if (response.data && response.data.city) {
          this.city = { ...response.data.city }

          this.placesToVisitLink = response.data.links.placesToVisit
          await this.getPlaces()
        }
      } catch (error) {
        console.error('Error fetching city details:', error)
      }
    },
    async getPlaces() {
      try {
        const response = await Api.get(this.placesToVisitLink)
        if (Array.isArray(response.data)) {
          this.placesToVisit = response.data
        }
      } catch (error) {
        console.error('Error fetching places details:', error)
      }
    },
    async deletePlaceFromCity(address) {
      const confirmed = confirm('Are you sure you want to delete this place?')
      if (!confirmed) return
      try {
        const cityId = this.$route.params.cityid
        const response = await Api.delete(`/api/cities/${cityId}/placesToVisit/${address}`, {
          headers: { 'x-auth-token': localStorage.getItem('x-auth-token') }
        })
        if (response.status === 200) {
          this.placesToVisit = this.placesToVisit.filter(place => place.address !== address)
          await Api.delete(`/api/places/${address}`, {
            headers: { 'x-auth-token': localStorage.getItem('x-auth-token') }
          })
          alert('Place deleted successfully')
        }
      } catch (error) {
        console.error('Error deleting place:', error)
      }
    },
    async createPlaceInCity() {
      this.showNewPlaceForm = true
      this.newPlaceName = ''
      this.content = ''
      this.address = ''
      this.rating = null
      this.selectedTags = []
    },
    closeNewPlaceForm() {
      this.showNewPlaceForm = false
      this.resetForm()
    },
    async submitNewPlace() {
      const cityId = this.$route.params.cityid
      const placeData = {
        placeName: this.newPlaceName,
        content: this.content,
        address: this.address,
        rating: this.rating,
        tags: this.selectedTags
      }
      try {
        const response = await Api.post(`/api/cities/${cityId}/placesToVisit`, placeData, {
          headers: { 'x-auth-token': localStorage.getItem('x-auth-token') }
        })
        if (response.status === 201) {
          alert('Place successfully created!')
          this.getPlaces()
        }
      } catch (error) {
        console.error('Error saving place:', error)
      }
      this.closeNewPlaceForm()
    },
    async checkIfAdmin() {
      try {
        const response = await Api.get('/api/admin/verify-admin', {
          headers: { 'x-auth-token': localStorage.getItem('x-auth-token') }
        })
        this.isAdmin = response.data.isAdmin
      } catch (error) {
        console.error('Error checking admin status:', error)
      }
    },
    resetForm() {
      this.newPlaceName = ''
      this.content = ''
      this.address = ''
      this.rating = null
      this.selectedTags = []
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

.admin-buttons button {
    border: none;
    background-color: #edf7fb;
    padding: 0.5rem 0.5rem;
    margin: 0 0 0 3rem;
    font-size: 1.5rem;
    transition: all 0.4s;
}

.admin-buttons button:hover{
  transform: scale(1.07);
}

.places-list li{
  display: flex;
  flex-direction: row;
  align-items: center;
  list-style-type: circle;
  justify-content: space-between;
  width: 80%;
}

.places-wrapper-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.places-wrapper {
  width: 60%;
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

/* pop up form */

.form-layout {
  display: flex; /* Flexbox for layout */
  justify-content: space-between; /* Space between left and right sections */
}

/* Left side of the form */
.form-left {
  width: 60%; /* Take up 60% of the width */
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.submit-wrapper{
  display: flex;
  justify-content: center;
  margin: 3rem;
}
/* Right side of the form */
.form-right {
  width: 35%; /* Take up 35% of the width */
  padding-left: 20px; /* Space between left and right sections */
}

.new-place-popup form {
  display: flex;
  flex-direction: column;
}

/* New Place Form Popup Styles */
.new-place-popup {
  position: sticky;
  margin-top: -20rem;
  left: 50%;
  transform: translate(-50%, -50%); /* Center the popup */
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  color:#045768;
  z-index: 10;
  width: 650px; /* Increased width */
  max-width: 90%; /* Ensures the popup fits within smaller screens */
  height:630px;
  max-height: 100vh; /* Ensures the popup doesn't go off the screen */
  padding: 20px;
  overflow-y: auto; /* Allows scrolling if the content is too long */
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

/* Show the popup with opacity */
.new-place-popup.show {
  opacity: 1; /* Fully visible */
  transform: translate(-50%, -50%) scale(1.05); /* Slightly scale up on appearance */
}

/* Ensure the popup header has consistent styling */
.popup-header {
  position: sticky;
  top: 0;
  padding: 1px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  z-index: 2; /* Increased z-index to ensure it stays above the content */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#rating {
  width: 50%; /* Set the width to 100% of its container */
  border-radius:4px;
  padding-left: 5px; /* Add left padding to text fields as well */
  border: 1px solid #ccc;
}

/* Style for tags */
.tags label {
  display: block; /* Stack tags vertically */
  margin: 4px 0; /* Margin for spacing between tags */
  font-size: 0.8rem;
}

.tags{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0.2rem;
}

/* Input Fields Styles */
.new-place-popup input[type="text"],
.new-place-popup textarea,
#rating {
  color: #a7561c;
}

/* Change border color on focus */
.new-place-popup input[type="text"]:focus,
.new-place-popup textarea:focus,
#rating:focus {
  border-color: #BC672A; /* Darker shade on focus */
  outline: none; /* Remove default outline */
}

/* Style for the form inputs */
input[type="text"],
input[type="textarea"] {
  width: calc(100% - 20px); /* Full width minus padding */
  padding: 10px; /* Padding for input fields */
  margin: 10px 0; /* Margin between fields */
  border: 1px solid #ccc; /* Light grey border */
  border-radius: 4px; /* Rounded corners */
}

input[type='checkbox'] {
    accent-color: #BC672A;
}

.new-place-popup form button[type="submit"] {
  background-color: #BC672A;
  color: white;
  border: none;
  padding: 10px 40px;
  text-align: center;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: -30px; /* Adjust this value to move it upwards */
  margin-right: 4rem;
}

.new-place-popup form button[type="submit"]:hover {
  background-color: #a7561c; /* Darker on hover */
}

.close-button {
  background-color: #BC672A;
  border: 2px solid #BC672A;
  font-size: 15px;
  cursor: pointer;
  color: #fff;
  transition: color 0.3s ease;
  width: 25px; /* Set width */
  height: 25px; /* Set height */
}

.close-button:hover{
  background-color:#a7561c;
}

@media screen and (max-width:1200px) {
    .navbar{
        width: 100%;
        display: flex;
        justify-content: space-evenly;
    }
}

@media screen and (max-width: 768px){
    .footer{
        padding: 2rem 3%;
    }
    .navbar{
        width: 100%;
        display: flex;
        justify-content: space-evenly;
        flex-wrap: wrap;
        align-items: center;
    }
    .navbar a{
      font-size: 100%;
    }
    .navbar img{
      max-width: 50%;
    }
    .euro-tour-header{
        flex-direction: column;
        gap: 0.7rem;
        padding: 0.5rem ;
    }
    .city-layout-wrapper{
      margin: 12.5rem 2rem 4rem 2rem;
      display: flex;
      justify-content: center;
    }
    .places-wrapper{
      width: 100%;
    }
    .main-cities-link-wrapper{
      justify-content: center;
    }
    .title-city{
    font-size: 3rem;
    }
}

@media screen and (max-width:580px) {
  .title-city{
    font-size: 2rem;
  }
  .star-rating{
    font-size: 2rem;
  }
  .heading{
    font-size: 1.3rem;
  }
  .detail-text{
    font-size: 1rem;
  }
  .tag-bubble{
    margin: 8px;
  }
  .main-cities-link-wrapper a{
    font-size: 1.3rem;
  }
  .admin-buttons button {
    font-size: 1.3rem;
  }
}

@media screen and (max-width:350px) {
    .footer{
        flex-direction: column-reverse;
    }
    .city-layout-wrapper{
      margin: 1rem 1rem 1rem 1rem;
      display: flex;
      justify-content: center;
      padding: 1rem;
    }
    .euro-tour-header{
      position: static;
    }
    .navbar a{
      font-size: 80%;
    }
    .heading{
      justify-content: center;
      display: flex;
    }
    .detail-text {
      text-align:center;
    }
    .main-cities-link-wrapper a{
    font-size: 1rem;
  }
}
</style>

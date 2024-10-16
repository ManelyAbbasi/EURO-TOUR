<template>
  <div class="place-page-body-container">
    <header class="euro-tour-header">
      <div class="logo-wrapper">
        <router-link to="/" class="logo">
          <img src="@/assets/horizontal-logo.png" alt="Euro Tour logo" />
        </router-link>
      </div>
      <nav class="navbar">
        <a href="#favourites" class="navbar-item"><i class="fa-regular fa-heart" style="color: #edf7fb;"></i> favourites</a>
        <router-link to="/maincities" class="navbar-item"><i class="fa-solid fa-city"></i> cities</router-link>
        <router-link to="/mainplaces" class="navbar-item mainplaces-navbar-item"><i class="fa-solid fa-map-pin" style="color: #edf7fb;"></i> places to visit</router-link>
        <b-dropdown size="lg" variant="link" toggle-class="text-decoration-none" no-caret class="navbar-item dropdown">
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
        <div class="wrapper-header">
          <h1 class="title-place">{{ place.placeName }}</h1>
          <div v-if="isAdmin" class="admin-buttons">
            <button @click="showEditPlaceForm(place.content)"><i class="fa-solid fa-file-pen" style="color: #bc672a;"></i></button>
            <button @click="deletePlace"><i class="fa-solid fa-trash-can" style="color: #bc672a;"></i></button>
          </div>
        </div>
        <div class="star-rating">
          <span class="stars">
            <i v-for="star in 5" :key="star" :class="['fa-star', place.rating >= star ? 'fas' : 'far']" style="color: #bc672a;"></i>
          </span>
          <span class="rating-text">{{ place.rating }}/5.0</span>
        </div>
        <div class="city-wrapper">
          <p><strong class="heading">City:</strong></p>
          <router-link :to="`/city/${place.cityId}`" class="city-link detail-text">{{ place.cityName }}</router-link>
        </div>
        <div class="address-wrapper">
          <p><strong class="heading">Address:</strong></p>
          <p class="detail-text">{{ place.address }}</p>
        </div>
        <div class="content-wrapper">
          <p><strong class="heading">Content:</strong></p>
          <p class="detail-text">{{ place.content }}</p>
        </div>
        <div class="tags-wrapper">
          <p><strong class="heading">Tags:</strong></p>
          <div class="tag-container">
            <div v-for="tag in place.tags" :key="tag" class="tag-bubble">{{ tag }}</div>
          </div>
        </div>
        <div class="main-places-link-wrapper">
          <router-link to="/mainplaces" class="place-link">back to places to visit</router-link>
        </div>
      </div>

      <!-- Edit Place Form Popup -->
<div class="edit-place-popup" :class="{ show: showEditForm }" v-if="showEditForm">
  <div class="popup-header">
    <h3>Edit Place Content</h3>
    <button class="close-button" @click="hideEditPlaceForm">X</button>
  </div>
  <div class="popup-body">
    <form @submit.prevent="submitEditPlace">
      <label for="placeName">Place Name:</label>
      <input type="text" id="placeName" v-model="editPlaceName" />

      <label for="address">Address:</label>
      <input type="text" id="address" v-model="editAddress" />

      <label for="rating">Rating:</label>
      <input type="number" id="rating" v-model="editRating" min="0" max="5" step="0.1" />

      <label for="content">Content:</label>
      <textarea v-model="editPlaceContent"></textarea>

      <label for="tags">Tags:</label>
      <div class="tags">
        <label v-for="tag in tagOptions" :key="tag">
          <input type="checkbox" :value="tag" v-model="editTags" />
          {{ tag }}
        </label>
      </div>

      <button type="submit">Save</button>
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
      place: {}, // Object to hold place details
      isAdmin: false,
      loggedInStatus: !!localStorage.getItem('x-auth-token'), // Reactive property for login status
      showEditForm: false,
      editPlaceName: '', // To hold the place name when editing
      editAddress: '', // To hold the address when editing
      editRating: null, // To hold the rating when editing
      editPlaceContent: '', // To hold the content when editing
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
      ]
    }
  },
  async created() {
    await this.checkIfAdmin() // Check if the user is an admin when the component is created
    this.getPlace() // Fetch place details
  },
  computed: {
    isLoggedIn() {
      return this.loggedInStatus // Use reactive `loggedInStatus` property
    }
  },
  methods: {
    async getPlace() {
      try {
        const address = decodeURIComponent(this.$route.params.address)
        console.log('Place address:', address)
        const response = await Api.get(`/places/${address}`)
        console.log('API Response:', response.data) // Log the entire response

        if (response.data && response.data.address) { // Check if the place data is present
          // Directly map the response to your place object
          this.place = {
            placeName: response.data.placeName,
            address: response.data.address,
            rating: response.data.rating,
            content: response.data.content,
            tags: response.data.tags,
            cityName: response.data.city.cityName,
            cityId: response.data.city._id
          }
          console.log(this.place) // Log the place object for verification
        } else {
          console.warn('Place not found in response') // This should not trigger now
          this.place = {} // Handle case where place is not found
        }
      } catch (error) {
        console.error('Error fetching place details:', error)
        this.place = {} // Handle API error gracefully
      }
    },
    async deletePlace() {
      try {
        const address = this.place.address
        const confirmed = confirm(`Are you sure you want to delete ${this.place.placeName}?`)
        if (confirmed) {
          await Api.delete(`/places/${address}`, {
            headers: {
              'x-auth-token': localStorage.getItem('x-auth-token')
            }
          })
          console.log(`Place ${this.place.placeName} deleted successfully.`)
          this.$router.push('/mainplaces')
        }
      } catch (error) {
        console.error('Error deleting place:', error)
      }
    },
    showEditPlaceForm(place) {
      this.editPlaceName = place.placeName
      this.editAddress = place.address
      this.editRating = place.rating
      this.editPlaceContent = place.content
      this.editTags = place.tags
      this.showEditForm = true
    },
    hideEditPlaceForm() {
      this.showEditForm = false
      this.editPlaceName = ''
      this.editAddress = ''
      this.editRating = null
      this.editPlaceContent = ''
      this.editTags = []
    },
    async submitEditPlace() {
      try {
        const address = this.place.address
        const response = await Api.patch(`/places/${address}`, {
          content: this.editPlaceContent
        }, {
          headers: {
            'x-auth-token': localStorage.getItem('x-auth-token')
          }
        })
        console.log('Place updated successfully:', response.data)
        this.place.content = this.editPlaceContent
        this.hideEditPlaceForm()
      } catch (error) {
        console.error('Error updating place:', error)
      }
    },
    async checkIfAdmin() {
      try {
        const response = await Api.get('/admin/check-admin', {
          headers: {
            'x-auth-token': localStorage.getItem('x-auth-token')
          }
        })
        this.isAdmin = response.data.isAdmin
      } catch (error) {
        console.error('Error checking admin status:', error)
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

.place-page-body-container{
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

.mainplaces-navbar-item,
.mainplaces-navbar-item i{
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

.wrapper-header{
    display: grid;
    justify-content: space-between;
    grid-template-columns: 6fr 1fr;
}

.wrapper-header button {
    border: none;
    background-color: #edf7fb;
    padding: 0.5rem 0.5rem;
    margin: 0 0 0 3rem;
    font-size: 2rem;
}

.title-place{
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
  text-decoration: none;
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

.main-places-link-wrapper{
    justify-content: flex-end;
    display: flex;
    padding: 0;
    margin: 0;
}

.main-places-link-wrapper a{
  color: #bc672a;
  text-decoration: none;
  transition: all 0.5s;
  font-size: 1.6rem;
}

.city-link{
  transition: all 0.3s;
  font-size: 1.4rem;
}

.main-places-link-wrapper a:hover,
.city-link:hover{
  text-decoration-line: underline;
  color: #acbbc1 !important;
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

/* Styling for the Edit Place Form */
.edit-place-popup {
  position: sticky;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  color: #045768;
  z-index: 10;
  width: 650px; /* Adjust width as needed */
  max-width: 90%; /* Ensures the popup fits within smaller screens */
  padding: 20px;
  margin-top: 2rem; /* Adjust as needed to fit the design */
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

/* Show the popup with opacity */
.edit-place-popup.show {
  opacity: 1; /* Fully visible */
  transform: translate(-50%, 0) scale(1.05); /* Slightly scale up on appearance */
}

/* Ensure the popup header has consistent styling */
.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
}

/* Style for the form content */
.popup-body {
  display: flex;
  flex-direction: column;
}

.popup-body textarea {
  width: 100%;
  min-height: 100px;
  margin-bottom: 1rem;
  padding: 10px;
  border: 1px solid #ccc; /* Light grey border */
  border-radius: 4px; /* Rounded corners */
  color: #a7561c; /* Text color */
}

/* Change border color on focus */
.popup-body textarea:focus {
  border-color: #BC672A; /* Darker shade on focus */
  outline: none; /* Remove default outline */
}

.popup-body button {
  background-color: #BC672A;
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  align-self: flex-end; /* Align button to the right */
}

.popup-body button:hover {
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

.close-button:hover {
  background-color: #a7561c;
}

</style>

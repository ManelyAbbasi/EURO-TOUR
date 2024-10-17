<template>
    <div class="mainplaces-body-container">
      <header class="euro-tour-header">
        <div class="logo-wrapper">
          <router-link to="/" class="logo">
            <img src="@/assets/horizontal-logo.png" alt="Euro Tour logo" />
          </router-link>
        </div>
        <nav class="navbar">
          <a href="#favourites" class="navbar-item"><i class="fa-regular fa-heart" style="color: #edf7fb;"></i> favourites</a>
          <router-link to="/maincities" class="navbar-item"
            ><i class="fa-solid fa-city" ></i> cities</router-link>
        <router-link to="/mainplaces" class="navbar-item mainplaces-navbar-item"><i class="fa-solid fa-map-pin" style="color: #edf7fb;"></i> places to visit</router-link>
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
        <div class="mainplaces-layout-wrapper">
          <div class="mainplaces-left-side-panel">

            <!-- display new text for each slide -->
            <div class="pagination-wrapper">
            <div class="mt-3">
              <b-pagination v-model="currentPage" pills :total-rows="places.length" :per-page="perPage"></b-pagination>
            </div>
          </div>

          <div id="place-slide">
            <div v-for="place in paginatedPlaces" :key="place.placeName" class="place-item">
              <div class="detail-about-place">
                <div class="slide-title-wrapper">
                  <span class="slide-title">{{ place.placeName }}</span>
                  <button class="edit-placename-button" v-if="isAdmin" @click="editPlaceName()">
                    <i class="fa-solid fa-i-cursor fa-beat-fade" style="color: #bc672a;"></i>
                  </button>
                </div>
                <div class="star-rating">
                  <i v-for="n in Math.floor(place.rating)" :key="n" class="fa-solid fa-star" style="color: #bc672a;"></i>
                  <i v-for="n in 5 - Math.floor(place.rating)" :key="'empty-' + n" class="fa-regular fa-star" style="color: #bc672a;"></i>
                  <span class="rating-text">{{ place.rating }}/5.0</span>
                </div>
                <div class="detail-item">
                  <p><strong class="heading">City:</strong></p>
                  <router-link :to="`/city/${place.city._id}`" class="city-link">{{ place.city.cityName }}</router-link>
                </div>
                <div class="detail-item">
                  <p><strong class="heading">Address:</strong></p>
                  <p>{{ place.address }}</p>
                </div>
                <div class="read-more-wrapper">
                  <router-link :to="`/place/${place.address}`" class="place-link">read more</router-link>
                </div>
          </div>
        </div>
      </div>

        </div>

          <div class="mainplaces-right-side-panel">
                <!--search and trending-->
                <h3 class="mainplaces-search-title">Search places to visit by: <i class="fa-solid fa-filter" style="color: #045768;"></i></h3>
                <div class="mainplaces-button-wrapper">
                  <router-link to="/SearchPlacesByTag" class="mainplaces-tags-btn">tags</router-link>
                    <h4 class="mainplaces-or">or</h4>
                    <router-link to="/SearchPlacesByRating" class="mainplaces-ratings-btn">ratings</router-link>
                </div>
                <h2 class="mainplaces-admin-header">Admins Picks:</h2>
                <div class="trending-places-wrapper">
                  <div class="mainplaces-amst-wrapper trending-place-wrapper">
                    <img src="@/assets/Amsterdam.jpg" alt="Amsterdam city" class="trending-places-img"/>
                    <p class="mainplaces-trending-amst">1. Amsterdam, The Netherlands</p>
                  </div>
                  <div class="mainplaces-dublin-wrapper trending-place-wrapper">
                    <img src="@/assets/Dublin.jpg" alt="Dublin city" class="trending-places-img"/>
                    <p class="mainplaces-trending-dublin">2. Dublin, Republic of Ireland</p>
                  </div>
                  <div class="mainplaces-paris-wrapper trending-place-wrapper">
                    <img src="@/assets/Paris.jpg" alt="Paris city" class="trending-places-img"/>
                    <p class="mainplaces-trending-paris">3. Paris, France</p>
                  </div>
                </div>
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
      places: [],
      message: 'none',
      loggedInStatus: !!localStorage.getItem('x-auth-token'), // Reactive property for login status
      rows: 100,
      currentPage: 1,
      perPage: 1,
      isAdmin: false
    }
  },
  async created() {
    await this.checkIfAdmin() // Check if the user is an admin when the component is created
  },
  computed: {
    isLoggedIn() {
      return this.loggedInStatus // Use reactive `loggedInStatus` property
    },
    paginatedPlaces() {
      const start = (this.currentPage - 1) * this.perPage
      const end = start + this.perPage
      console.log('Paginated places:', this.places.slice(start, end))
      return this.places.slice(start, end)
    }
  },
  methods: {
    async getPlaces() {
      try {
        const response = await Api.get('/places')
        console.log('Fetched places:', response.data.placesToVisit)
        if (response.data && response.data.placesToVisit) {
          this.places = response.data.placesToVisit.map(place => ({
            placeName: place.placeName,
            address: place.address,
            rating: place.rating,
            content: place.content,
            tags: place.tags,
            city: place.city
          }))
        } else {
          this.places = []
        }
      } catch (error) {
        console.error('Error fetching places:', error)
        this.places = []
      }
    },
    toggleFavorite() {
      this.isFavorite = !this.isFavorite // Toggle between true and false
    },
    getMessage() {
      Api.get('/')
        .then(response => {
          this.message = response.data.message
        })
        .catch(error => {
          this.message = error
        })
    },
    async checkIfAdmin() {
      try {
        const response = await Api.get('/admin/check-admin', {
          headers: { 'x-auth-token': localStorage.getItem('x-auth-token') }
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

.mainplaces-body-container{
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

.mainplaces-layout-wrapper {
  display: grid;
  grid-template-columns: 2fr 1fr;  /* Create two equal columns */
  grid-gap: 20px;
  padding: 9rem 9% 2rem;
  width: 100%;
}

.mainplaces-right-side-panel .mainplaces-left-side-panel {
  display: flex;
  justify-content: center;
  align-items: center;
}

.mainplaces-left-side-panel {
  display: flex;
  flex-direction: row;
  background-color: #edf7fb;

}

.heading {
    font-size: 1.5em;
    font-weight: bold;
}

.read-more-wrapper a{
  color: #bc672a;
  text-decoration: none;
  transition: all 0.5s;
  font-size: 1.6rem;
}

.read-more-wrapper a:hover{
  text-decoration-line: underline;
  color: #acbbc1;
  transform: scale(1.05);
}

.mainplaces-right-side-panel {
    background-color: #759cab;
    flex-direction: column;
    display: flex;
    align-items: center;
    min-width: 30vw;
}

.mainplaces-right-side-panel h2 {
    color: #045768;
    font-size: 2rem;
    padding: 0.5rem;
    margin: 1rem 0;
}

.mainplaces-right-side-panel h4 {
    color: #045768;
    font-size: 1.5rem;
}

.mainplaces-button-wrapper {
    flex-direction: row;
    display: flex;
    gap: 2rem;
}

.mainplaces-button-wrapper .mainplaces-tags-btn,
.mainplaces-button-wrapper .mainplaces-ratings-btn {
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

.mainplaces-button-wrapper .mainplaces-tags-btn:hover,
.mainplaces-button-wrapper .mainplaces-ratings-btn:hover {
    color: #edf7fb;
    background-color: #bc672a;
    transform: scale(1.05);
}

.mainplaces-right-side-panel h3{
  font-size: 1.5rem;
  color: #045768;
  padding: 0.5rem;
  margin: 1rem 0;
}

.trending-place-wrapper {
  max-width: 20rem;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
  justify-content:last baseline;
}

.trending-place-wrapper p{
  font-size: 1rem;
  align-content: center;
  padding: 0.5rem;
  justify-items: center;
  margin: 0.5rem;
}

.trending-places-img {
  max-width: 35%;
  margin: 1rem;
}

.trending-place-wrapper img{
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

.slide-title-wrapper{
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}

.edit-placename-button {
  border: none;
  background-color: #edf7fb;
  margin-right: 2rem;
  margin-top: 0.5rem;
}

.edit-placename-button i {
  font-size: 1.7rem;
}

.slide-title{
  font-size: 3rem;
}

.mainplaces-left-side-panel{
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

#place-slide{
  order: 1;
  padding: 1.5rem;
}

.detail-about-place{
    color: #759CAB;
    font-size: 1.2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.detail-item{
  padding: 1rem 0;
}

.detail-about-place p {
  text-align: left;
  margin: 0.1px;
  color: #759CAB;
  font-size: 1.1rem;
}

.city-link{
  text-align: left;
  margin: 0.1px;
  color: #759CAB;
  font-size: 1.5rem;
  text-decoration: none;
  transition: all 0.5s;

}

.city-link:hover{
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

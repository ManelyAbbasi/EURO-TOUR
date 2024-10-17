<template>
    <div class="maincities-body-container">
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
        <div class="maincities-layout-wrapper">
          <div class="maincities-left-side-panel">

            <!-- display new text for each slide -->
              <div class="pagination-wrapper">
                <div class="mt-3">
                  <b-pagination v-model="currentPage" pills :total-rows="cities.length" :per-page="perPage"></b-pagination>
                </div>
              </div>

            <!-- City slide -->
      <div id="city-slide">
        <div v-for="city in paginatedCities" :key="city.cityName" class="city-item">
          <div class="detail-about-city">
            <span class="slide-title">{{ city.cityName }}, {{ city.country }}</span>
              <div class="star-rating">
               <!-- Display filled stars -->
               <i v-for="n in Math.floor(city.rating)" :key="n" class="fa-solid fa-star" style="color: #bc672a;"></i>
                <!-- Display empty stars for remaining ones -->
                <i v-for="n in 5 - Math.floor(city.rating)" :key="'empty-' + n" class="fa-regular fa-star" style="color: #bc672a;"></i>
              <span class="rating-text">{{ city.rating }}/5.0</span>
            </div>
            <div class="detail-item">
              <p><strong class="facts-heading">Facts:</strong></p>
              <p>{{ city.facts }}</p>
            </div>
            <div class="read-more-wrapper">
              <router-link :to="`/city/${city.id}`" class="city-link">read more</router-link>
            </div>
          </div>
        </div>
      </div>

        </div>

          <div class="maincities-right-side-panel">
                <!--search and trending-->
                <h2 class="maincities-search-title">Search cities by: <i class="fa-solid fa-filter" style="color: #045768;"></i></h2>
                <div class="maincities-button-wrapper">
                  <router-link to="/searchCityByTag" class="maincities-tags-btn">tags</router-link>
                    <h4 class="maincities-or">or</h4>
                    <router-link to="/SearchCityByRating" class="maincities-ratings-btn">ratings</router-link>
                </div>
                <h2 class="maincities-search-title">Admins Picks:</h2>
                <div class="trending-cities-wrapper">
                  <div class="maincities-amst-wrapper trending-city-wrapper">
                    <img src="@/assets/Amsterdam.jpg" alt="Amsterdam city" class="trending-cities-img"/>
                    <p class="maincities-trending-amst">1. Amsterdam, The Netherlands</p>
                  </div>
                  <div class="maincities-dublin-wrapper trending-city-wrapper">
                    <img src="@/assets/Dublin.jpg" alt="Dublin city" class="trending-cities-img"/>
                    <p class="maincities-trending-dublin">2. Dublin, Republic of Ireland</p>
                  </div>
                  <div class="maincities-paris-wrapper trending-city-wrapper">
                    <img src="@/assets/Paris.jpg" alt="Paris city" class="trending-cities-img"/>
                    <p class="maincities-trending-paris">3. Paris, France</p>
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
      cities: [],
      message: 'none',
      loggedInStatus: !!localStorage.getItem('x-auth-token'), // Reactive property for login status
      rows: 100,
      currentPage: 1,
      perPage: 1
    }
  },
  computed: {
    isLoggedIn() {
      return this.loggedInStatus // Use reactive `loggedInStatus` property
    },
    paginatedCities() {
      const start = (this.currentPage - 1) * this.perPage
      const end = start + this.perPage
      return this.cities.slice(start, end) // Slicing based on the current page and per page count
    }
  },
  methods: {
    async getCities() {
      try {
        const response = await Api.get('/cities')
        if (response.data && response.data.cities) {
          this.cities = response.data.cities.map(city => ({
            cityName: city.cityName,
            country: city.country,
            rating: city.rating,
            goodToKnow: city.goodToKnow,
            facts: city.facts,
            statistics: city.statistics,
            tags: city.tags,
            placesToVisit: city.placesToVisit.map(place => place.placeName),
            id: city._id
          }))
          console.log(this.cities)
        } else {
          this.cities = []
        }
      } catch (error) {
        console.error('Error fetching cities:', error)
        this.cities = []
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
    this.getCities()
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

.maincities-body-container{
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
    min-width: 1200px;
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

.maincities-layout-wrapper {
  display: grid;
  grid-template-columns: 2fr 1fr;  /* Create two equal columns */
  grid-gap: 20px;
  padding: 9rem 9% 2rem;
  width: 100%;
  justify-content: center;
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
  min-width: 643px;
}

.facts-heading {
    font-size: 1.5em;
    font-weight: bold;
}

.maincities-right-side-panel {
    background-color: #759cab;
    flex-direction: column;
    display: flex;
    align-items: center;
    min-width: 35vw;
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
  text-decoration: none;
  transition: all 0.5s;
  color: #759CAB;
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
    .navbar{
        width: 100%;
        display: flex;
        justify-content: space-evenly;
    }
    .maincities-left-side-panel{
      min-width: 643px;
    }
    .maincities-right-side-panel{
      min-width: 35vw;
    }
    .maincities-layout-wrapper{
      justify-content: center;
    }

}

@media screen and (max-width: 768px){
    .euro-tour-header{
        padding: 2rem 3%;
    }
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
    .euro-tour-header{
        flex-direction: column;
        gap: 2rem;
    }
    .maincities-layout-wrapper{
        flex-direction: column;
        display: flex;
        min-width: 1200px;
        justify-content: center;
    }
    .detail-about-city .slide-title{
      font-size: 3.5rem;
    }
    .maincities-layout-wrapper p,
    .rating-text,
    .star-rating i,
    .read-more-wrapper a{
        font-size: 2rem;
    }
    .maincities-layout-wrapper .facts-heading{
        font-size: 2.5rem;
        font-weight: 400;
    }
    .read-more-wrapper{
      display: flex;
      justify-content: end;
      margin-right: 2rem;
    }
    .maincities-left-side-panel{
      min-width: 984px;
      justify-content: center;

    }
    .maincities-right-side-panel{
      width: 100%;
      min-width: 984px;
      justify-content: center;

    }
    .maincities-left-side-panel{
      margin: 9rem 0 2rem 0;
    }
    .maincities-left-side-panel,
    .maincities-right-side-panel{
      padding: 1.5rem 2rem;
    }
    .maincities-right-side-panel h2{
      font-size: 3.5rem;
      padding: 0.5rem;
    }
    .maincities-button-wrapper{
      margin: 2.5rem;
    }
    h4.maincities-or {
      font-size: 2.5rem;
    }
    .maincities-button-wrapper a{
      padding: 2rem;
      font-size: 2rem;
      min-width: 15rem;
    }
    .trending-city-wrapper{
      display: grid;
      grid-template-columns: 1fr 3fr;
      justify-content: space-between;
      min-width: 45rem;
    }
    .trending-city-wrapper img{
      min-width: 10rem;
    }
}

@media screen and (max-width:350px) {
    .footer{
        flex-direction: column-reverse;
    }
}
</style>

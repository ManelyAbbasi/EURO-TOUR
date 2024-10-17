<template>
    <div class="rating-places-body-container">
      <header class="euro-tour-header">
        <div class="logo-wrapper">
          <router-link to="/" class="logo">
            <img src="@/assets/horizontal-logo.png" alt="Euro Tour logo" />
          </router-link>
        </div>
        <nav class="navbar">
          <a href="#favourites" class="navbar-item"><i class="fa-regular fa-heart" style="color: #edf7fb;"></i> favourites</a>
          <router-link to="/maincities" class="navbar-item"
            ><i class="fa-solid fa-city"></i> cities</router-link>
          <router-link to="/mainplaces" class="navbar-item mainplaces-navbar-item"><i class="fa-solid fa-map-pin"></i> places to visit</router-link>
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

        <b-container class="search-by-panel">

            <b-row>
            <b-col col="4">
                <h2 class="search-places-text">Search places to visit by:</h2>
            </b-col>

            <b-col col="8">
        <div class="filter-options">
        <router-link to="/SearchPlacesByTag">
            <button class="tags-button">tags</button>
        </router-link>

        <router-link to="/SearchPlacesByRating">
            <button class="ratings-button">ratings</button>
        </router-link>

        <i class="fa-solid fa-filter"></i>
        </div>
    </b-col>
    </b-row>
    <b-row>
      <b-col><h4>sort by:</h4></b-col>
      <b-col><button
      class="sort-by-button"
      @click="recordSortOption('desc')"
      :class="{ active: activeSort === 'desc' }"
    >highest to lowest</button></b-col>
      <b-col><button
      class="sort-by-button"
      @click="recordSortOption('asc')"
      :class="{ active: activeSort === 'asc' }"
    >lowest to highest</button></b-col>
    </b-row>
    <b-row class="range-of-ratings-row" >
      <b-col class="range-rating-title">
      <div class="range-rating-title-wrapper">
        <h4>range of ratings:</h4>
      </div>
    </b-col>
    <b-col class="min-rating-column">
      <h5>minimum rating</h5>
      <div class="min-rating-buttons">

        <div class="min-item">
          <div
          class="min-button"
          data-value="1"
          :class="{active: activeMinRating === '1'}"
          @click="selectMinRating('1')"
        ></div>
        <label for="min-rating-1" class="min-rating-label">1</label>
        </div>

        <div class="min-item">
          <div
          class="min-button"
          data-value="2"
          :class="{active: activeMinRating === '2'}"
          @click="selectMinRating('2')"
        ></div>
        <label for="min-rating-2" class="min-rating-label">2</label>
        </div>

        <div class="min-item">
          <div
          class="min-button"
          data-value="3"
          :class="{active: activeMinRating === '3'}"
          @click="selectMinRating('3')"
          ></div>
          <label for="min-rating-3" class="min-rating-label">3</label>
        </div>

        <div class="min-item">
          <div
          class="min-button"
          data-value="4"
          :class="{active: activeMinRating === '4'}"
          @click="selectMinRating('4')"
          ></div>
          <label for="min-rating-4" class="min-rating-label">4</label>
        </div>

        <div class="min-item">
        <div
          class="min-button"
          data-value="5"
          :class="{active: activeMinRating === '5'}"
          @click="selectMinRating('5')"
        ></div>
        <label for="min-rating-5" class="min-rating-label">5</label>
        </div>

      </div>
    </b-col>
    <b-col class="max-rating-column">
      <h5>maximum rating</h5>
      <div class="max-rating-buttons">

        <div class="max-item">
          <div
          class="max-button"
          data-value="1"
          :class="{active: activeMaxRating === '1'}"
          @click="selectMaxRating('1')"
          ></div>
          <label for="max-rating-1" class="max-rating-label">1</label>
      </div>

      <div class="max-item">
        <div
        class="max-button"
        data-value="2"
        :class="{active: activeMaxRating === '2'}"
        @click="selectMaxRating('2')"
        ></div>
      <label for="max-rating-2" class="max-rating-label">2</label>
      </div>

      <div class="max-item">
        <div
        class="max-button"
        data-value="3"
        :class="{active: activeMaxRating === '3'}"
        @click="selectMaxRating('3')"
        ></div>
        <label for="max-rating-3" class="max-rating-label">3</label>
      </div>

      <div class="max-item">
        <div
        class="max-button"
        data-value="4"
        :class="{active: activeMaxRating === '4'}"
        @click="selectMaxRating('4')"
        ></div>
        <label for="max-rating-4" class="max-rating-label">4</label>
      </div>

      <div class="max-item">
      <div
        class="max-button"
        data-value="5"
        :class="{active: activeMaxRating === '5'}"
        @click="selectMaxRating('5')"
      ></div>
      <label for="max-rating-5" class="max-rating-label">5</label>
      </div>
    </div>
    </b-col>

    </b-row>
    <b-row class="reset-options-row">
      <button @click="resetFilters" class="reset-options-button">reset options</button>
    </b-row>
    <b-row>
        <b-col col="12">
          <div v-if="Array.isArray(places) && places.length > 0" class="places-list">
            <div v-for="place in places" :key="place.address" class="place-card">
              <div class="top-half-card">
                <div class="place-img-wrapper">
                  <img src="@/assets/places.png" class="place-card-img"/>
                </div>
                <div class="place-city-text">
                  <router-link :to="`/place/${place.address}`" class="placename-text">{{ place.placeName }}, </router-link>
                  <p>{{ place.city.cityName }}</p>
                </div>
              </div>
                <div class="bottom-half-card">
                  <p>{{ place.rating }}</p>
                  <div class="star-rating">
                    <!-- Display filled stars -->
                    <i v-for="n in Math.floor(place.rating)" :key="n" class="fa-solid fa-star" style="color: #bc672a;"></i>
                    <!-- Display empty stars for remaining ones -->
                    <i v-for="n in 5 - Math.floor(place.rating)" :key="'empty-' + n" class="fa-regular fa-star" style="color: #bc672a;"></i>
                  </div>
                </div>
            </div>
          </div>

          <div v-else>
            <h3 class="no-places-found">No places found.</h3>
          </div>
        </b-col>
      </b-row>

        </b-container>

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
      activeMinRating: null,
      activeMaxRating: null,
      activeSort: null,
      places: [],
      ratings: [1, 2, 3, 4, 5],
      sortOptions: [
        { label: 'Rating: Low to High', value: 'asc' },
        { label: 'Rating: High to Low', value: 'desc' }
      ]
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
  },
  methods: {
    async getPlaces() {
      try {
        // Query params for minRating, maxRating, and sortByRating
        const params = {}

        if (this.activeMinRating) params.minRating = this.activeMinRating
        if (this.activeMaxRating) params.maxRating = this.activeMaxRating
        if (this.activeSort) params.sortByRating = this.activeSort

        const response = await Api.get('/api/places', { params })

        if (response.data && response.data.placesToVisit) {
          this.places = response.data.placesToVisit
        } else {
          this.places = []
        }
      } catch (error) {
        console.error('Error fetching places:', error)
        this.places = []
      }
    },
    recordSortOption(option) {
      this.activeSort = option
      this.getPlaces()
    },
    selectMinRating(minRating) {
      if (!this.activeMaxRating || Number(minRating) <= Number(this.activeMaxRating)) {
        this.activeMinRating = minRating
        this.getPlaces()
      } else {
        this.showToast('Minimum rating cannot be greater than maximum rating.')
      }
    },
    selectMaxRating(maxRating) {
      if (!this.activeMinRating || Number(maxRating) >= Number(this.activeMinRating)) {
        this.activeMaxRating = maxRating
        this.getPlaces()
      } else {
        this.showToast('Maximum rating cannot be less than minimum rating.')
      }
    },
    logout() {
      localStorage.removeItem('x-auth-token')
      this.loggedInStatus = false
      this.$router.push('/')
    },
    resetFilters() {
      this.activeMinRating = null
      this.activeMaxRating = null
      this.activeSort = null
      this.getPlaces()
    },
    showToast(message) {
      alert(message)
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@100..900&display=swap');

.rating-places-body-container {
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
    align-items: center;
}

.search-by-panel {
    background-color: #759cab;
    width: 100rem;
    min-height: 50rem;
    margin-bottom: 35px;
    margin-top: 9rem;
}

.search-places-text {
  font-family: "Lexend Deca", sans-serif;
  color: #045768;
  font-size: 2rem;
  margin-top: 2.5rem;
  margin-left: 3rem;
  justify-content: center;
  text-align: center;
}

.filter-options {
  display: flex;
  gap: 4rem;
  margin-right: 10rem;
}

.tags-button, .ratings-button {
  color: #edf7fb;
  padding: 17px 60px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.2rem;
  margin-block: 40px;
  transition: all 0.4s;
}

.tags-button:hover, .ratings-button:hover{
    transform: scale(1.05);
}

.tags-button{
    background-color: #9BA9B6 ;
    margin-left: 80px;
}

.ratings-button{
    background-color: #bc672a;
    border: none;
}

.filter-options i {
  font-size: 4rem;
  color: #42515e;
  margin-left: 10px;
  margin-block: 40px;
}

h4 {
    color: #045768;
    margin-top: 4rem;
    margin-left: 2rem;

}

.sort-by-button {
    background-color: #8FC6DF;
    color: #42515e;
    border: none;
    padding: 5px 50px;
    font-size: 1.1rem;
    margin-top: 4.4rem;
    transition: all 0.5s;
    margin-right: 2.5rem;
}

.sort-by-button:hover{
  background-color:  #42515e;
  color: #8FC6DF;
  transform: scale(1.03);
}

.sort-by-button.active {
  background-color: #42515e;
  color: #8FC6DF;
  transform: scale(1.03);
}

.range-of-ratings-row{
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-top: 2rem;
}

.range-rating-title {
  display: flex;
  justify-content: center;
  align-items: center;
}
.range-rating-title h4{
  display: flex;
  justify-content: center;
  align-items: center;
}
.range-rating-title-wrapper{
  display: flex;
  justify-content: center;
  align-items: center;
}

.min-rating-column,
.max-rating-column{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2rem;
}
.max-rating-column{
  margin-right: 2rem;
}

.min-rating-buttons label,
.max-rating-buttons label{
    color: #045768;
    font-size: 1.1rem;
    font-family: 'Lexend Deca', sans-serif;
}

.min-rating-buttons,
.max-rating-buttons {
    display: flex;
    gap: 1.8rem;
    margin-left: 2rem;
}

.min-item,
.max-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.min-button,
.max-button{
    width: 1.2rem;
    height: 1.2rem;
    background-color: rgba(0, 0, 0, 0.301);
    cursor: pointer;
    border: 2px solid transparent;
    transition: background-color 0.3s, border-color 0.3s;
}

.min-button:hover,
.max-button:hover{
    border-color: #bc672a;
}

.min-button.active,
.max-button.active {
    background-color: #bc672a;
}

.no-places-found {
    color: #233341;
    justify-content: center;
    display: flex;
    padding: 5rem;
    font-size: 3rem;
}

.reset-options-row{
  justify-content: end;
  padding-right: 4.5rem;
}

.reset-options-button{
  padding: 0.5rem;
  background-color: #233341; /* Red color */
  color: #edf7fb;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 15%;
  transition: all 0.3s;
}

.reset-options-button:hover{
  background-color: #bc672a;
  transform: scale(1.03);
}

h5{
  color: #045768;
}

.euro-tour-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1rem 5%;
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
  border: none;
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

.places-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin: 2rem;
}

.place-card {
    background-color: #9BA9B6;
    border: 1px solid #bc672a;
    border-radius: 8px;
    padding: 1rem;
    margin: 0.5rem;
    flex: 0 1 calc(30% - 1rem); /* Flex item: grow, shrink, basis (30% width minus margin) */
    text-align: center;
}

.place-card{
  transition: box-shadow 0.3s ease;
}

.place-card:hover{
  box-shadow: 0 8px 16px #0457688e;
}

.place-card-img{
  border-radius: 10%;
  margin: 1rem;
  max-height: 4rem;
}

.top-half-card{
  display: grid;
  grid-template-columns: 1fr 2fr;
  padding-bottom: 0.5rem;
}

.place-city-text{
  padding-top: 1rem;
  justify-content: center;
  align-items: center;
}

.place-city-text p {
  margin: 0;
  padding: 0;
  line-height: 1.7;
}

.placename-text{
  font-weight: 700;
  text-decoration: none;
  font-size: 1.25rem;
  color: #196386;
  transition: all 0.3s;
}

.placename-text:hover{
  text-decoration: underline #045768;
  color: #edf7fb;
}

.bottom-half-card{
  gap: 0.5rem;
  max-height: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0;
}

.bottom-half-card p{
  color: #edf7fb;
  font-size: 1.3rem;
}

.star-rating i{
  font-size: 1.5rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .place-card {
        flex: 0 1 calc(45% - 1rem); /* 2 cards per row on smaller screens */
    }
}

@media (max-width: 576px) {
    .place-card {
        flex: 0 1 calc(100% - 1rem); /* 1 card per row on extra small screens */
    }
}

</style>

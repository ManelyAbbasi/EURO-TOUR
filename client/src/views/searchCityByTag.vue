<template>
  <div class="maincities-body-container">
    <header class="euro-tour-header">
      <logo class="logo-wrapper">
        <router-link to="/" class="logo">
          <img src="@/assets/horizontal-logo.png" alt="Euro Tour logo" />
        </router-link>
      </logo>
      <nav class="navbar">
          <a href="#favourites" class="navbar-item"><i class="fa-regular fa-heart" style="color: #edf7fb;"></i> favourites</a>
          <router-link to="/maincities" class="navbar-item maincities-navbar-item"
            ><i class="fa-solid fa-city"></i> cities</router-link>
          <router-link to="/mainplaces" class="navbar-item"><i class="fa-solid fa-map-pin"></i> places to visit</router-link>
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

    <b-container class="search-by-tag-panel">
      <b-row>
        <b-col col="4">
          <h2 class="search-cities-text">Search cities by:</h2>
        </b-col>

        <b-col col="8">
          <div class="filter-options">
            <router-link to="/searchCityByTag">
              <button class="tags-button">tags</button>
            </router-link>
            <router-link to="/searchCityByRating">
              <button class="ratings-button">ratings</button>
            </router-link>
            <i class="fa-solid fa-filter"></i>
          </div>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <div class="available-tags">
            <button class="tag-button" @click="toggleTag('historical')">historical</button>
            <button class="tag-button" @click="toggleTag('quiet')">quiet</button>
            <button class="tag-button" @click="toggleTag('party')">party</button>
            <button class="tag-button" @click="toggleTag('architecture')">architecture</button>
            <button class="tag-button" @click="toggleTag('recently added')">recently added</button>
            <button class="tag-button" @click="toggleTag('nature')">nature</button>
            <button class="tag-button" @click="toggleTag('beachy')">beachy</button>
            <button class="tag-button" @click="toggleTag('warm weather')">warm weather</button>
            <button class="tag-button" @click="toggleTag('cold weather')">cold weather</button>
            <button class="tag-button" @click="toggleTag('popular')">popular</button>
            <button class="tag-button" @click="toggleTag('cheap')">cheap</button>
            <button class="tag-button" @click="toggleTag('high-end')">high-end</button>
          </div>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <h2 class="result-text">selected tags:</h2>
        </b-col>

        <b-col cols="7">
          <div class="selected-tags">
            <button
              v-for="tag in selectedTags"
              :key="tag"
              class="tag-button-selected"
            >
              {{ tag }}
            </button>
          </div>
        </b-col>

        <b-col>
          <button class="clear-button" @click="clearTags">clear all tags</button>
        </b-col>
      </b-row>

      <b-row>
        <b-col col="12">
          <div v-if="Array.isArray(cities) && cities.length > 0" class="cities-list">
            <div v-for="city in cities" :key="city._id" class="city-card">
              <div class="top-half-card">
                <div class="city-img-wrapper">
                  <img src="@/assets/London.jpg" class="city-card-img"/>
                </div>
                <div class="city-country-text">
                  <p class="cityname-text">{{ city.cityName }}, </p>
                  <p>{{ city.country }}</p>
                </div>
              </div>
              <div class="bottom-half-card">
                <div
                  v-for="tag in city.tags"
                  :key="tag"
                  :class="{'tag-bubble': true, 'tag-bubble-selected': selectedTags.includes(tag), 'tag-bubble-nonselected': !selectedTags.includes(tag)}"
                >
                  {{ tag }}
                </div>
              </div>
            </div>
          </div>

          <div v-else>
            <h3>No cities found.</h3>
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
      selectedTags: [],
      allTags: [
        'historical', 'quiet', 'party', 'architecture',
        'recently added', 'nature', 'beachy', 'warm weather',
        'cold weather', 'popular', 'cheap', 'high-end'
      ],
      cities: [],
      message: 'none',
      loggedInStatus: !!localStorage.getItem('x-auth-token')
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
  },
  methods: {
    async getCities() {
      try {
        const params = {
          tags: this.selectedTags.length ? this.selectedTags.join(',') : undefined
        }

        const response = await Api.get('/cities', { params })
        if (response.data && response.data.cities) {
          this.cities = response.data.cities
        } else {
          this.cities = []
        }
      } catch (error) {
        console.error('Error fetching cities:', error)
        this.cities = []
      }
    },
    logout() {
      localStorage.removeItem('x-auth-token')
      console.log('Logged out successfully')
      this.loggedInStatus = false
      this.$router.push('/')
    },
    toggleTag(tag) {
      const tagIndex = this.selectedTags.indexOf(tag)
      if (tagIndex === -1) {
        this.selectedTags.push(tag)
      } else {
        this.selectedTags.splice(tagIndex, 1)
      }
      this.getCities() // Fetch cities whenever tags change
    },
    clearTags() {
      this.selectedTags = []
      this.getCities() // Fetch cities after clearing tags
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
    flex-wrap: wrap;
    align-items: center;
}

.search-by-tag-panel {
    background-color: #759cab;
    width: 100rem;
    min-height: 50rem;
    margin-bottom: 35px;
    margin-top: 120px;
}

.search-cities-text {
  font-family: "Lexend Deca", sans-serif;
  color: #045768;
  font-size: 3rem;
  margin-top: 2.5rem;
  margin-left: 6rem;

}

.filter-options {
  display: flex;
  gap: 4rem; /* Adds space between the buttons */
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
}

.tags-button:hover, .ratings-button:hover{
    transform: scale(1.05);
}

.tags-button{
    background-color: #bc672a;
    margin-left: 80px;
}

.ratings-button{
    background-color: #9BA9B6;
    border: none;
}

.filter-options i {
  font-size: 4rem;
  color: #42515e;
  margin-left: 10px;
  margin-block: 40px;
}

.tag-button {
    background-color: #00000025;
    color: #8FC6DF;
    border-radius: 5px;
    border: 1px solid #edf7fb;
    padding: 10px 40px;
    cursor: pointer;
    margin: 12px;
}

.tag-button:hover{
    transform: scale(1.05);
}

.selected-tags {
  display: flex;
  flex-direction: row; /* Arrange in a row */
  flex-wrap: wrap; /* Allow tags to wrap to the next line */
  gap: 10px; /* Space between tags */
  margin-top: 4.4rem;
}

.tag-button-selected {
  min-width: 150px; /* Set a consistent width for each tag */
  padding: 10px 20px;
  background-color: #8FC6DF;
  color: #42515e;
  border: 1px solid #edf7fb;
  border-radius: 5px;
  cursor: pointer;
}

.result-text {
    color: #045768;
    margin-top: 4rem;
    margin-left: 2rem;

}

.clear-button {
    background-color: #8FC6DF;
    color: #42515e;
    border: none;
    padding: 5px 50px;
    font-size: 1.1rem;
    margin-top: 4.4rem;
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

/* Responsive adjustments */
@media (max-width: 768px) {
    .city-card {
        flex: 0 1 calc(45% - 1rem); /* 2 cards per row on smaller screens */
    }
}

@media (max-width: 576px) {
    .city-card {
        flex: 0 1 calc(100% - 1rem); /* 1 card per row on extra small screens */
    }
}

.cities-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin: 2rem;
}

.city-card {
    background-color: #9BA9B6;
    border: 1px solid #bc672a;
    border-radius: 8px;
    padding: 1rem;
    margin: 0.5rem;
    flex: 0 1 calc(30% - 1rem); /* Flex item: grow, shrink, basis (30% width minus margin) */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.city-card-img{
  max-width: 100%;
  border-radius: 10%;
}

.top-half-card{
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding-bottom: 0.5rem;
}

.city-country-text{
  padding: 1rem 0;
  justify-content: center;
}

.city-country-text p {
  margin: 0;
  padding: 0;
  line-height: 1.7;
}

.cityname-text{
  font-weight: 700;
}

.bottom-half-card{
  gap: 0.5rem;
}

.tag-bubble {
    display: inline-block;
    padding: 5px 10px;
    margin: 5px;
    font-size: 0.9rem;
    text-align: center;
    border-radius: 12px;
    border: 1px solid #edf7fb;
}

.tag-bubble-selected {
    background-color: #8FC6DF;
    color: #42515e;
}

.tag-bubble-nonselected {
    background-color: #CAC4D0;
    color: #edf7fb;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .city-card {
        flex: 0 1 calc(45% - 1rem); /* 2 cards per row on smaller screens */
    }
}

@media (max-width: 576px) {
    .city-card {
        flex: 0 1 calc(100% - 1rem); /* 1 card per row on extra small screens */
    }
}

</style>

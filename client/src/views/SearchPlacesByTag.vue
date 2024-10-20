<template>
  <div class="tag-places-body-container">
    <header class="euro-tour-header">
      <div class="logo-wrapper">
        <router-link to="/" class="logo">
          <img src="@/assets/horizontal-logo.png" alt="Euro Tour logo" />
        </router-link>
      </div>
      <nav class="navbar">
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

    <b-container class="search-by-tag-panel">
      <b-row class="search-options-row">
        <b-col col="4" class="search-places-text-col">
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
            <i class="fa-solid fa-filter" style="color: #045768;"></i>
          </div>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <div class="available-tags">
            <button class="tag-button" @click="toggleTag('historical')">historical</button>
            <button class="tag-button" @click="toggleTag('adventurous')">adventurous</button>
            <button class="tag-button" @click="toggleTag('party')">party</button>
            <button class="tag-button" @click="toggleTag('sight-seeing')">sight-seeing</button>
            <button class="tag-button" @click="toggleTag('recently opened')">recently opened</button>
            <button class="tag-button" @click="toggleTag('nature')">nature</button>
            <button class="tag-button" @click="toggleTag('beachy')">beachy</button>
            <button class="tag-button" @click="toggleTag('museum')">museum</button>
            <button class="tag-button" @click="toggleTag('food')">food</button>
            <button class="tag-button" @click="toggleTag('popular')">popular</button>
            <button class="tag-button" @click="toggleTag('affordable')">affordable</button>
            <button class="tag-button" @click="toggleTag('high-end')">high-end</button>
            <button class="tag-button" @click="toggleTag('quiet')">quiet</button>
            <button class="tag-button" @click="toggleTag('shopping')">shopping</button>
            <button class="tag-button" @click="toggleTag('18+')">18+</button>

          </div>
        </b-col>
      </b-row>

      <b-row class="selecting-tags-row">
        <b-col class="selected-title-col">
          <h2 class="result-text">selected tags:</h2>
        </b-col>

        <b-col cols="7" class="selected-tags-col">
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

        <b-col class="col-with-clear-button">
          <button class="clear-button" @click="clearTags">clear all tags</button>
        </b-col>
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
                <div
                  v-for="tag in place.tags"
                  :key="tag"
                  :class="{'tag-bubble': true, 'tag-bubble-selected': selectedTags.includes(tag), 'tag-bubble-nonselected': !selectedTags.includes(tag)}"
                >
                  {{ tag }}
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
import { ApiV1 } from '@/Api'

export default {
  data() {
    return {
      selectedTags: [],
      allTags: [
        'historical', 'adventurous', 'party', 'sight-seeing',
        'museum', 'recently opened', 'food', 'nature',
        'beachy', 'popular', 'affordable', 'high-end', 'quiet',
        'shopping', '18+'
      ],
      places: [],
      message: 'none',
      loggedInStatus: !!localStorage.getItem('x-auth-token')
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
        const params = {
          tags: this.selectedTags.length ? this.selectedTags.join(',') : undefined
        }

        const response = await ApiV1.get('/v1/api/places', { params })
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
      this.getPlaces() // Fetch places whenever tags change
    },
    clearTags() {
      this.selectedTags = []
      this.getPlaces() // Fetch places after clearing tags
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@100..900&display=swap');

.tag-places-body-container {
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

.available-tags{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 8px;
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

.no-places-found {
    color: #233341;
    justify-content: center;
    display: flex;
    padding: 5rem;
    font-size: 3rem;
}

.selected-tags {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 4.4rem;
}

.tag-button-selected {
  min-width: 150px;
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
    font-size: 1.5rem;
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
    flex: 0 1 calc(30% - 1rem);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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
  padding: 1rem 0;
  justify-content: center;
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

@media screen and (max-width:1200px) {
   .euro-tour-header{
        padding: 2rem 3%;
    }

    .footer{
        padding: 2rem 3%;
    }

    .search-by-tag-panel{
      margin-top: 11rem;
      min-width: 1000px
    }

    .tag-places-body-container{
      min-width: 1200px;
    }

    .search-options-row .search-places-text-col{
      width: 100%;
      justify-content: center;
    }

    .search-places-text{
      text-align: center;
    }

    .search-options-row .filter-options{
      width: 100%;
      justify-content: center;
    }

}

@media (max-width: 768px) {
    .navbar{
        width: 100%;
        display: flex;
        justify-content: space-evenly;
        flex-wrap: wrap;
        align-items: center;
    }

    .euro-tour-header{
        flex-direction: column;
        gap: 0.7rem;
        padding: 0.5rem ;
    }

    .navbar a{
      font-size: 100%;
    }
    .navbar img{
      max-width: 50%;
    }

    .place-card {
        flex: 0 1 calc(45% - 1rem);
    }

    h2 {
      display: flex;
      justify-content: center;
      margin-right: 6rem;
    }

    .selected-title-col{
      width: 25%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-left: 3rem;
    }

    .selected-tags-col{
      width: 75%;
    }

    .col-with-clear-button{
      padding-left: 3rem;
    }

    .place-img-wrapper{
      max-width: 100px;
    }

}

@media (max-width: 576px) {
    .place-card {
       flex: 0 1 calc(100% - 1rem);
        flex-direction: row;
        display: flex;
        align-items: center;
    }

    .top-half-card{
      gap: 1rem;
      justify-content: space-between;
      width: 40%;
    }

    .bottom-half-card{
      width: 60%;
    }

}

@media screen and (max-width:350px) {
    .footer{
        flex-direction: column-reverse;
    }

    .container.search-by-tag-panel{
      width: 900px
    }

}

</style>

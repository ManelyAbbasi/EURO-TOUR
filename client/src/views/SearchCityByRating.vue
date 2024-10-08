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
          <a href="#placesToVisit" class="navbar-item"
            ><i class="fa-solid fa-map-pin"></i> places to visit</a>
        <b-dropdown
          size="lg"
          variant="link"
          toggle-class="text-decoration-none"
          no-caret
          class="navbar-item dropdown"
        >
          <template #button-content>
            <img src="@/assets/signed-in-icon.png" alt="Sign In" class="dropdown-icon" />
          </template>
          <!-- Dropdown items -->
          <b-dropdown-item class="dropdown-item" to="/">Log out</b-dropdown-item>
          <b-dropdown-item class="dropdown-item" to="/profile">Profile</b-dropdown-item>
        </b-dropdown>
        </nav>
      </header>

        <b-container class="search-by-panel">

            <b-row>
            <b-col col="4">
                <h2 class="search-cities-text">Search cities by:</h2>
            </b-col>

            <b-col col="8">
        <div class="filter-options">
        <router-link to="/searchCityByTag">
            <button class="tags-button">tags</button>
        </router-link>

        <router-link to="/SearchCityByRating">
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

    <b-row>
    <b-col col="12">

    </b-col >

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
export default {
  data() {
    return {
      value: '2',
      activeMinRating: null,
      activeMaxRating: null,
      activeSort: null
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
  },
  methods: {
    recordSortOption(option) {
      this.activeSort = option // Set the active button when clicked
      // Handle the sorting logic here if needed
    },
    selectMinRating(minRating) {
      if (!this.activeMaxRating || Number(minRating) <= Number(this.activeMaxRating)) {
        this.activeMinRating = minRating
      }
    },
    selectMaxRating(maxRating) {
      if (!this.activeMinRating || Number(maxRating) >= Number(this.activeMinRating)) {
        this.activeMaxRating = maxRating
      }
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

.search-by-panel {
    background-color: #759cab;
    width: 100rem;
    height: 50rem;
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
    gap: 1.8rem; /* Space between buttons */
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
    border: 2px solid transparent; /* For a smooth transition */
    transition: background-color 0.3s, border-color 0.3s; /* Transition effect */
}

.min-button:hover,
.max-button:hover{
    border-color: #bc672a;
}

.min-button.active,
.max-button.active {
    background-color: #bc672a;
}

h5{
  color: #045768;
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
</style>

<template>
    <div class="maincities-body-container">
      <header class="euro-tour-header">
        <div class="logo-wrapper">
          <router-link to="/" class="logo">
            <img src="@/assets/horizontal-logo.png" alt="Euro Tour logo" />
          </router-link>
        </div>
        <nav class="navbar">
          <router-link to="/maincities" class="navbar-item maincities-navbar-item" v-if="isLoggedIn"
            ><i class="fa-solid fa-city"></i> cities</router-link>
          <a href="#placesToVisit" class="navbar-item" v-if="isLoggedIn"
            ><i class="fa-solid fa-map-pin"></i> places to visit</a>
            <b-dropdown
          size="lg"
          variant="link"
          toggle-class="text-decoration-none"
          no-caret
          class="navbar-item dropdown"
          v-if="!isLoggedIn"
        >
          <template #button-content>
            <img src="@/assets/sign-in-icon.png" alt="Sign In" class="dropdown-icon" />
          </template>
          <!-- Dropdown items -->
          <b-dropdown-item class="dropdown-item" to="/login">Log in</b-dropdown-item>
          <b-dropdown-item class="dropdown-item" to="/signup">Sign up</b-dropdown-item>
        </b-dropdown>
        <b-dropdown
          size="lg"
          variant="link"
          toggle-class="text-decoration-none"
          no-caret
          class="navbar-item dropdown"
          v-if="isLoggedIn"
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
      <b-col><button class="sort-by-button" @click="clearTags">highest to lowest</button></b-col>
      <b-col><button class="sort-by-button" @click="clearTags">lowest to highest</button></b-col>
      <b-col></b-col>
    </b-row>
    <b-row>
      <b-col><h4>range of ratings:</h4></b-col>
    <b-col>
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
      value: '2'
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
    toggleTag(tag) {
      const tagIndex = this.selectedTags.indexOf(tag)
      if (tagIndex === -1) {
        this.selectedTags.push(tag)
      } else {
        this.selectedTags.splice(tagIndex, 1)
      }
    },
    clearTags() {
      this.selectedTags = []
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

.dropdown-item:hover {
  background-color: blueviolet /* Hover effect */
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

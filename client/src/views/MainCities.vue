<template>
    <div class="maincities-body-container">
      <header class="euro-tour-header">
        <logo class="logo-wrapper">
          <router-link to="/" class="logo">
            <img src="@/assets/horizontal-logo.png" alt="Euro Tour logo" />
          </router-link>
        </logo>
        <nav class="navbar">
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
              <img src="@/assets/sign-in-icon.png" alt="Sign In" class="dropdown-icon" />
            </template>
            <!-- Dropdown items -->
            <b-dropdown-item class="dropdown-item" to="/login">Log in</b-dropdown-item>
            <b-dropdown-item class="dropdown-item" to="/signup">Sign up</b-dropdown-item>
          </b-dropdown>
        </nav>
      </header>

      <main>
        <div class="maincities-layout-wrapper">
          <div class="maincities-left-side-panel">

            <!-- carousel of cities -->
            <div class="carousel-container">
                <b-carousel id="carousel" v-model="slide" :interval="4000" controls>
                <!--images -->
                <b-carousel-slide img-src="https://picsum.photos/600/600/?image=52"></b-carousel-slide>
                <b-carousel-slide img-src="https://picsum.photos/600/600/?image=54"></b-carousel-slide>
                <b-carousel-slide img-src="https://picsum.photos/600/600/?image=58"></b-carousel-slide>

              </b-carousel>

            <!-- display new text for each slide -->
            <p class="under-pic">
            {{ captions[slide] }} <!-- this will dynamically change based on the active slide -->
            </p>

           <!-- Star Icons -->
          <div class="star-rating">
            <i
              v-for="index in 5"
              :key="index"
              :class="index <= 3 ? 'fa-solid fa-star' : 'fa-regular fa-star'"
              style="color: #bc672a;"
            ></i>
            <span class="rating-text">3.1/5.0</span>
          </div>
            </div>

            <div class="detail-about-city">
            <div class="detail-item">
                <p><strong class="heading">Good to know:</strong></p>
                <p>{{ goodToKnow[slide] }}</p>
            </div>
            <div class="detail-item">
                <p><strong class="heading">Facts:</strong></p>
                <p>{{ facts[slide] }}</p>
            </div>
            <div class="detail-item">
                <p><strong class="heading">Stats:</strong></p>
                <p>{{ stats[slide] }}</p>
            </div>
            <div class="detail-item">
                <p><strong class="heading">Tags:</strong></p>
                <p>{{ tags[slide] }}</p>
            </div>
            <router-link to="/citiesmore" class="read-more">read more</router-link>
        </div>

            <!-- Heart Icon -->
            <div class="heart-icon-container">
            <i :class="isFavorite ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"
              class="favorite-icon"
              style="color: #bc672a;"
              @click="toggleFavorite">
            </i>
          </div>

        </div>

          <div class="maincities-right-side-panel">
            <div class="maincities-right-side-panel">
                <!--search and trending-->
                <h2 class="maincities-search-title">Search cities by: <i class="fa-solid fa-filter" style="color: #045768;"></i></h2>
                <div class="maincities-button-wrapper">
                  <router-link to="/searchCityByTag" class="maincities-tags-btn">tags</router-link>
                    <h4 class="maincities-or">or</h4>
                    <router-link to="/searchCityByRating" class="maincities-ratings-btn">ratings</router-link>
                </div>
                <h2 class="maincities-search-title">Trending Cities:</h2>
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
export default {
  data() {
    return {
      isFavorite: false,
      slide: 0,
      captions: [
        'London, United Kingdom',
        'Paris, France',
        'Dublin, Ireland'
      ],
      goodToKnow: [
        'London is the capital of the United Kingdom.',
        'Paris is famous for its café culture and iconic landmarks.',
        'Dublin is known for its literary history and vibrant nightlife.'
      ],
      facts: [
        'Population: 8.9 million',
        'Population: 2.1 million',
        'Population: 1.2 million'
      ],
      stats: [
        'Area: 1,572 km²',
        'Area: 105.4 km²',
        'Area: 318 km²'
      ],
      tags: []
    }
  },
  methods: {
    toggleFavorite() {
      this.isFavorite = !this.isFavorite // Toggle between true and false
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

.maincities-layout-wrapper {
  display: grid;
  grid-template-columns: 2fr 1fr;  /* Create two equal columns */
  grid-gap: 20px;
  padding: 7rem 9% 2rem;
  width: 100%;
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

}

.carousel-container{
    width: 100%;
    margin: 30px;
    margin-left: 30px;
}

.under-pic{
    margin-block: 2px;
    font-weight: bold;
    font-size: 2em;
    text-align: left;
    color: #759CAB
}

.star-rating{
  text-align: left;
  font-size: 2.5em;
}

.star-rating i {
  margin-right: 5px; /* Increase space between stars */
}

.rating-text {
  margin-left: 0.5rem;
  font-size: 0.6em;
  color: #42515E;
}

.read-more {
  font-size: 1.2rem;
  color: #bc672a;
  text-decoration: underline;
  cursor: pointer;
  margin-left: 9rem; /* Increase margin-left for more right alignment */
  margin-top: 7.5rem;  /* Add margin-top to move it further down */
  display: inline-block; /* Ensure margin-top works properly */
}

.detail-about-city {
    width: 60%;
    color: #759CAB;
    font-size: 1em;
    margin-right: 20px;
}

.detail-about-city p {
  text-align: left;
  margin: 0.1px;
  color: #759CAB;
}

.detail-item {
    margin-top: 40px; /* Space between items */
}

.heading {
    font-size: 1.5em;
    font-weight: bold;
}

.heart-icon-container {
  margin-right: 25px;
  margin-block: 20px;

}

.heart-icon-container i {
  font-size: 3em;
  cursor: pointer;
  transition: transform 0.3s ease; /* Add smooth transition on click or hover */
}

.heart-icon-container i:hover {
  transform: scale(1.1); /* Slightly enlarge the heart on hover */
}

.maincities-right-side-panel {
    background-color: #759cab;
    flex-direction: column;
    display: flex;
    align-items: center;
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

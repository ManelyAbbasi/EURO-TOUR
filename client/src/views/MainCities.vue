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
          <div class="maincities-right-side-panel">

            <!-- carousel of cities -->
            <div class="carousel-container">
              <b-carousel
                id="carousel-1"
                v-model="slide"
                :interval="4000"
                controls
              >
                <!--image -->
                <b-carousel-slide img-src="https://picsum.photos/1024/480/?image=52"></b-carousel-slide>
                <b-carousel-slide img-src="https://picsum.photos/1024/480/?image=54"></b-carousel-slide>
                <b-carousel-slide img-src="https://picsum.photos/1024/480/?image=58"></b-carousel-slide>

              </b-carousel>
            </div>
          </div>

          <div class="maincities-left-side-panel">
            <div class="maincities-left-side-panel">
                <!--search and trending-->
                <h2 class="maincities-search-title">Search cities by: <i class="fa-solid fa-filter" style="color: #045768;"></i></h2>
                <div class="maincities-button-wrapper">
                    <button class="maincities-tags-btn" type="button">tags</button>
                    <h4 class="maincities-or">or</h4>
                    <button class="maincities-ratings-btn" type="button">ratings</button>
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
      slide: 0,
      sliding: null
    }
  },
  methods: {
    onSlideStart(slide) {
      this.sliding = true
    },
    onSlideEnd(slide) {
      this.sliding = false
    }
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
  padding: 0.5rem 1rem; /* Add appropriate padding */
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
  grid-gap: 20px;  /* Optional: Add some space between columns */
  padding: 7rem 9% 2rem;
  width: 100%;
}

.maincities-left-side-panel, .maincities-right-side-panel {
  display: flex;
  justify-content: center;
  align-items: center;
}

.maincities-right-side-panel {
  display: flex;
  flex-direction: column;
  background-color: #edf7fb;

}

.maincities-left-side-panel {
    background-color: #759cab;
    flex-direction: column;
    display: flex;
}

.maincities-left-side-panel h2 {
    color: #045768;
    font-size: 2rem;
}

.maincities-left-side-panel h4 {
    color: #045768;
    font-size: 1.5rem;
}

.maincities-button-wrapper {
    flex-direction: row;
    display: flex;
    gap: 2rem;
}

.maincities-button-wrapper button{
    padding: 0 2rem;
    color: #edf7fb;
    background-color: #9BA9B6;
    border: none;
    transition: 0.8s all;
    max-width: 7rem;
}

.maincities-button-wrapper button:hover{
    color: #9BA9B6;
    background-color: #edf7fb;
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

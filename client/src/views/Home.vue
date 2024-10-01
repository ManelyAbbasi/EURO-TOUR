<template>
  <div class="home-body-container">
    <header class="euro-tour-header">
      <logo class="header-logo-wrapper">
        <router-link to="/"  class="home-logo"><img src="@/assets/horizontal-logo.png" alt="Euro Tour logo"></router-link>
      </logo>
      <nav class="navbar">
        <router-link to="/maincities" class="navbar-item"><i class="fa-solid fa-city" style="color: #edf7fb;"></i> cities</router-link>
        <a href="#placesToVisit" class="navbar-item"><i class="fa-solid fa-map-pin" style="color: #edf7fb;"></i> places to visit</a>
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
      <div class="home-layout-wrapper">
          <div class="home-right-side-panel">
            <h1 class="text hello"> </h1>
            <p class="text welcome-text">Make the most of your
              upcoming travels! </p>
            <p class="text welcome-text">With your <b>preferences</b>
              and our <b>recommendations</b> you will have
              the experience of a <b>lifetime</b></p>
          </div>
          <div class="home-left-side-panel">
          <!-- map -->
          <EuroMap class="euromap"/>
          </div>
      </div>
      <section class="get-to-know-wrapper">
        <h2 class="home-heading">Get to know us!</h2>
        <div class="get-to-know-container">
            <div class="get-to-know-box">
                <h3>About us</h3>
                <div class="get-to-wrapper-text">
                  <p>Feeling lost in a new city?
                  Want to know what's out there?</p>
                <p>We got you!</p>
                <p> With us you can discover the best
                  places to visit in your chosen city,
                  by finding somewhere that
                  piques your interest.</p>
                </div>
            </div>
            <div class="get-to-know-box">
                <h3>Our goals</h3>
                <div class="get-to-wrapper-text">
                  <p>We want to promote safe travel for all,
                with putting a focus on</p>
                <p>• Solo women travelers</p>
                <p>• POCs</p>
                <p>• Members of LGBTQIA+</p>
                <p>We intend for our travelers to be able to make
                the most of their time in a new city.</p>
                </div>
            </div>
            <div class="get-to-know-box">
                <h3>Why join us?</h3>
                <div class="get-to-wrapper-text">
                  <p>With an account you can:</p>
                <p>• Get personalised recommendations</p>
                <p>• Favourite cities and places</p>
                <p>• Leave reviews and ratings</p>
                </div>
            </div>
        </div>
      </section>
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
// @ is an alias to /src
import { Api } from '@/Api'
import EuroMap from '@/views/Map.vue' // Adjust the path as necessary

const text = document.querySelector('.hello')
const textLoad = () => {
  setTimeout(() => {
    text.textContent = 'Hello!'
  }, 0)
  setTimeout(() => {
    text.textContent = 'Hola!'
  }, 4000)
  setTimeout(() => {
    text.textContent = 'Bonjour!'
  }, 8000)
  setTimeout(() => {
    text.textContent = 'Ciao!'
  }, 12000)
  setTimeout(() => {
    text.textContent = 'Salut!'
  }, 16000)
  setTimeout(() => {
    text.textContent = 'Hallo!'
  }, 20000)
  setTimeout(() => {
    text.textContent = 'Cześć!'
  }, 24000)
}

textLoad()
setInterval(28000)

export default {
  components: {
    EuroMap
  },
  name: 'home',
  data() {
    return {
      message: 'none'
    }
  },
  methods: {
    getMessage() {
      Api.get('/')
        .then(response => {
          this.message = response.data.message
        })
        .catch(error => {
          this.message = error
        })
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

.home-body-container{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    list-style-type: none;
    text-decoration: none;
    border: none;
    outline: none;
    font-family: "Lexend Deca", sans-serif;
    color: #bc672a;
}

.home-body-container{
  display: flex;
  flex-wrap: wrap;
  background-color: #42515e;
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

.home-layout-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;  /* Create two equal columns */
  grid-gap: 20px;  /* Optional: Add some space between columns */
  padding: 7rem 9% 2rem;
  width: 100%;
}

.home-left-side-panel, .home-right-side-panel {
  display: flex;
  justify-content: center;
  align-items: center;
}

.home-right-side-panel {
  display: flex;
  flex-direction: column;
}

.home-right-side-panel p {
  font-size: 1.7rem;
  padding: 0.5rem 0;
}

.get-to-know-wrapper{
    min-height: 100vh;
    padding: 4rem 9% 2rem;
}

.get-to-know-wrapper h2{
    margin-bottom: 3rem;
    font-size: 3rem;
}

.get-to-know-container{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 3rem;
}

.get-to-know-container .get-to-know-box{
    flex: 1 1 30rem;
    background-color: #8FC6DF;
    padding: 3rem 2rem 4rem;
    border-radius: 2rem;
    text-align: center;
    transition: all 0.5s;
    max-width: 30%;
    height: 30rem;
    border: 3px solid #045768;
}

.get-to-know-container .get-to-know-box:hover{
    border-color: #bc672a;
    transform: scale(1.03);
}

.get-to-know-box h3{
    font-size: 2rem;
    color: #045768;
    margin-bottom: 2rem;
}

.get-to-know-box p{
    font-size: 1rem;
    margin: 0.5rem 0 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
}

.get-to-wrapper-text{
  display: flex;
  flex-direction: column;
}

.home-logo img{
  max-height: 4rem;
}

.hello {
  font-size: 3rem;
}

.hello {
  position: relative;
  font-size: 3rem;
  white-space: nowrap; /* Ensure the text doesn't break */
  overflow: hidden; /* Hide the overflow */
}

h1.text.hello:before {
  content:"";
  animation: typewriterAnimate 4s steps(12) infinite;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #42515e;
  border-left: 2px solid #bc672a;
}

@keyframes typewriterAnimate {
  40%, 60%{
    left: 100%;
  }
  100%{
    left: 0%
  }
}

.welcome-text {
  font-size: 2rem;
  border: 2rem;;
}

.euromap{
  width: 150%
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
    .get-to-know-wrapper{
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
    .home-layout-wrapper,
    .get-to-know-wrapper{
        flex-direction: column;
        display: flex;
    }
    .home-layout-wrapper p{
        font-size: 2.5rem;
    }
    .home-layout-wrapper h1{
        font-size: 5rem;
    }
}

@media screen and (max-width:576px) {
    html{
        font-size: 50%;
    }
}

@media screen and (max-width:350px) {
    .home-layout-wrapper img{
        width: 90vw;
    }
    .footer{
        flex-direction: column-reverse;
    }
}
</style>

<template>
  <div class="home-body-container">
    <header class="euro-tour-header">
      <div class="header-logo-wrapper">
        <router-link to="/" class="home-logo"><img src="@/assets/horizontal-logo.png" alt="Euro Tour logo" /></router-link>
      </div>
      <nav class="navbar">
        <a href="#favourites" class="navbar-item" v-if="isLoggedIn"><i class="fa-regular fa-heart" style="color: #edf7fb;"></i> favourites</a>
        <router-link to="/maincities" class="navbar-item" v-if="isLoggedIn"><i class="fa-solid fa-city" style="color: #edf7fb;"></i> cities</router-link>
        <a href="#placesToVisit" class="navbar-item" v-if="isLoggedIn"><i class="fa-solid fa-map-pin" style="color: #edf7fb;"></i> places to visit</a>
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
          <b-dropdown-item class="dropdown-item logout" @click="logout">Log out</b-dropdown-item>
          <b-dropdown-item class="dropdown-item" to="/profile">Profile</b-dropdown-item>
        </b-dropdown>
      </nav>
    </header>
    <main>
      <div class="home-layout-wrapper">
        <div class="home-right-side-panel">
          <h1 class="typewriter-hello hello" v-if="!isLoggedIn"></h1>
          <h1 class="hello" v-if="isLoggedIn">Welcome back traveler!</h1>
          <p class="welcome-text" v-if="!isLoggedIn">Make the most of your upcoming travels!</p>
          <p class="welcome-text" v-if="isLoggedIn">Let's plan for your next travels</p>
          <p class="welcome-text" v-if="!isLoggedIn">
            With your <b>preferences</b> and our <b>recommendations</b> you will have the experience of a <b>lifetime</b>
          </p>
        </div>
        <div class="home-left-side-panel">
          <!-- map -->
          <EuroMap class="euromap" />
        </div>
      </div>

      <section class="get-to-know-wrapper">
        <h2 class="home-heading">Get to know us!</h2>
        <div class="get-to-know-container">
          <div class="get-to-know-box">
            <h3>About us</h3>
            <div class="get-to-wrapper-text">
              <p>Feeling lost in a new city? Want to know what's out there?</p>
              <p>We got you!</p>
              <p>
                With us you can discover the best places to visit in your chosen city, by finding somewhere that
                piques your interest.
              </p>
            </div>
          </div>
          <div class="get-to-know-box">
            <h3>Our goals</h3>
            <div class="get-to-wrapper-text">
              <p>We want to promote safe travel for all, with putting a focus on</p>
              <p>• Solo women travelers</p>
              <p>• POCs</p>
              <p>• Members of LGBTQIA+</p>
              <p>We intend for our travelers to be able to make the most of their time in a new city.</p>
            </div>
          </div>

          <!-- Conditionally Render "Why join us?" or Map -->
          <div class="get-to-know-box">
            <!-- If not logged in, show "Why Join Us?" section -->
            <template v-if="!isLoggedIn">
              <h3>Why join us?</h3>
              <div class="get-to-wrapper-text">
                <p>With an account you can:</p>
                <p>• Discover cities to travel to</p>
                <p>• Look for places to visit in cities</p>
                <p>• Favourite cities and places</p>
                <p>• Find cities and places to visit based on your preferences</p>
              </div>
            </template>

            <!-- If logged in, show the Weather Map -->
            <template v-else>
              <h3 class="weather-warning-title">Weather warnings</h3> <!-- Added header here -->
              <WeatherMap class="weather-map" />
            </template>
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
import WeatherMap from '@/components/Weather.vue'

export default {
  components: {
    EuroMap,
    WeatherMap // Register the WeatherMap component
  },
  name: 'home',
  data() {
    return {
      message: 'none',
      loggedInStatus: !!localStorage.getItem('x-auth-token') // Reactive property for login status
    }
  },
  computed: {
    isLoggedIn() {
      return this.loggedInStatus // Use reactive loggedInStatus property
    }
  },
  methods: {
    getMessage() {
      Api.get('/')
        .then((response) => {
          this.message = response.data.message
        })
        .catch((error) => {
          this.message = error
        })
    },
    logout() {
      localStorage.removeItem('x-auth-token')
      this.loggedInStatus = false
      this.$router.push('/')
    },
    textLoad() {
      const textElement = document.querySelector('.typewriter-hello')
      if (!textElement) return

      const messages = ['Hello!', 'Hola!', 'Bonjour!', 'Ciao!', 'Salut!', 'Hallo!', 'Cześć!', 'Ahoj!', 'Bok!', 'Geia sas!', 'Olá!', 'Jó napot!']
      let index = 0
      let timeoutId

      const updateText = () => {
        textElement.textContent = messages[index]
        index = (index + 1) % messages.length // Cycle through the messages
      }

      const handleAnimationEnd = () => {
        clearTimeout(timeoutId) // Clear any existing timeout to avoid conflicts
        updateText()
        textElement.classList.remove('active') // Remove class to reset animation

        timeoutId = setTimeout(() => {
          textElement.classList.add('active') // Re-add class to trigger animation again
        })
      }

      textElement.addEventListener('animationend', handleAnimationEnd)

      updateText()
      textElement.classList.add('active')
    }
  },
  mounted() {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href =
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css'
    link.integrity =
      'sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=='
    link.crossOrigin = 'anonymous'
    link.referrerPolicy = 'no-referrer'
    document.head.appendChild(link)
    this.textLoad() // Call textLoad only after the component is mounted
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

.navbar a,
li.dropdown-item.logout {
  font-size: 1.5rem;
  color: #edf7fb;
  transition: 0.3s;
  text-decoration: none;
}

.navbar a:hover,
.li.dropdown-item.logout:hover,
.logo-wrapper img,
.navbar a:hover .fa-solid,
.navbar a:hover .fa-regular {
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
.get-to-know-box h3.weather-warning-title {
  font-size: 1.5rem;
  margin-bottom: 0.4rem;
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
  overflow: hidden;
  display: inline-block;
}

.hello:before {
  content: "";
  animation: typewriterAnimate 4s steps(12) infinite;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #42515e;
  border-left: 2px solid #bc672a;
  display: none; /* Initially hidden */
}

.hello.active:before {
  display: block; /* Only display when the animation starts */
  animation: typewriterAnimate 4s steps(12);
}

@keyframes typewriterAnimate {
  40%, 60% {
    left: 100%;
  }
  100% {
    left: 0%;
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

<template>
  <div class="body-container">
    <header class="euro-tour-header">
      <logo class="logo-wrapper">
        <router-link to="/"><img src="@/assets/horizontal-logo.png" alt="Euro Tour logo" draggable="false" class="logo"></router-link>
      </logo>
      <nav class="navbar">
        <a href="#cities"><font-awesome-icon icon="city" style="color: #edf7fb;" />cities</a>
        <a href="#placesToVisit"><font-awesome-icon icon="map-pin" style="color: #edf7fb;" />places to visit</a>
        <user-wrapper class="navbar">
          <b-nav-item-dropdown img src="@/assets/sign-in-icon.png" text="user" class="navbar" right>
          <b-dropdown-item href="#">log in</b-dropdown-item>
          <b-dropdown-item href="#">sign up</b-dropdown-item>
        </b-nav-item-dropdown>
        </user-wrapper>
      </nav>
      <div class="user">
      </div>
    </header>
    <div class="layout-wrapper">
      <main>
        <div class="right-side-panel">
          <h1 class="hello">Hello!</h1>
          <p class="p1">Make the most of your
            upcoming travels! With your preferences
            and our recommendations you will have
            the experience of a lifetime</p>
        </div>
        <div class="left-side-panel">
          <p class="p1">Make the most of your
            upcoming travels! With your preferences
            and our recommendations you will have
            the experience of a lifetime</p>
        <!-- map -->
        </div>
      </main>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { Api } from '@/Api'

export default {
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

<style>
@import url('https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@100..900&display=swap');

*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    list-style-type: none;
    text-decoration: none;
    border: none;
    outline: none;
    font-family: "Lexend Deca", sans-serif;
    color: #bc672a;
    background-color: #42515e;
}

.body-container{
  display: flex;
  flex-wrap: wrap;
  border: 2px solid green;
}

.euro-tour-header{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 2rem 9%;
    background-color:  rgba(155, 169, 182, 1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 900;
    border: 2px solid red;
    max-height: 2rem;
}

.navbar a, .logo-wrapper img {
    font-size: 1.5rem;
    color: #edf7fb;
    margin-left: 4rem;
    transition: 0.3s;
    background-color: rgba(155, 169, 182, 1);
    border: 2px solid red;
}

.navbar a:hover, .logo-wrapper img{
    color: #bc672a;
}

.layout-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;  /* Create two equal columns */
  grid-gap: 20px;  /* Optional: Add some space between columns */
  padding: 10rem 9% 2rem;
  width: 100%;
  border: 2px solid blue;
}

.left-side-panel, .right-side-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid orange;
  padding: 20px;
}

.logo-wrapper img{
  border: 3px solid pink;
  max-width: 35%;
  size: 20px;
}

.p1 {
  font-size: 20px;
  border: 2px solid purple;
}

.btn_message {
  margin-bottom: 1em;
}
</style>

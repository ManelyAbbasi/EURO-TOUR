<template>
  <div class="mainplaces-body-container">
    <header class="euro-tour-header">
      <!-- Header content here -->
    </header>
    <main>
      <div class="mainplaces-layout-wrapper">
        <div class="mainplaces-left-side-panel">
          <div class="pagination-wrapper">
            <div class="mt-3">
              <b-pagination v-model="currentPage" pills :total-rows="places.length" :per-page="perPage"></b-pagination>
            </div>
          </div>

          <div id="place-slide">
            <div v-if="places.length === 0" class="no-places-message">
              <h2 class="slide-title no-place-title">No places available to visit</h2>
            </div>
            <div v-else>
              <div v-for="place in paginatedPlaces" :key="place.placeName" class="place-item">
                <!-- Place item content here -->
              </div>
            </div>
          </div>
        </div>

        <div class="mainplaces-right-side-panel">
          <!-- Right side panel content -->
          <div class="trending-places-wrapper">
            <!-- Trending places -->
            <div class="trending-place-wrapper">
              <a class="admins-pick-item"><i class="fa-solid fa-medal" style="color: #D6AF36;"></i></a>
              <div class="text-and-button">
                <p class="mainplaces-trending">{{ topPlaces[0]?.placeName }}</p>
              </div>
            </div>

            <div class="trending-place-wrapper">
              <a class="admins-pick-item"><i class="fa-solid fa-medal" style="color: #A7A7AD;"></i></a>
              <div class="text-and-button">
                <p class="mainplaces-trending">{{ topPlaces[1]?.placeName }}</p>
              </div>
            </div>

            <div class="trending-place-wrapper">
              <a class="admins-pick-item"><i class="fa-solid fa-medal" style="color: #A77044;"></i></a>
              <div class="text-and-button">
                <p class="mainplaces-trending">{{ topPlaces[2]?.placeName }}</p>
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
import { ApiV1 } from '@/Api'

export default {
  data() {
    return {
      places: [],
      topPlaces: [],
      message: 'none',
      loggedInStatus: !!localStorage.getItem('x-auth-token'), // Reactive property for login status
      rows: 100,
      currentPage: 1,
      perPage: 1,
      showEditForm: false,
      editPlaceName: '',
      selectedPlace: null,
      isAdmin: false,
      placeName: ''
    }
  },
  async created() {
    await this.checkIfAdmin() // Check if the user is an admin when the component is created
    this.getPlaces()
    await this.fetchTopRatedPlaces()
  },
  computed: {
    isLoggedIn() {
      return this.loggedInStatus // Use reactive `loggedInStatus` property
    },
    paginatedPlaces() {
      const start = (this.currentPage - 1) * this.perPage
      const end = start + this.perPage
      console.log('Paginated places:', this.places.slice(start, end))
      return this.places.slice(start, end)
    }
  },
  methods: {
    async getPlaces() {
      try {
        const response = await ApiV1.get('/v1/api/places')
        console.log('Fetched places:', response.data.placesToVisit)
        if (response.data && response.data.placesToVisit) {
          this.places = response.data.placesToVisit.map(place => ({
            placeName: place.placeName,
            address: place.address,
            rating: place.rating,
            content: place.content,
            tags: place.tags,
            city: place.city
          }))
        } else {
          this.places = []
        }
      } catch (error) {
        console.error('Error fetching places:', error)
        this.places = []
      }
    },
    async fetchTopRatedPlaces() {
      try {
        // Fetch top places sorted by rating in descending order
        const response = await ApiV1.get('/v1/api/places?sortByRating=Desc')

        if (response.data && response.data.placesToVisit) {
          // Get only the top 3 places by rating
          this.topPlaces = response.data.placesToVisit.slice(0, 3).map(place => ({
            placeName: place.placeName
          }))
        }
      } catch (error) {
        console.error('Error fetching top-rated places:', error)
      }
    },
    async deleteAllPlaces() {
      const confirmed = confirm('Are you sure you want to delete this place?')
      if (!confirmed) return
      try {
        const response = await ApiV1.delete('/v1/api/places', {
          headers: { 'x-auth-token': localStorage.getItem('x-auth-token') }
        })
        if ((response.status === 200)) {
          alert('Place deleted successfully')
          window.location.reload()
        }
      } catch (error) {
        console.error('Error deleting place:', error)
      }
    },
    toggleFavorite() {
      this.isFavorite = !this.isFavorite // Toggle between true and false
    },
    getMessage() {
      ApiV1.get('/v1/api/')
        .then(response => {
          this.message = response.data.message
        })
        .catch(error => {
          this.message = error
        })
    },
    async checkIfAdmin() {
      try {
        const response = await ApiV1.get('/v1/api/admin/verify-admin', {
          headers: { 'x-auth-token': localStorage.getItem('x-auth-token') }
        })
        this.isAdmin = response.data.isAdmin
      } catch (error) {
        console.error('Error checking admin status:', error)
      }
    },
    closeEditForm() {
      this.showEditForm = false
    },
    showEditPlaceNameForm(place) {
      this.selectedPlace = place // Store the place being edited
      this.editPlaceName = place.placeName
      this.showEditForm = true
    },
    async submitNewPlaceName() {
      if (this.editPlaceName.length > 25) {
        alert('Place name cannot exceed 25 characters')
        return
      }
      try {
        const address = this.selectedPlace.address
        console.log(address)

        const updatedPlaceData = {
          placeName: this.editPlaceName
        }

        // Make the API call to update the place
        const response = await ApiV1.patch(`/v1/api/places/${address}`, updatedPlaceData, {
          headers: {
            'x-auth-token': localStorage.getItem('x-auth-token')
          }
        })

        // Update the place details in the places array
        const placeIndex = this.places.findIndex(p => p.address === address)
        if (placeIndex !== -1) {
          this.places[placeIndex].placeName = this.editPlaceName // Update the place name
        }

        console.log('Place updated successfully:', response.data)

        // Update the place details in the UI
        // this.place.placeName = this.editPlaceName

        // Hide the edit form after submission
        this.closeEditForm()
      } catch (error) {
        console.error('Error updating place:', error)
      }
    },
    logout() {
    // Remove the authentication token from localStorage
      localStorage.removeItem('x-auth-token')
      console.log('Logged out successfully')
      // Update the reactive `loggedInStatus` property to force reactivity
      this.loggedInStatus = false
      // Redirect the user to the homepage (or login page)
      this.$router.push('/')
    },

    async getHighestRatedPlace() {
      try {
        const response = await ApiV1.get('/v1/api/places?sortByRating=Desc')

        if (Array.isArray(response.data) && response.data.length > 0) {
          this.placeName = response.data[0].name // Set the place name to the highest-rated place
        }
      } catch (error) {
        console.error('Error fetching highest-rated place:', error)
      }
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
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@100..900&display=swap');

.mainplaces-body-container{
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

.mainplaces-layout-wrapper {
display: grid;
grid-template-columns: 2fr 1fr;
grid-gap: 20px;
padding: 9rem 9% 2rem;
width: 100%;
background-color: #42515e;
justify-content: center;
}

.mainplaces-right-side-panel .mainplaces-left-side-panel {
display: flex;
justify-content: center;
align-items: center;
}

.mainplaces-left-side-panel {
display: flex;
flex-direction: row;
background-color: #edf7fb;
min-width: 643px;
}

.no-place-title{
  color: #045768;
  text-align: center;
}

.heading {
  font-size: 1.5em;
  font-weight: bold;
}

.read-more-wrapper{
display: flex;
justify-content: space-between;
flex-direction: row;
}

.read-more-wrapper a{
color: #bc672a;
text-decoration: none;
transition: all 0.5s;
font-size: 1.6rem;
}

.read-more-wrapper a:hover{
text-decoration-line: underline;
color: #acbbc1;
transform: scale(1.05);
}

.delete-all-button{
border: aliceblue 2px solid;
background-color: #bc672a;
color: #edf7fb;
padding: 0.5rem 1rem;
border-radius: 5px;
transition: all 0.3s;
}

.delete-all-button:hover{
background-color: orangered;
color: white;
border: 2px solid red;
transform: scale(1.04);
}

.mainplaces-right-side-panel {
  background-color: #759cab;
  flex-direction: column;
  display: flex;
  align-items: center;
  min-width: 35vw;
}

.mainplaces-right-side-panel h2 {
  color: #045768;
  font-size: 2rem;
  padding: 0.5rem;
  margin: 1rem 0;
}

.mainplaces-right-side-panel h4 {
  color: #045768;
  font-size: 1.5rem;
}

.mainplaces-button-wrapper {
  flex-direction: row;
  display: flex;
  gap: 2rem;
}

.mainplaces-button-wrapper .mainplaces-tags-btn,
.mainplaces-button-wrapper .mainplaces-ratings-btn {
  display: inline-block;
  padding: 0.5rem 2rem;
  color: #edf7fb;
  background-color: #9BA9B6;
  border: none;
  text-align: center;
  transition: 0.8s all;
  max-width: 7rem;
  text-decoration: none;

}

.mainplaces-button-wrapper .mainplaces-tags-btn:hover,
.mainplaces-button-wrapper .mainplaces-ratings-btn:hover {
  color: #edf7fb;
  background-color: #bc672a;
  transform: scale(1.05);
}

.mainplaces-right-side-panel h3{
font-size: 1.5rem;
color: #045768;
padding: 0.5rem;
margin: 1rem 0;
}

.mainplaces-right-side-panel h2{
color: #045768;
margin: 2rem 0;
margin-bottom:-0.5rem;
}

.trending-place-wrapper {
max-width: 20rem;
display: flex;
flex-direction: row;
gap: 0.5rem;
align-items: center;
justify-content:last baseline;
}

.trending-place-wrapper p{
font-size: 1.2rem;
align-content: center;
justify-items: center;
margin: 0.5rem;
color:#045768;
}

.text-and-button {
display: flex;
align-items: center;
}

.admins-pick-item{
max-width: 35%;
margin: 1rem;
font-size: 3.5rem;
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

.slide-title-wrapper{
display: flex;
flex-direction: row;
align-items: center;
gap: 1rem;
}

.edit-placename-button {
border: none;
background-color: #edf7fb;
margin-right: 2rem;
margin-top: 0.5rem;
}

.edit-placename-button i {
font-size: 1.7rem;
}

.slide-title{
font-size: 3rem;
}

.mainplaces-left-side-panel{
display: flex;
flex-direction: column;
width: 100%;
min-width: 50vw;
align-content: flex-start;
}

.pagination-wrapper{
order: 2;
display: flex;
justify-content: center;
align-items: center;
padding-bottom: 1rem;
}

#place-slide{
order: 1;
padding: 1.5rem;
}

.detail-about-place{
  color: #759CAB;
  font-size: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-item{
padding: 1rem 0;
}

.detail-about-place p {
text-align: left;
margin: 0.1px;
color: #759CAB;
font-size: 1.1rem;
}

.city-link{
text-align: left;
margin: 0.1px;
color: #759CAB;
font-size: 1.5rem;
text-decoration: none;
transition: all 0.5s;

}

.city-link:hover{
text-decoration-line: underline;
color: #acbbc1;
}

.star-rating{
text-align: left;
font-size: 2rem;
}

.star-rating i {
margin-right: 5px;
}

.rating-text {
margin-left: 0.5rem;
font-size: 0.6em;
color: #42515E;
}

form {
display:flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
}

input[type="text"]:focus{
border-color: #BC672A;
outline: none;
}

input[type="text"]{
color: #a7561c;
}

input[type="text"] {
width: calc(100% - 20px);
padding: 10px;
margin: 10px 0;
border: 1px solid #ccc;
border-radius: 4px;
}

.edit-placename-popup form button[type="submit"] {
background-color: #BC672A;
color: white;
border: none;
padding: 10px 40px;
text-align: center;
font-size: 14px;
border-radius: 4px;
cursor: pointer;
transition: background-color 0.3s ease;
margin-right: 4rem;
}

.edit-placename-popup form button[type="submit"]:hover {
background-color: #a7561c;
}

.popup-body button:hover {
background-color: #a7561c;
}

.close-button {
background-color: #BC672A;
border: 2px solid #BC672A;
font-size: 15px;
cursor: pointer;
color: #fff;
transition: color 0.3s ease;
width: 2.5rem;
height: 2.5rem;
margin-right: 2rem;
}

.hidden-input{
display: none;
}

.close-button:hover {
background-color: #a7561c;
}

@media screen and (max-width:1200px) {
  .navbar{
      width: 100%;
      display: flex;
      justify-content: space-evenly;
  }
  .mainplaces-left-side-panel{
    min-width: 643px;
  }
  .mainplaces-right-side-panel{
    min-width: 35vw;
  }
  .mainplaces-layout-wrapper{
    min-width: 1200px;
    justify-content: center;
  }
  footer{
    min-width: 1200px;
  }

}

@media screen and (max-width: 768px){
  .euro-tour-header{
      padding: 2rem 3%;
  }
  .footer{
      padding: 2rem 3%;
  }
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
  .mainplaces-layout-wrapper{
      flex-direction: column;
      display: flex;
      min-width: 1200px;
      background-color: #42515E;
  }
  .slide-title{
    font-size: 3.5rem;
  }
  .mainplaces-layout-wrapper p,
  .rating-text,
  .star-rating i,
  .read-more-wrapper a,
  .city-link{
      font-size: 2rem;
  }
  .mainplaces-layout-wrapper .heading{
      font-size: 2.5rem;
      font-weight: 400;
  }
  .read-more-wrapper{
    display: flex;
    justify-content: end;
    margin-right: 2rem;
  }
  .mainplaces-left-side-panel{
    min-width: 984px;
    justify-content: center;
  }
  .mainplaces-right-side-panel{
    width: 100%;
    min-width: 984px;
    justify-content: center;

  }
  .mainplaces-left-side-panel{
    margin: 9rem 0 2rem 0;
  }
  .mainplaces-left-side-panel,
  .mainplaces-right-side-panel{
    padding: 1.5rem 2rem;
  }
  .mainplaces-right-side-panel h3,
  .mainplaces-right-side-panel h2{
    font-size: 3.5rem;
    padding: 0.5rem;
  }
  .mainplaces-button-wrapper{
    margin: 2.5rem;
  }
  h4.mainplaces-or {
    font-size: 2.5rem;
  }
  .mainplaces-button-wrapper a{
    padding: 2rem;
    font-size: 2rem;
    min-width: 15rem;
  }
  .trending-place-wrapper{
    display: grid;
    grid-template-columns: 1fr 3fr;
    justify-content: space-between;
    min-width: 45rem;
  }
  .trending-place-wrapper img{
    min-width: 10rem;
  }

  div.read-more-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  a.place-link {
    font-size: 1.5rem;
  }
}

@media screen and (max-width:350px) {
  .footer{
      flex-direction: column-reverse;
  }
}
</style>

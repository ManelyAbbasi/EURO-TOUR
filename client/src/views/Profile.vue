<template>
  <div class="maincities-body-container">
    <header class="euro-tour-header">
      <div class="logo-wrapper">
        <router-link to="/" class="logo">
          <img src="@/assets/horizontal-logo.png" alt="Euro Tour logo" />
        </router-link>
      </div>
      <nav class="navbar">
        <router-link to="/favourites" class="navbar-item">
          <i class="fa-regular fa-heart"></i> favourites
        </router-link>
        <router-link to="/maincities" class="navbar-item">
          <i class="fa-solid fa-city"></i> cities
        </router-link>
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
          <b-dropdown-item class="dropdown-item logout" @click="logout">Log out</b-dropdown-item>
          <b-dropdown-item class="dropdown-item" to="/profile">Profile</b-dropdown-item>
        </b-dropdown>
      </nav>
    </header>

    <form class="user-form">
      <b-row v-if="!isAdmin">
        <label for="username">current username</label>
        <input type="text" id="username" class="input-field" v-model="username" />

        <label for="password">password</label>
        <input type="password" id="password" class="input-field" v-model="password" />
      </b-row>

      <b-row v-if="isAdmin">
        <div class="admin-text">
        <h1>Admin Profile</h1>
        <p>as an admin, you are only allowed to modify your password</p>
        </div>
      </b-row>
        <!-- Admins only see the password field -->
      <b-row v-if="isAdmin">
        <label for="adminUsername">username</label>
        <input type="text" id="adminUsername" class="input-field" v-model="adminUsername" />
        <label for="adminPassword">password</label>
        <input type="password" id="adminPassword" class="input-field" v-model="adminPassword" />
      </b-row>

       <!-- Gender and LGBTQIA selection will only appear for non-admin users -->
      <b-row v-if="!isAdmin" class="gender-row">
        <div class="gender-selection">
          <label for="gender">What is your gender?</label>
          <div class="gender-buttons">
            <div class="gender-item">
              <div
                class="gender-button"
                data-value="male"
                :class="{ active: activeGender === 'male' }"
                @click="selectGender('male')"
              ></div>
              <label for="male" class="gender-label">male</label>
            </div>
            <div class="gender-item">
              <div
                class="gender-button"
                data-value="female"
                :class="{ active: activeGender === 'female' }"
                @click="selectGender('female')"
              ></div>
              <label for="female" class="gender-label">female</label>
            </div>
            <div class="gender-item">
              <div
                class="gender-button"
                data-value="non-binary"
                :class="{ active: activeGender === 'non-binary' }"
                @click="selectGender('non-binary')"
              ></div>
              <label for="non-binary" class="gender-label non-binary-label">non-binary</label>
            </div>
            <div class="gender-item">
              <div
                class="gender-button"
                data-value="other"
                :class="{ active: activeGender === 'other' }"
                @click="selectGender('other')"
              ></div>
              <label for="other" class="gender-label">other</label>
            </div>
          </div>
        </div>
      </b-row>

      <b-row v-if="!isAdmin" class="sexuality-row">
        <div class="sexuality-selection">
          <label for="lgbtqia">Are you a member of LGBTQIA+?</label>
          <div class="sexuality-buttons">
            <div class="sexuality-item">
              <div
                class="sexuality-button"
                data-value="yes"
                :class="{ active: activeLGBTQIA === 'yes' }"
                @click="selectLGBTQIA('yes')"
              ></div>
              <label for="yes" class="sexuality-label">yes</label>
            </div>
            <div class="sexuality-item">
              <div
                class="sexuality-button"
                data-value="no"
                :class="{ active: activeLGBTQIA === 'no' }"
                @click="selectLGBTQIA('no')"
              ></div>
              <label for="no" class="sexuality-label">no</label>
            </div>
          </div>
        </div>
      </b-row>

      <b-row class="button-row">
        <b-col cols="3">
        <div class="save-message-container">
          <span class="saved-message" v-if="isSaved">saved!</span>
        </div>
      </b-col>
      <b-col cols="3">
        <div class="save-button-container">
          <button class="save-button" type="button" @click="handleSaveChanges($event)">save changes</button>
        </div>
      </b-col>

      <b-col cols="3">
        <div class="delete-button-container">
          <button class="delete-button" type="button" @click="deletePopUp">delete account</button>
        </div>
      </b-col>
      </b-row>

    </form>

    <div class="overlay" v-if="deleteInProcess" @click="closeDeletePopUp"></div>
    <div class="delete-popup" :class="{ show: deleteInProcess }" v-if="deleteInProcess">
      <div class="popup-header">
        <button @click="closeDeletePopUp">X</button>
      </div>
      <div class="popup-body">
        <p>Are you sure you want to delete your account?</p>

        <label for="usernameDeleting">enter your username</label>
        <input type="text" id="usernameDeleting" class="input-field-popup" v-model="usernameDeleting" />
        <label for="passwordDeleting">enter your password</label>
        <input type="password" id="passwordDeleting" class="input-field-popup" v-model="passwordDeleting" />
        <div class="delete-button-wrapper">
          <button @click="deleteAccount($event)">Delete Account</button>
        </div>
      </div>
    </div>

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
// eslint-disable-next-line import/no-duplicates
import { ApiV1 } from '../Api' // Assuming your backend API call method is in Api.js
// eslint-disable-next-line import/no-duplicates
import { ApiV2 } from '../Api'

export default {
  data() {
    return {
      username: '',
      password: '',
      adminUsername: '',
      adminPassword: '',
      activeGender: null,
      activeLGBTQIA: null,
      isSaved: false,
      deleteInProcess: false,
      usernameDeleting: '',
      passwordDeleting: '',
      isAdmin: false
    }
  },
  computed: {
    isLoggedIn() {
      return this.loggedInStatus // Use reactive loggedInStatus property
    }
  },
  methods: {
    selectGender(gender) {
      this.activeGender = gender // Set active gender to the clicked button
    },
    selectLGBTQIA(status) {
      this.activeLGBTQIA = status // Directly set to 'yes' or 'no'
    },
    handleSaveChanges(event) {
      if (this.isAdmin) {
        this.saveChangesForAdmin(event)
      } else {
        this.saveChanges(event)
      }
    },
    async saveChangesForAdmin(event) {
      event.preventDefault() // Prevent form submission

      // Create userCredentials object
      const adminCredentials = {
        username: this.adminUsername,
        password: this.adminPassword
      }

      if (this.adminPassword.length > 25) {
        alert('Password cannot exceed 25 characters')
        return (this.isSaved = false)
      }

      if (this.adminPassword.length === 0) {
        alert('Password cannot be empty')
        return (this.isSaved = false)
      }

      if (this.adminPassword.length < 6) {
        alert('Password cannot be less than 6 characters')
        return (this.isSaved = false)
      }

      try {
        const authToken = localStorage.getItem('x-auth-token')
        if (!authToken) {
          throw new Error('No auth token found. Please log in.')
        }

        const response = await ApiV1.patch(`/v1/api/admin/${this.adminUsername}`, adminCredentials, {
          headers: {
            'x-auth-token': authToken // Set the token in the request headers
          }
        })

        if (response.status === 200) {
          this.isSaved = true
          console.log('User information updated successfully:', response.data)
        }
      } catch (error) {
        console.error('Update error:', error)
        alert('This is not your username.')
      }
    },

    async saveChanges(event) {
      event.preventDefault() // Prevent form submission

      // Create userCredentials object
      const userCredentials = {
        username: this.username,
        password: this.password
      }

      // Include gender only if it has been selected
      if (this.activeGender !== null) {
        userCredentials.gender = this.activeGender
      }

      // Include isLGBTQIA only if it has been selected
      if (this.activeLGBTQIA !== null) {
        userCredentials.isLGBTQIA = this.activeLGBTQIA === 'yes'
      }

      if (this.password.length > 25) {
        alert('Password cannot exceed 25 characters')
        return (this.isSaved = false)
      }

      if (this.password.length === 0) {
        alert('Password cannot be empty')
        return (this.isSaved = false)
      }

      if (this.password.length < 6) {
        alert('Password cannot be less than 6 characters')
        return (this.isSaved = false)
      }

      try {
        const authToken = localStorage.getItem('x-auth-token')
        if (!authToken) {
          throw new Error('No auth token found. Please log in.')
        }

        const response = await ApiV2.put(`/api/users/${this.username}`, userCredentials, {
          headers: {
            'x-auth-token': authToken // Set the token in the request headers
          }
        })

        if (response.status === 200) {
          this.isSaved = true
          console.log('User information updated successfully:', response.data)
        }
      } catch (error) {
        console.error('Update error:', error)
        alert('This is not your username.')
      }
    },
    deletePopUp() {
      this.deleteInProcess = true
    },
    closeDeletePopUp() {
      this.deleteInProcess = false
    },
    async deleteAccount(event) {
      event.preventDefault()
      try {
        const authToken = localStorage.getItem('x-auth-token')
        if (!authToken) throw new Error('No auth token found. Please log in.')
        const response = await ApiV2.delete(`/api/users/${this.usernameDeleting}`, {
          headers: {
            'x-auth-token': authToken // Send token for authorization
          },
          data: { password: this.passwordDeleting }
        })

        if (response.status === 200) {
          console.log('Account deleted successfully')
          this.logout()
        }
      } catch (error) {
        console.error('Error deleting account:', error)
        alert('Error deleting account. Please check your credentials.')
      }
    },
    logout() {
      localStorage.removeItem('x-auth-token')
      this.loggedInStatus = false
      this.$router.push('/')
    },
    async checkIfAdmin() {
      try {
        const response = await ApiV1.get('/v1/api/admin/verify-admin', {
          headers: {
            'x-auth-token': localStorage.getItem('x-auth-token')
          }
        })
        this.isAdmin = response.data.isAdmin // Store admin status
      } catch (error) {
        console.error('Error checking admin status:', error)
      }
    }
  },
  mounted() {
  // Check login status when the component is mounted
    const loggedInStatus = !!localStorage.getItem('x-auth-token')
    console.log('User logged in status:', loggedInStatus)
    // Check if the user is an admin
    this.checkIfAdmin()

    // Create a link element for Font Awesome (for icons, if needed)
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css'
    link.integrity = 'sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=='// Replace this with the correct integrity hash
    link.crossOrigin = 'anonymous'
    link.referrerPolicy = 'no-referrer'
    document.head.appendChild(link)
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

.b-dropdown .dropdown-menu {
  width: auto;
  white-space: nowrap;
  padding: 0;
  margin: 0;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem;
}

.b-dropdown .dropdown-item{
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  text-align: inherit;
  border: none;
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

.logo img{
  max-height: 4rem;
}

a img {
  max-height: 1rem;
  color: #42515e;
}

.user-form {
  flex-direction: column;
  margin-top: 10rem;
  margin-left: 23rem;
  width: 50%;
}

.admin-text{
  color: #bc672a;
  margin-top: 3rem;
  margin-bottom: 3rem;
  font-family: 'Lexend Deca', sans-serif;
}

.user-form p{
  margin-left: 0rem;
  font-weight: normal;
  color: rgba(0, 0, 0, 0.301);
}

label {
  color: #8FC6DF;
  font-size: 1.1rem;
  font-family: 'Lexend Deca', sans-serif;
  text-align: left;
}

.input-field {
  color: #bc672a;
  font-size: 1rem;
  padding: 12px 20px;
  font-family: 'Lexend Deca', sans-serif;
  border: rgba(0, 0, 0, 0.301);
  background-color: rgba(0, 0, 0, 0.301);
  width: 50rem;
  outline: none;
  margin-bottom: 2rem;
}

.gender-selection {
    display: flex;
    margin-top: 2rem;
    margin-bottom: 2rem;
}

.non-binary-label {
  white-space: nowrap;
}

.sexuality-selection {
    display: flex;
    margin-top: 1rem;
    margin-bottom: 1rem;
}

.gender-selection label, .sexuality-selection label {
    color: #8FC6DF;
    font-size: 1.1rem;
    font-family: 'Lexend Deca', sans-serif;
}

.gender-buttons, .sexuality-buttons {
    display: flex;
    gap: 4rem;
    margin-left: 2rem;
}

.gender-item, .sexuality-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.gender-button, .sexuality-button {
    width: 1.2rem;
    height: 1.2rem;
    background-color: rgba(0, 0, 0, 0.301);
    cursor: pointer;
    border: 2px solid transparent;
    transition: background-color 0.3s, border-color 0.3s;
}

.gender-button:hover, .sexuality-button:hover {
    border-color: #bc672a;
}

.gender-button.active, .sexuality-button.active {
    background-color: #bc672a;
}

.delete-button-container {
  display: flex;
  align-items: center;
  margin-top: 3rem;
  margin-bottom: 5rem;
}

.save-message-container{
  display: flex;
  align-items: center;
  margin-top: 3.3rem;
  margin-bottom: 5rem;
}

.save-button-container {
  align-content: center;
  display: flex;
  margin-top: 3rem;
  margin-bottom: 5rem;
}

.save-button {
  background-color: rgba(0, 0, 0, 0.301);
  color: #edf7fb;
  border: none;
  padding: 0.3rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  margin-left:1rem;
}

.saved-message {
  color: #8FC6DF;
  font-size: 1rem;
  font-family: 'Lexend Deca', sans-serif;
  margin-left: 5rem;
}

.delete-button {
  background-color: #bc672a;
  color: #edf7fb;
  border: none;
  padding: 0.3rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  margin-right: 0rem;
}

.delete-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -35%);
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  z-index: 10;
  min-width: 300px;
  max-width: 600px;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 9;
}

.delete-popup.show {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1.05);
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #bc672a;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.popup-header button{
  margin-left: auto;
  border: none;
  display: flex;
  justify-content: flex-end;
  color:#bc672a;
}

.popup-body label {
  list-style-type: none;
  padding: 0;
  margin: 0;
  color: #045768;
}

.popup-body p {
  list-style-type: none;
  padding: 0;
  margin: 0;
  color: #045768;
  margin-bottom: 1rem;
}

.popup-body {
  padding: 2rem;
  display: flex;
  flex-direction: column;
}

.popup-body input{
  width: 100%;
  color:#bc672a;
}

.input-field-popup {
  color: #bc672a;
  font-size: 1rem;
  padding: 12px 20px;
  font-family: 'Lexend Deca', sans-serif;
  border: 1px solid #555;
  width: 50rem;
  outline: none;
  margin-bottom: 2rem;
}

.delete-button-wrapper{
  justify-content: center;
  display: flex;
}

.popup-body button{
  width: 40%;
  background-color: #bc672a;
  color: #edf7fb;
  transition: all 0.3s;
  border: none;
  padding: 0.5rem 1rem;
}

.popup-body button:hover{
  background-color: #bc672a;
  color: #edf7fb;
  transform: scale(1.03);
}

p{
  color: #233341;
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0.5rem 1rem 1.5rem;
}

.popup-body p,
.popup-body button{
  justify-content: center;
  display: flex;
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
    .navbar{
        width: 100%;
        display: flex;
        justify-content: space-evenly;
    }

    .maincities-body-container{
      min-width: 1200px;
    }

    .user-form{
    margin-left: 14rem;
    width: 70%;
    }

    .footer{
        min-width: 1200px;
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
        gap: 2rem;
        padding: 2rem 3%;
    }

    .user-form{
      margin-left: 17rem;
      margin-top: 19rem;
      width: 55%;
    }

    .admin-text{
    margin-top: 0.5rem;
    margin-bottom: 2.5rem;
  }

  .admin-text h1, .admin-text p{
    font-size: 1.8rem;
  }
}

  @media screen and (max-width:350px) {
  .user-form{
      width: 60%;
      margin-top: 20rem;
    }
  .delete-button-container, .save-message-container,
  .save-button-container{
    margin-top: 7rem;
    margin-bottom: 20rem;
  }

  #username.input-field, #password.input-field {
    width: 80%;
    padding: 12px 20px;
    margin-bottom: 2rem;
    font-size: 2rem;
  }

  .gender-selection label, .sexuality-selection label,
  label.gender.label, label.sexuality.label, label {
    font-size: 2.2rem;
  }

  .gender-selection, .sexuality-selection,
  div.gender-buttons, div.sexuality-buttons{
    flex-direction: column;
    margin-top: 1rem;
  }

  .gender-buttons, .sexuality-buttons {
    margin-left: 0rem;
    gap: 1rem;
  }

  .gender-button, .sexuality-button {
    width: 1.9rem;
    height: 1.9rem;
 }

  .delete-button-container, .save-message-container,
  .save-button-container{
    margin-top: 7rem;
    margin-bottom: 5rem;
  }

  .delete-button {
    font-size: 2rem;
    margin-right: -5rem;
  }

  .save-button {
    font-size: 2rem;
    margin-left:-5rem;
  }

  .saved-message {
    margin-left: -2rem;
    margin-top: 2rem;
    font-size: 2rem;
  }

  .gender-row, .sexuality-row{
    margin-top: 3rem;
  }

  .delete-popup.show p {
    font-size:2.5rem;
  }

  .popup-body button{
    width: 60%;
    font-size: 2rem;
}

 .admin-text{
    margin-top: 12rem;
    margin-bottom: 10rem;
  }

  .admin-text h1{
    font-size: 5rem;
  }

  .admin-text p{
    font-size: 3rem;
  }

 .footer{
    flex-direction: column-reverse;
  }

}

</style>

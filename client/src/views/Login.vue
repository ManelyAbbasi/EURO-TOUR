<template>
    <!-- Parent container for the split layout -->
    <div class="split-container">
      <!-- Left side: light blue background -->
      <div class="left-side">
        <!-- Logo section -->
        <div class="logo">
          <router-link to="/">
            <img src="@/assets/vertical-logo.png" alt="Euro Tour logo" draggable="false" class="logo-img">
          </router-link>
        </div>
      </div>

      <!-- Right side: Form with dark blue background -->
      <div class="right-side">
        <div class="container">
          <!-- Container for the form -->
          <div class="form-entries">
            <!-- 1st row: username -->
            <div class="row-form">
              <input class="input" name="username" id="usernameID" type="text" v-model="username" placeholder="username">
            </div>

            <!-- 2nd row: password -->
            <div class="row-form">
              <input class="input" name="password" id="passwordID" type="password" v-model="password" placeholder="password">
            </div>

            <!-- Login button -->
            <div class="button-container">
              <button class="btn" type="button" @click="saveButton()" :disabled="isEmpty">log in</button>
            </div>

             <!-- Don't have an account section -->
          <div class="create-account-container">
            <span>new to euro trip? </span>
            <router-link to="/" class="create-account-link"> create an account</router-link>
          </div>
          </div>
        </div>
      </div>
    </div>
</template>

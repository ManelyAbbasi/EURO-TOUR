<template>
    <header class="euro-tour_header">
      <div class="logo_container">
        <a href="#/"><img src="/src/assets/horizontal-logo.png" alt="Euro Tour logo" draggable="false"></a>
      </div>
      <nav class="header_nav_bar"> 
        <a href="#/cities" class="header_link"><font-awesome-icon icon="city" style="color: #edf7fb;" /> cities</a>
        <a href="#/places_to_visit" class="header_link"><font-awesome-icon icon="map-pin" style="color: #edf7fb;" /> places to visit</a>
      </nav>
      <div class="user_button">
        <!-- The 'AccessButton' component serves as a sign in/out button -->
        <UserButton @userButtonEvent="$emit('userButtonEvent')" />
      </div>
    </header>
  </template>
  
  <script>
  import UserButton from "@/components/UserButton.vue";
  
  export default {
    name: "SiteHeader",
    components: {UserButton} // Access to the child component.
  }
  </script>
  
  <style scoped>                  /* Style scoped applies css properties to HTML elements but only targets the elements of the component it is in. */
  
  .euro-tour_header {
    background-color: rgba(155, 169, 182, 1);
    display: flex;               /* Adapting to screen size*/
    align-items: center;
    height: 100px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 20px;
    z-index: 9999;              /* The high z-index value ensures consistency in that the page header is always displayed above all other page content. */
  }
  
  .logo_container {
    margin-right: 5px;
  }
  
  .header_nav_bar {
    display: flex;              /* Adapting to screen size */
    flex: 1;                    /* Resizes when growing and shrinking */
    justify-content: center;    /* Centers the flex items horizontally within the container. (The links are always centered )  */
  }
  
  .header_link {
    margin: 10px;
    text-decoration: none;
    transition: transform 0.3s ease-in-out;  /* Defines how the transition between two states will look.  */
  }                                          /* In this case the links will move smoothly in and out between scale 1 and 1.1 when hovered  */
  
  
  .header_link:hover {
    transform: scale(1.1);                   /* Makes element  10 % larger  */
  }
  
  .header_button {
    margin: 20px;
    width: 250px;
  }
  
  </style>
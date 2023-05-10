<template>
  <div v-if="!isLoggedIn()">{{this.redirect()}}</div>
  <div class="menuButton">
    <button class="btn-outline-dark" @click="this.popMenu=!this.popMenu">Menu</button>
  </div>

  <div class="menuItems" v-if="popMenu">
    <nav>
      <div><router-link to="/">Home</router-link></div>
      <div><router-link to="/catalog">Catalog</router-link></div>
      <div><router-link to="/addproduct">AddProduct</router-link></div>
      <div><router-link to="/edit">EditProducts</router-link></div>
      <div><router-link to="/removeproduct">RemoveProduct</router-link></div>
    </nav>
  </div>
<!--  <header>
    <div class="wrapper">
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/catalog">Catalog</router-link>
        <router-link to="/addproduct">AddProduct</router-link>
        <router-link to="/edit">EditProducts</router-link>
        <router-link to="/removeproduct">RemoveProduct</router-link>
      </nav>
    </div>
  </header>-->
  <header class="infoPropo">
    This is the main page of the Catalog app. Please use the menu on the left to navigate to the pages that
    you want to use.
  </header>
  <header class="title">MainPage</header>
</template>

<script>
import Dropdown from '../components/Dropdown.vue';
import router from "../router/index.ts"
import {loggedIn} from "./LoginForm.vue"
export default {
  data: function () {
    return {
      popMenu:false,
      services: [
        {
          title: 'Web',
          link: '#'
        },
        {
          title: 'Design',
          link:'#'
        },
        {
          title: 'AddProduct',
          link: 'localhost:3000/addproduct'
        }
      ]
    }
  }, methods: {
    redirect() {
      router.push('/login');
      router.go(1);
    },
    isLoggedIn() {
      return loggedIn;
    }
  }, components: {
    Dropdown
  }
}
</script>

<style scoped>
.title {
  position: fixed;
  top:0px;
  left:140px;
  font-size: 80px;
  font-family: "Times New Roman",serif;
}
.infoPropo {
  font-size: 40px;
}
.menu {
  position: fixed;
  top: 200px;
}
.menuItems {
  position: fixed;
  top:160px;
  left: 60px;
}
.menuButton {
  position: fixed;
  top:120px;
  left:40px;
  font-size: 25px;
}
</style>
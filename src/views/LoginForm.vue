<script xmlns:margin-bottom="http://www.w3.org/1999/xhtml">
import axios from "axios";
import router from "../router";
import Cookies from 'js-cookie'

export var loggedIn = Cookies.get("loggedIn");
export default {
  data: function () {
    return {
      username: null,
      password: null,
      errMsg: ""
    }
  }, methods: {
    sendForm() {
        console.log("intra in functie");
        axios.post('https://authservice.idproj.me/api/auth/signin', {
          username: this.username,
          password: this.password
        })
            .then(function (response) {
              loggedIn = response["data"];
              console.log(loggedIn);
              Cookies.set("loggedIn", loggedIn["token"]);
              if (loggedIn !== false) {
                //his.$cookies.set("loggedIn", true);
                router.push("catalog")
              }
            })
            .catch(function (error) {
              console.log(error);
              loggedIn = false;
            });
      setTimeout(() => {
        if (loggedIn === false) {
          this.errMsg = "Username and/or password are invalid";
        }
      }, 100);

      }
  }, beforeMount() {
    Cookies.set("loggedIn", "false");
  }
}
</script>

<template>
  <body>
    <div class="container-fluid" id="container">
      <div class="row">
        <div class="col-sm-6 text-black">

          <div class="px-5 ms-xl-4" id="firstRow">
            <img src="../../public/download1.png" id="img" alt=""/>
          </div>

          <div class="d-flex align-items-center h-custom-2 px-5 ms-xl-4 mt-5 pt-5 pt-xl-0 mt-xl-n5">

            <form id="form">

              <h3 id="logInHeader">Log in</h3>

              <div style="padding: 15px;text-align: center;">
                <label id="form2Example18">Username</label>
                <input class="form-control form-control-lg" placeholder="Your Username" v-model="this.username"/>
              </div>

              <div id="passwordSpace">
                <label class="form-label" id="form2Example28">Password</label>
                <input type="password" class="form-control form-control-lg" placeholder="Your Password" @keyup.enter="sendForm" v-model="this.password"/>
              </div>

              <div v-if="this.errMsg !== ''" class="alert alert-danger" role="alert">
                {{ this.errMsg }}
              </div>

              <div id="loginBtn">
                <button class="btn" type="button" style="width: 100%;background-color: orange" @click="sendForm">Login</button>
              </div>
            </form>

          </div>

        </div>
        <div class="col-sm-6 px-0 d-none d-sm-block">
          <img src="books.jpg"
               alt="Login image" class="w-100 vh-100" id="loginImg">
        </div>
      </div>
    </div>
  </body>
</template>

<style>
@media (min-width: 1025px) {
  .h-custom-2 {
    height: 100%;
  }
}

#container {
  position:fixed;
  left: 0;
  top:0;
  width:100%;
  padding: 0;
  margin: 0;
}

#img {
  height: 150px;
  width: 150px;
}

#form {
  width: 23rem;
  position: relative;
  top:-20%;
  left: 25%;
  align-items: center;
  text-align: center;
}

#logInHeader {
  letter-spacing: 1px;
  padding: 15px;
  align-self: center;
  font-family: 'Helvetica Neue',sans-serif;
  font-weight: bold;
}

#form2Example18 {
  text-align-all: center;
  font-family: 'Helvetica Neue',sans-serif;
  font-weight: bold;
}

#form2Example28 {
  position:relative;
  place-self: center;
  font-family: 'Helvetica Neue',sans-serif;
  font-weight: bold;
}

#passwordSpace {
  padding: 15px;
  align-items: center;
  text-align: center;
}

#loginBtn {
  padding:15px;
}

#firstRow {
  padding: 0;
  margin: 0;
}

#loginImg {
  object-fit: cover;
  object-position: left;
}
</style>
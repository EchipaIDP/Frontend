<script>
import axios from "axios";
import router from "../router/index.ts"
import {loggedIn} from "./LoginForm.vue"
import Cookies from "js-cookie";
import { n } from "../components/CatalogPage.vue"
import { i } from "../components/CatalogPage.vue"
import { c } from "../components/CatalogPage.vue"
import { d } from "../components/CatalogPage.vue"

export default {
  name: "EditHook",
  data: function() {
    return {
      name: null,
      category: null,
      description: null,
      id: Number,
      msg: null,
      popMenu: false
    }
  }, beforeMount() {
    this.name = n;
    this.category = c;
    this.id = i;
    this.description = d;
  }, methods : {
    addProduct() {
      if (this.name == null || this.name.length === 0) {
        if (this.category == null || this.category.length === 0) {
          this.msg = "Name and category are mandatory";
        } else
          this.msg = "Name is mandatory.";
      } else if (this.category == null || this.category.length === 0) {
        this.msg = "Category is mandatory";
      } else {
        this.msg = "Succesfully added";
        axios.post('http://localhost:8080/products/save', {
          name: this.name,
          category: this.category,
          description: this.description
        })
            .then(function (response) {
              router.push("catalog");
              router.go(1);
              window.location.reload();
              console.log(response);
            })
            .catch(function (error) {
              console.log(error);
            });
        router.push("catalog");
        router.go(1);
        //window.location.reload();

      }
    }, redirect() {
      router.push('/login');
      router.go(1);
      //window.location.reload();
    }, isLoggedIn() {
      console.log(Cookies.get("loggedIn"));
      console.log(Cookies.get("loggedIn") === "true");
      return Cookies.get("loggedIn") !== "false";
    }, confirmChanges() {
      if (this.name == null || this.name.length === 0) {
        if (this.category == null || this.category.length === 0) {
          this.msg = "Name and category are mandatory";
        } else
          this.msg = "Name is mandatory.";
      } else if (this.category == null || this.category.length === 0) {
        this.msg = "Category is mandatory";
      } else {
        this.$swal({
          title: "Are you sure ?",
          text: "You will not be able to recover this page !",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, change it !",
          cancelButtonText: "No, cancel !",
          closeOnConfirm: false,
          closeOnCancel: false
        }).then((confirmed) => {
          if (confirmed.value) {
            console.log("ajunge la modify");
            axios.put('http://localhost:8080/products/modify', {
              name: this.name,
              category: this.category,
              description: this.description,
              ID: this.id
            }, {params:{token: Cookies.get("loggedIn")}})
                .then(function (response) {
                  this.msg = null;
                  console.log(response);
                })
                .catch(function (error) {
                  console.log(error);
                });
            router.push("catalog");
          } else {
            this.$swal("Cancelled", "Your page has not been deleted !", "error");
            router.push("catalog");
          }
        });
      }
    }
  }
};

</script>
<template>
  <div v-if="!this.isLoggedIn()">{{this.redirect()}}</div>
  <body>

  <div class="container" id="bigContainer">
    <div class="row-xxl-100" id="firstRow">
      <h1 id="appTitle">Application Header</h1>
    </div>
    <div class="row">
      <div class="col" id="col1">
        <button class="btn" id="homeButton" @click="$router.push('catalog');$router.go(1);"><img src="../../public/download1.png" id="catalogImg" alt=""/></button>
      </div>
      <div class="col-xxl">
        <h1 id="pageTitle">Edit item</h1>
      </div>
    </div>
    <div class="row">
      <div class="col" id="col2">
        <button class="btn btn-toolbar" id="btH" @click="$router.push('/catalog');$router.go(1)">Catalog</button>
      </div>
      <div class="col-xxl" id="xxlCol">
        <table>
          <tbody>
          <tr>Name*:</tr>
          <tr>
            <input v-model="this.name" />
          </tr>
          <tr>Category*:</tr>
          <tr>
            <input v-model="this.category" />
          </tr>
          <tr>Description:</tr>
          <tr>
            <input v-model="this.description" />
          </tr>
          <tr>
            <button type="button" class="btn btn-success" @click="confirmChanges" id="addButton">Edit</button>
          </tr>
          <tr>
            *The marked fields are mandatory.
          </tr>
          <tr>
            <div v-if="this.msg !== null" class="alert alert-danger" role="alert">
              {{this.msg}}
            </div>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  </body>
</template>

<style>
#bigContainer {
  position:fixed;
  left: 0;
  top:0;
  width:100%;
  padding: 0;
  margin: 0;
}

#firstRow {
  background-color: orange;
  text-align: center;
  min-height: 80px;
  left:0px;
  width:100%;
}

#pageTitle {
  position: relative;
  top:30%;
}

#col2 {
  max-width: 150px;
  background-color: beige;
  min-height: 2000px;
  text-align: center;
}

#xxlCol {
  font-size: 30px;
}

#addButton {
  font-size: 20px;
  align-items: center;
}

#btH {
  position: relative;
  left:17.5%;
  top:1%;
  font-weight: bold;
}
#appTitle {
  padding: 15px;
}
</style>


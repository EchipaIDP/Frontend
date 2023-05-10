<script>
import axios from "axios";
import router from "../router/index.ts";
import {loggedIn} from "./LoginForm.vue";
import Cookies from "js-cookie";

export default {
  name: "get-request-set-headers",
  data () {
    return {
      info: [],
      auxID:null,
      newName: null,
      newCategory: null,
      newDescription: null,
      sem: false,
      msg: null,
      popMenu: false,
      currentSort:'id',
      currentSortDir:'asc',
      idFilter: "",
      nameFilter: "",
      categoryFilter: "",
      descFilter: "",
      pageNo: 0
    }
  },
  mounted () {
    axios
        .get('http://localhost:8080/products.json',
            { params: { page : this.pageNo, size : 5 , sortElem : this.currentSort,
                direction : this.currentSortDir} })
        .then(response => (this.info = response.data))
  }, methods: {
    knowWhichButton(number) {
      this.auxID = number["id"];
    },
    sort:function(s) {
      //if s == current sort, reverse
      if(s === this.currentSort) {
        this.currentSortDir = this.currentSortDir==='asc'?'desc':'asc';
      }
      this.currentSort = s;
      this.reloadData();
    },
    confirmChanges(number) {
      console.log(number);
      this.auxID = number["id"];
      router.push("catalog");
      router.go(10);
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
            axios.post('http://localhost:8080/products/delete', {
              ID: this.auxID
            })
                .then(function (response) {
                  router.push("catalog");
                  router.go(1);
                  console.log(response);
                })
                .catch(function (error) {
                  console.log(error);
                });
            this.newName = null;
            this.newCategory = null;
            this.newDescription = null;
          } else {
            this.$swal("Cancelled", "Your page has not been deleted !", "error");
          }
          router.push("catalog");
          router.go(10);
          window.location.reload();
        });
        this.msg = null;
    }, redirect() {
      router.push('/login');
      router.go(1);
      //window.location.reload();
    }, isLoggedIn() {
      console.log(Cookies.get("loggedIn"));
      console.log(Cookies.get("loggedIn") === "true");
      return Cookies.get("loggedIn") === "true";
    }, filterTable() {
      axios.post('http://localhost:8080/products/filteredList', {
        id:this.idFilter,
        name: this.nameFilter,
        category: this.categoryFilter,
        description: this.descFilter
      })
      this.reloadData();
    }, prevPage() {
      if (this.pageNo > 0)
        this.pageNo -= 1;
      console.log(this.pageNo);
      this.reloadData();
    }, nextPage() {
      axios
          .get('http://localhost:8080/size')
          .then(response => (this.listSize = response.data))
      setTimeout(() => {
        console.log("listsize este:" + this.listSize);
        if (this.pageNo < this.listSize)
          this.pageNo = this.pageNo + 1;
        console.log(this.pageNo);
        this.reloadData();
      }, 100);
    }, noOfElements() {
      console.log(this.info.length - this.pageNo* 5);
      if (this.info.length - this.pageNo * 5 < 5)
        return this.sortedInfo.length - this.pageNo * 5;
      return 5;
    }, reloadData() {
      console.log(this.pageNo);
      console.log(this.currentSort);
      console.log(this.currentSortDir);
      axios
          .get('http://localhost:8080/products.json',
              { params: { page : this.pageNo, size : 5 , sortElem : this.currentSort,
                  direction : this.currentSortDir} })
          .then(response => (this.info = response.data))
    }
  }, computed:{
    sortedInfo:function() {
      return this.info.sort((a,b) => {
        let modifier = 1;
        if(this.currentSortDir === 'desc') modifier = -1;
        if(a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
        if(a[this.currentSort] > b[this.currentSort]) return modifier;
        return 0;
      });
    }, filteredInfo() {
      return this.info.filter(row => {
        const names = row.name.toString().toLowerCase();
        const categories = row.category.toLowerCase();
        const searchTerm = this.filter.toLowerCase();

        return (
            names.includes(searchTerm) || categories.includes(searchTerm)
        );
      });
    }
  }
};
</script>

<template>
  <div v-if="!this.isLoggedIn()">{{this.redirect()}}</div>
  <body>
  <div class="container border" style="position:fixed; left: 0; top:0;width:100%">
    <div class="row-xxl-100" style="background-color: orange; text-align: center; min-height: 60px; min-width: 2000px;left:-100px">
      <h1>Application Header</h1>
    </div>
    <div class="row">
      <div class="col" style="max-width: 150px; background-color: beige">
        <button class="btn" @click="$router.push('catalog');$router.go(1);"><img src="../../public/download1.png" style="height: 100px;width: 100px" alt=""/></button>
      </div>
      <div class="col-xxl">
        <h1 style="position: relative; top:30%">Remove item</h1>
      </div>
    </div>
    <div class="row">
      <div class="col" style="max-width: 150px; background-color: beige; min-height: 2000px">
        <button class="btn btn-toolbar" @click="$router.push('/catalog');$router.go(1)" style="position: relative; top:5%;left:12.5%; font-weight: bold;">Catalog</button>
      </div>
      <div class="col-xxl" style="font-size: 30px">
        <table class="table table-striped">
          <thead>
          <tr>
            <th @click="sort('id')">
              ID
            </th>
            <th @click="sort('name')">
              Name
            </th>
            <th @click="sort('category')">
              Category
            </th>
            <th @click="sort('description')">
              Description
            </th>
            <th>Edit</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="edible in this.info">
            <td v-for="field in edible">
              {{field}}
            </td>
            <td>
              <button class="btn btn-danger" @click="confirmChanges(edible)">Remove</button>
            </td>
          </tr>
          <tr>
            <td>
              <input v-model="this.idFilter" placeholder="Filter by ID"/>
            </td>
            <td>
              <input v-model="this.nameFilter" placeholder="Filter by Name"/>
            </td>
            <td>
              <input v-model="this.categoryFilter" placeholder="Filter by Category"/>
            </td>
            <td>
              <input v-model="this.descFilter" placeholder="Filter by Description"/>
            </td>
            <td>
              <button @click="filterTable" class="btn btn-success">Apply Filters</button>
            </td>
          </tr>
          </tbody>
          <tfoot>
          <button class="btn btn-dark" @click="prevPage">Previous Page</button>
          <button class="btn btn-dark" @click="nextPage">Next Page</button>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
  </body>
</template>

<style>
</style>


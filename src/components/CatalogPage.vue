
<script>
import axios from "axios";
import router from "../router/index.ts"
import {loggedIn} from "../views/LoginForm.vue"
import Cookies from "js-cookie";
import { saveAs } from 'file-saver';

export var n = "";
export var i = Number;
export var c = "";
export var d = "";

export class Product {
  data () {
    return {
      id : "",
      name: "",
      category: "",
      description: ""
    }
  }
}

export default {
  name: "get-request-set-headers",
  data () {
    return {
      info: [Product],
      auxID:null,
      newName: null,
      newCategory: null,
      newDescription: null,
      sem: false,
      msg: null,
      popMenu: false,
      currentSort:'ID',
      currentSortDir:'asc',
      idFilter: "",
      nameFilter: "",
      categoryFilter: "",
      descFilter: "",
      pageNo: 0,
      formData: null,
      listSize: 0,
      csvMessage: "Please select CSV file to upload",
      aux: null,
      elementsPerPage: 5
    }
  }, beforeMount() {
    console.log(this.pageNo);
    this.listSize = 0;
    axios
        .get('http://localhost:8080/products.json',
            { params: { page : this.pageNo, size : this.elementsPerPage , sortElem : this.currentSort,
                direction : this.currentSortDir} })
        .then(response => {
          console.log(response.data);
          this.info = response.data["products"];
          this.listSize = response.data["noOfPages"];
        })
    /*axios
        .get('http://localhost:8080/size')
        .then(response => (this.listSize = response.data))*/

  },
  mounted () {
    console.log(this.pageNo);
    axios
        .get('http://localhost:8080/products.json',
            { params: { page : this.pageNo, size : this.elementsPerPage , sortElem : this.currentSort,
                direction : this.currentSortDir} })
        .then(response => {
          console.log(response.data);
          this.info = response.data["products"];
          this.listSize = response.data["noOfPages"];
        })
  }, methods: {
    addButton() {
      router.push('addproduct');
    },
    removeButton() {
      router.replace('/removeproduct');
    }, editButton() {
      router.push('edit');
    }, redirect() {
      console.log("tries to redirect");
      router.push('/login');
      router.go(1);
    }, isLoggedIn() {
      console.log(Cookies.get("loggedIn"));
      console.log(Cookies.get("loggedIn") === "true");
      return Cookies.get("loggedIn") === "true";

    }, reloadData() {
      axios
          .get('http://localhost:8080/products.json',
              { params: { page : this.pageNo, size : this.elementsPerPage , sortElem : this.currentSort,
                  direction : this.currentSortDir} })
          .then(response => {
            console.log(response.data);
            this.info = response.data["products"];
            this.listSize = response.data["noOfPages"];
          })
    }, handleFileUpload() {
      console.log("intra in handle");
      let file = this.$refs.fileUpload.files[0];
      this.formData = new FormData();
      this.formData.append('file', file);
    }, sendCSV() {
      console.log("Face apelul turbat");
      axios({
        url:'http://localhost:8080/upload',
        data:this.formData,
        method:'POST',
        headers:{
          Accept: 'application/json',
          'content-type' : 'multipart/form-data'
        },
      }) .then(response => {
        this.aux = response.data;
        console.log("aux este " + this.aux);
        if (this.aux === true) {
          this.csvMessage = "File uploaded successfully";
        } else {
          this.csvMessage = "Wrong file format";
        }
        this.reloadData();
      }) .catch((error) => {
        console.log(error);
        this.csvMessage = "Wrong file format";
      })

    }, sort:function(s) {
      //if s == current sort, reverse
      if(s === this.currentSort) {
        this.currentSortDir = this.currentSortDir==='asc'?'desc':'asc';
      }
      this.currentSort = s;
      this.reloadData();
    }, filterTable() {
      axios.post('http://localhost:8080/products/filteredList', {
        id:this.idFilter,
        name: this.nameFilter,
        category: this.categoryFilter,
        description: this.descFilter
      })
      this.pageNo = 0;
      this.reloadData();
    }, prevPage() {
      if (this.pageNo > 0)
        this.pageNo -= 1;
      console.log(this.pageNo);
      this.reloadData();
    }, nextPage() {
      console.log("listsize este:" + this.listSize);
      if (this.pageNo < this.listSize) {
        this.pageNo = this.pageNo + 1;
        console.log(this.pageNo);
        this.reloadData();
      }
    }, confirmChanges(number) {
      console.log(number);
      this.auxID = number["id"];
      router.push("catalog");
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
          let productId = this.auxID;
          axios.delete(`http://localhost:8080/products/delete/${productId}`)
              .then((response) => {
                console.log(response);
                this.reloadData();
              })
              .catch(function (error) {
                console.log(error);
              });
        } else {
          this.$swal("Cancelled", "Your page has not been deleted !", "error");
        }
      });

      this.reloadData();

    }, saveFile() {
      axios.get('http://localhost:8080/download', {responseType: 'blob'}).then((response) => {

        // Log somewhat to show that the browser actually exposes the custom HTTP header
        const fileNameHeader = "products.csv";
        const suggestedFileName = response.headers[fileNameHeader];
        const effectiveFileName = (suggestedFileName === undefined
            ? "products.csv"
            : suggestedFileName);
        console.log(`Received header [${fileNameHeader}]: ${suggestedFileName}, effective fileName: ${effectiveFileName}`);

        // Let the user save the file.
        saveAs(response.data, effectiveFileName);

      }).catch((response) => {
        console.error("Could not Download the Excel report from the backend.", response);
      });
    }, knowWhichButton(edible) {
      n = edible["name"];
      i = edible["id"];
      c = edible["category"];
      d = edible["description"];
      router.push('edit');
    }, checkNumber() {
      if (this.pageNo < 0) {
        this.pageNo = 0;
      }
      if (this.pageNo > this.listSize) {
        this.pageNo = this.listSize;
      }
      console.log("pageno este " + this.pageNo);
    }, checkNoOfElements() {
      if (this.elementsPerPage < 1) {
        this.elementsPerPage = 1;
      }
    }
  }
}
</script>

<template v-cloak>
  <div v-if="!this.isLoggedIn()">{{this.redirect()}}</div>

  <body>
<!--  Full css container-->
  <div class="container" id="container">
    <div class="row-xxl-100" id="row1">
<!--      Application header/title-->
      <h1 id="appTitle">Application Header</h1>
    </div>
    <div class="row">
      <div class="col" id="col1">
<!--        Home button img-->
          <button class="btn" id="homeButton" @click="$router.push('catalog');"><img src="../../public/download1.png" id="catalogImg" alt=""/></button>
      </div>
      <div class="col-xxl" id="pageTitleCol">
<!--        Page title and file input button-->
        <h1 id="catalogTitle">Catalog</h1>
        <button class="btn btn-success" id="addButton" @click="addButton">Add entry</button>
      </div>
    </div>
    <div class="row">
      <div class="col" id="menuCol">
<!--        Menu button-->
        <button class="btn btn-toolbar" @click="$router.push('/catalog');" id="menuButton">Catalog</button>
      </div>
      <div class="col-xxl">
        <div>
<!--          Table-->
          <div class="table-wrapper-scroll-y my-custom-scrollbar">
          <table id="dtBasicExample" class="table table-striped" v-cloak>
            <thead>
            <tr>
              <th>
                <input v-model="this.idFilter" placeholder="Filter by ID"/>
              </th>
              <th>
                <input v-model="this.nameFilter" placeholder="Filter by Name"/>
              </th>
              <th>
                <input v-model="this.categoryFilter" placeholder="Filter by Category"/>
              </th>
              <th>
                <input v-model="this.descFilter" placeholder="Filter by Description"/>
              </th>
              <th>
                <button @click="filterTable" class="btn btn-success">Apply Filters</button>
              </th>
              <th><button class="btn btn-secondary" @click="saveFile">Export to CSV</button></th>
            </tr>
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
              <th>Remove</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="edible in this.info">
                <td v-for="field in edible">
                  {{field}}
                </td>
              <td>
                <button class="btn btn-success" @click="knowWhichButton(edible)">Edit</button>
              </td>
              <td>
                <button class="btn btn-danger" @click="confirmChanges(edible)">Remove</button>
              </td>
            </tr>
            </tbody>
            <tfoot>
<!--            Next and prev page-->
            </tfoot>
          </table>
          </div>
          <div class="container">
            <div class="row">
              <div class="col" id="pages">
                <button id="prevButton" class="btn btn-dark" @click="prevPage">Previous Page</button>
                <input type="number" :max='this.listSize' min="0" v-model="this.pageNo" @keyup.enter="this.checkNumber();this.reloadData()"/>
                 / {{this.listSize}}
                <button class="btn btn-dark" @click="nextPage">Next Page</button>
              </div>
              <div class="col" id="csvCol">
                <div class="frame">
                  <div class="center1">
                    <div class="title1">
                      <h4>Drop CSV file to upload</h4>
                    </div>

                    <div class="dropzone">
                      <img src="http://100dayscss.com/codepen/upload.svg" class="upload-icon" />
                      <input type="file" class="upload-input" accept=".csv" ref="fileUpload" @change="handleFileUpload()"/>
                    </div>

                    <button type="button" class="btn-2" name="uploadbutton" @click="sendCSV">Upload file</button>

                    <div v-if="this.csvMessage !== null" id="csvMsg" class="alert alert-secondary" role="alert">{{this.csvMessage}}</div>

                  </div>
                </div>
              </div>
              <div class="col" id="elemSelector">
                Select the number of elements per page:
                <input type="number" @keyup.enter="checkNoOfElements();this.pageNo=0;reloadData();" v-model.number="this.elementsPerPage" id="elemInput"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </body>
</template>

<style>
@import url(https://fonts.googleapis.com/css?family=Open+Sans:700,300);

@media screen {
  .container {
    min-width: 100%;
    min-height: 100%;
  }
}
td, th {
  padding: 5px;
}

th {
  cursor:pointer;
}

.frame {
  position: relative;
  top:100%;
  width: 400px;
  height: 400px;
  margin-top: -200px;
  margin-left: -200px;
  border-radius: 2px;

  overflow: hidden;
  background: white;
  color: #333;
  font-family: "Open Sans", Helvetica, sans-serif;
}

.center1 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 260px;
  border-radius: 3px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;
}

.title1 {
  width: 100%;
  height: 50px;
  text-align: center;
}

h4 {
  font-size: 16px;
  font-weight: 3000;
  color: #666;
}

.dropzone {
  width: 100px;
  height: 80px;
  border: 1px dashed #999;
  border-radius: 3px;
  text-align: center;
}

.upload-icon {
  margin: 25px 2px 2px 2px;
}

.upload-input {
  position: relative;
  top: -62px;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.btn-2 {
  display: block;
  width: 140px;
  height: 40px;
  background: orange;
  color: #fff;
  border-radius: 3px;
  border: 0;
  box-shadow: 0 3px 0 0 hotpink;
  transition: all 0.3s ease-in-out;
  font-size: 14px;
  margin: 10px;
}

.btn:hover {
  background: rebeccapurple;
  box-shadow: 0 3px 0 0 green;
}

.my-custom-scrollbar {
  position: relative;
  height: 390px;
  overflow: auto;
}
.table-wrapper-scroll-y {
  display: block;
}

#container {
  position:fixed;
  left: 0;
  top:0;
  width:100%;
  padding: 0;
  margin: 0;
}

#row1 {
  background-color: orange;
  text-align: center;
  min-height: 80px;
  left:0;
  width:100%;
}

#col1 {
  max-width: 150px;
  background-color: beige;
}

#homeButton {
  position: relative;
  height: 120px;
  width: 120px;
}

#catalogImg {
  height: 100px;
  width: 100px;
}

#csvCol {
  text-align: left;
  max-width: fit-content;
  max-height: fit-content;
}

#pageTitleCol {
  min-height: 140px;
}

#catalogTitle {
  position: relative;
  top:10%;
}

#addButton {
  position:relative;
  bottom: -20%;
}

#menuCol {
  max-width: 150px;
  background-color: beige;
  min-height: 2000px;
  text-align: center;
}

#menuButton {
  position: relative;
  left:17.5%;
  font-weight: bold;
}

#dtBasicExample {
  overflow: auto;
}

#pages {
  margin: 2px;
}

#prevButton {
  margin: 4px;
}

#csvMsg {
  max-width: fit-content;
}

#elemSelector {
  text-align: right;
}

#elemInput {
  max-width: 80px;
}

#appTitle {
  padding: 15px;
}
</style>

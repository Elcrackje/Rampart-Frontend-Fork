<script>

import {PostService} from "../services/posts.service.js";
import {ChefService} from "../../chefs/services/chef.service.js";
import {DishService} from "../../dishes/services/dish.service.js";
import {ChefEntity} from "../../chefs/model/chef.entity.js";
import {PostEntity} from "../model/post.entity.js";
import {DishEntity} from "../../dishes/model/dish.entity.js";

export default {
  name: "create-post-button",
  components: {},
  data() {
    return {
      dialogVisible: false,
      post: null,
      postService: new PostService(),
      chefs: [],
      chefService: new ChefService(),
      dishes: [],
      dishService: new DishService(),
      selectedChef: null,
      selectedDish: null,
      stock: null,
      unitPrice: null,
      today: null,
      publishDate: null,
    }
  },
  created() {
    Promise.all([
      this.chefService.getAll()
          .then(response => {
            this.chefs = response.data.map((chef) => new ChefEntity(chef));
            console.log("Chefs loaded:", this.chefs); // Check if chefs are loaded
          }).catch(error => {
        console.error("Error fetching Chefs:", error);
      }),
      this.postService.getAll()
          .then(response => {
            this.posts = response.data.map((post) => new PostEntity(post));
            console.log("Posts loaded:", this.posts); // Check if posts are loaded
          }).catch(error => {
        console.error("Error fetching Posts:", error);
      }),
      this.dishService.getAll()
          .then(response => {
            this.dishes = response.data.map((dish) => new DishEntity(dish));
            console.log("Dishes loaded:", this.dishes); // Check if dishes are loaded
          }).catch(error => {
        console.error("Error fetching Dishes:", error);
      })
    ])
  },
  methods: {
    openDialog() {
      this.post = null;
      this.selectedChef = null;
      this.selectedDish = null;
      this.stock = null;
      this.unitPrice = null;
      this.today = new Date();
      this.publishDate = new Date();
      this.dialogVisible = true;
      console.log(this.dialogVisible)
    },
    getDishesFromChefId(id) {
      return this.dishes.filter(dish => dish.chefId === id);
    },
    submitPost() {
      const post = new PostEntity({
        dishId: this.selectedDish.id,
        stock: this.stock,
        publishDate: this.publishDate.toISOString().split("T")[0],
        pricePerUnit: this.unitPrice,
      })
      this.postService.create(post)
          .then(() => {
            this.$emit("postsUpdated")
            alert(`Publicación creada exitosamente!`);
            this.dialogVisible = false;
          })
          .catch(error => {
            console.error("Error creando la publicación:", error);
          });
    }
  }
}
</script>

<template>
  <template v-if="chefs && dishes">
    <pv-button style="margin-bottom: 1rem" :label="$t('createPost.createPostButton')" icon="pi pi-plus-circle" @click="openDialog"></pv-button>
    <pv-dialog v-model:visible="dialogVisible" modal :header="$t('createPost.dialogHeader')">
      <pv-select style="margin-bottom: 1rem" v-model="selectedChef" :options="chefs" optionLabel="name" :placeholder="$t('createPost.selectChef')" ></pv-select>
      <template v-if="selectedChef != null">
        <pv-select v-model="selectedDish" :options="this.getDishesFromChefId(selectedChef.id)" optionLabel="nameOfDish" :placeholder="$t('createPost.selectDish')" ></pv-select>
        <pv-input-number v-model="stock" :placeholder="$t('createPost.enterStock')" inputId="integerOnly" :min="1"></pv-input-number>
        <pv-input-number v-model="unitPrice" :placeholder="$t('createPost.enterUnitPrice')" inputId="currency-pe" mode="currency" currency="PEN" :min="1"></pv-input-number>
        <pv-date-picker v-model="publishDate" :min-date="today"></pv-date-picker>
      </template>
      <template v-if="selectedChef != null && selectedDish != null && stock != null && publishDate != null">
        <pv-button type="submit" severity="primary" :label="$t('createPost.submitButton')" @click="submitPost"/>
      </template>
      <template v-else>
        <pv-button type="submit" severity="secondary" :label="$t('createPost.submitButton')" disabled/>
      </template>
    </pv-dialog>
  </template>
</template>


<style scoped>

</style>
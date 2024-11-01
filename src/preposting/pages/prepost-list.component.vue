<script>
import { PostService } from "../../posting/services/posts.service.js";
import { ChefService } from "../../chefs/services/chef.service.js";
import { PostEntity } from "../../posting/model/post.entity.js";
import { ChefEntity } from "../../chefs/model/chef.entity.js";
import PrePostDisplay from "../components/prepost-display.component.vue";
import {DishService} from "../../dishes/services/dish.service.js";
import {DishEntity} from "../../dishes/model/dish.entity.js";

export default {
  name: "pre-post-list",
  components: { PrePostDisplay },
  data() {
    return {
      prePosts: [],
      chefs: [],
      dishes: [],
      searchQuery: "",
      postService: new PostService(),
      chefService: new ChefService(),
      dishService: new DishService()
    }
  },
  created() {
    Promise.all([
      this.chefService.getAll().then(response => {
        this.chefs = response.data.map(chef => new ChefEntity(chef));
      }),
      this.dishService.getAll()
          .then(response => {
            this.dishes = response.data.map((dish) => new DishEntity(dish));
            console.log("Dishes loaded:", this.dishes); // Check if dishes are loaded
          }).catch(error => {
        console.error("Error fetching Dishes:", error);
      }),
      this.postService.getAll().then(response => {
        this.prePosts = response.data
            .map(post => new PostEntity(post))
      }),

    ]).then(() => {
      this.filterFuturePosts();
    })
        .catch(error => {
      console.error("Error fetching data:", error);
    });
  },
  computed: {
    filteredPrePosts() {
      const query = this.searchQuery.toLowerCase();
      return this.prePosts.filter(post => {
        return this.getDishFromId(post.dishId).nameOfDish.toLowerCase().includes(query) ||
            post.ingredients.some(ingredient => ingredient.toLowerCase().includes(query));
      });
    }
  },
  methods: {
    getChefFromId(chefId) {
      return this.chefs.find(chef => chef.id === chefId) || null;
    },

    getDishFromId(id) {
      console.log("Found Dish: ", this.dishes.find((dish) => dish.id === id));
      return this.dishes.find((dish) => dish.id === id);
    },

    filterFuturePosts(){
      this.prePosts = this.prePosts.filter((post) => {
        const today = new Date();
        today.setDate(today.getDate())
        const postDate = new Date(post.publishDate + 'T00:00:00' );
        return postDate > today;
      })
    }
  }

}
</script>

<template>
  <h2 style="text-align:center; margin-top: 5rem">Publicaciones para los siguientes dias de la semana</h2>
  <div class="post-grid" v-if="prePosts.length > 0">
    <div v-for="post in filteredPrePosts" :key="post.id">
      <pre-post-display :postProp="post" :chefProp="getChefFromId(getDishFromId(post.dishId).chefId)" :dishProp="getDishFromId(post.dishId)"></pre-post-display>
    </div>
  </div>
  <div v-else>
    <p>No se encontraron prepublicaciones.</p>
  </div>
</template>

<style scoped>
.post-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 columnas por fila */
  gap: 20px;
}

</style>


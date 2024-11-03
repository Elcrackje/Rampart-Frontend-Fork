<script>
import {ChefEntity} from "../../chefs/model/chef.entity.js";
import {PostService} from "../services/posts.service.js";
import {PostEntity} from "../model/post.entity.js";
import PostDisplay from "../components/post-display.component.vue";
import {ChefService} from "../../chefs/services/chef.service.js";
import {DishService} from "../../dishes/services/dish.service.js";
import {DishEntity} from "../../dishes/model/dish.entity.js";
import CreatePostButton from "../components/create-post-button.component.vue";

export default {
  name: "post-list",
  components: {CreatePostButton, PostDisplay},
  data() {
    return {
      posts: [],
      postService: new PostService(),
      chefs: [],
      chefService: new ChefService(),
      dishes: [],
      dishService: new DishService(),
      searchQuery: "",
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
    ]).then(() => {
      this.filterTodayPosts();
      this.sortPostsByChefRating();
    });
  },
  computed: {
    filteredPosts() {
      if (!this.searchQuery) return this.posts; // Display all if no query
      const query = this.searchQuery.toLowerCase();
      return this.posts.filter(post => {
        const chef = this.getChefFromId(post.chefId);
        const dish = this.getDishFromId(post.dishId);
        return (
            dish?.nameOfDish?.toLowerCase().includes(query) ||
            chef?.name?.toLowerCase().includes(query) ||
            dish?.ingredients?.some(ingredient =>
                ingredient.toLowerCase().includes(query)
            )
        );
      });
    }
  },
  methods: {
    getChefFromId(id) {
      console.log("Found Chef: ", this.chefs.find((chef) => chef.id === id));
      return this.chefs.find((chef) => chef.id === id);
    },

    getDishFromId(id) {
      console.log("Found Dish: ", this.dishes.find((dish) => dish.id === id));
      return this.dishes.find((dish) => dish.id === id);
    },

    sortPostsByChefRating() {
      this.posts.sort((a, b) => {
        return this.getChefFromId(this.getDishFromId(b.dishId).chefId).rating - this.getChefFromId(this.getDishFromId(b.dishId).chefId).rating
      });
    },

    filterTodayPosts() {
      this.posts = this.posts.filter((post) => {
        const today = new Date();
        today.setDate(today.getDate())
        const postDate = new Date(post.publishDate + 'T00:00:00');
        return (
            postDate.getDate() === today.getDate() &&
            postDate.getMonth() === today.getMonth() &&
            postDate.getFullYear() === today.getFullYear()
        );
      })
    },

    reloadPosts() {
      Promise.all([
        this.postService.getAll()
            .then(response => {
              this.posts = response.data.map((post) => new PostEntity(post));
              console.log("Posts loaded:", this.posts); // Check if posts are loaded
            }).catch(error => {
          console.error("Error fetching Posts:", error);
        })
      ]).then(() => {
        this.filterTodayPosts();
        this.sortPostsByChefRating();
      });
    }
  }
}
</script>

<template>
  <h2 style="text-align:center; margin-top: 5rem">Publicaciones del día</h2>
  <create-post-button @postsUpdated="reloadPosts" style="margin-bottom: 1rem"></create-post-button><br>
  <pv-input-text v-model="searchQuery" placeholder="Buscar por plato, ingredientes o chef"></pv-input-text>

  <div class="post-grid" v-if="filteredPosts.length > 0">
    <div v-for="post in filteredPosts" :key="post.id">
      <post-display @postsUpdated="reloadPosts" :serviceProp="this.postService" :postProp="post" :chefProp="getChefFromId(getDishFromId(post.dishId).chefId)" :dishProp="getDishFromId(post.dishId)"></post-display>
    </div>
  </div>
  <div v-else>
    <p>No se encontraron publicaciones que coincidan con los criterios de búsqueda.</p>
  </div>
</template>

<style scoped>


.post-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin: 20px;
}


</style>
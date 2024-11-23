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
      selectedDate: new Date(),
      showAllDates: true,
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
    });
  },
  computed: {
    filteredPosts() {
      if (!this.searchQuery && this.showAllDates) return this.posts;
      const query = this.searchQuery.toLowerCase();
      return this.posts.filter(post => {
        const chef = this.getChefFromId(post.chefId);
        const dish = this.getDishFromId(post.dishId);
        const postDate = new Date(post.publishDate);
        const matchesQuery = (
            dish?.nameOfDish?.toLowerCase().includes(query) ||
            chef?.name?.toLowerCase().includes(query) ||
            dish?.ingredients?.some(ingredient => ingredient.toLowerCase().includes(query))
        );
        const matchesDate = (
            this.showAllDates ||
            (postDate.getDate() === this.selectedDate.getDate() &&
                postDate.getMonth() === this.selectedDate.getMonth() &&
                postDate.getFullYear() === this.selectedDate.getFullYear())
        );
        return matchesQuery && matchesDate;
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
        const postDate = new Date(post.publishDate + 'T00:00:00');
        return (
            postDate.getDate() === this.selectedDate.getDate() &&
            postDate.getMonth() === this.selectedDate.getMonth() &&
            postDate.getFullYear() === this.selectedDate.getFullYear()
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
        this.sortPostsByChefRating();
      });
    }
  }
}
</script>

<template>
  <h2 style="text-align:center; margin-top: 5rem">{{ $t('posts.title') }}</h2>
  <create-post-button @postsUpdated="reloadPosts" style="margin-bottom: 1rem"></create-post-button><br>
  <pv-input-text v-model="searchQuery" :placeholder="$t('posts.searchPlaceholder')"></pv-input-text>
  <div class="flex items-center justify-content-center gap-2" style="margin-top: 1rem">
    <pv-date-picker v-if="!showAllDates" v-model="selectedDate"></pv-date-picker>
    <pv-checkbox v-model="showAllDates" input-id="ShowAll" binary></pv-checkbox>
    <label for="ShowAll">{{ $t('posts.showAll') }}</label>
  </div>
  <div class="post-grid" v-if="filteredPosts">
    <div v-for="post in filteredPosts" :key="post.id">
      <post-display v-if="getChefFromId(getDishFromId(post.dishId)?.chefId)" @postsUpdated="reloadPosts" :serviceProp="this.postService" :postProp="post" :chefProp="getChefFromId(getDishFromId(post.dishId).chefId)" :dishProp="getDishFromId(post.dishId)"></post-display>
    </div>
  </div>
  <div v-else>
    <p>{{ $t('posts.noPostsFound') }}</p>
  </div>
</template>


<style scoped>


.post-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 20px;
}


</style>
<template>
  <div class="dish-container">
    <h2 class="dish-title">{{ $t('dishes.title') }}</h2>
    <pv-input-text v-model="searchQuery" :placeholder="$t('dishes.searchPlaceholder')" class="search-bar"></pv-input-text>
    <button @click="openCreateDialog">{{ $t('dishes.createNewDish') }}</button>
    <div class="dish-grid">
      <pv-card v-for="dish in filteredDishes" :key="dish.id" class="dish-card">
        <template #header>
          <button class="favorite-button" @click="toggleFavorite(dish)">
            <i :class="dish.favorite ? 'fas fa-heart' : 'far fa-heart'"></i>
          </button>
          <h3>{{ dish.nameOfDish }}</h3>
        </template>
        <template #content>
          <p><strong>{{ $t('dishes.publishedBy') }}:</strong> {{ getChefFromId(dish.chefId)?.name || $t('dishes.unknownChef') }}</p>
          <p><strong>{{ $t('dishes.ingredients') }}:</strong></p>
          <ul>
            <li v-for="ingredient in dish.ingredients" :key="ingredient">{{ ingredient }}</li>
          </ul>
          <p><strong>{{ $t('dishes.preparationSteps') }}:</strong></p>
          <ol>
            <li v-for="step in dish.preparationSteps" :key="step">{{ step }}</li>
          </ol>
        </template>
        <template #footer>
          <button @click="openEditDialog(dish)">{{ $t('dishes.edit') }}</button>
          <button @click="deleteDish(dish.id)">{{ $t('dishes.delete') }}</button>
        </template>
      </pv-card>
    </div>
    <dish-create-and-edit-dialog
        :item="selectedDish"
        :visible="isDialogVisible"
        @save-requested="saveDish"
        @cancel-requested="isDialogVisible = false"
    />
  </div>
</template>

<script>
import {ChefEntity} from "../../chefs/model/chef.entity.js";
import {ChefService} from "../../chefs/services/chef.service.js";
import { DishService } from "../services/dish.service.js";
import { DishEntity } from "../model/dish.entity.js";
import DishCreateAndEditDialog from "../components/dish-create-and-edit.component.vue";

export default {
  name: "dish-list",
  components: { DishCreateAndEditDialog },
  data() {
    return {
      dishes: [],
      chefs: [],
      searchQuery: "",
      selectedDish: null,
      isDialogVisible: false,
      dishService: new DishService(),
      chefService: new ChefService(),
    };
  },
  computed: {
    filteredDishes() {
      const query = this.searchQuery.toLowerCase();
      return this.dishes.filter(dish => {
        return dish.nameOfDish.toLowerCase().includes(query) ||
            dish.ingredients.some(ingredient => ingredient.toLowerCase().includes(query));
      });
    }
  },
  async created() {
    await this.fetchDishes();
    this.chefService.getAll()
        .then(response => {
          this.chefs = response.data.map((chef) => new ChefEntity(chef));
          console.log(this.chefs);
        }).catch(error => {
      console.error("Error fetching Chefs:", error);
    });
  },
  methods: {
    getChefFromId(id) {
      return this.chefs.find((chef) => chef.id === id);
    },

    async toggleFavorite(dish) {
      dish.favorite = !dish.favorite;
      try {
        await this.dishService.update(dish.id, dish);
        this.notifySuccessfulAction(`Dish ${dish.favorite ? 'added to favorites' : 'removed from favorites'}`);
      } catch (error) {
        console.error("Error updating favorite status:", error);
      }
    },
    notifySuccessfulAction(message) {
      this.$toast.add({severity: "success", summary: "Success", detail: message, life: 3000});
    },
    async fetchDishes() {
      try {
        const response = await this.dishService.getAll();
        this.dishes = response.data.map(dish => new DishEntity(dish));
      } catch (error) {
        console.error("Error fetching dishes:", error);
      }
    },
    openCreateDialog() {
      this.selectedDish = {
        nameOfDish: "",
        ingredients: [],
        preparationSteps: [],
        id: 0,
        chefId: 0,
      };
      this.isDialogVisible = true;
    },
    openEditDialog(dish) {
      this.selectedDish = {...dish};
      this.isDialogVisible = true;
    },
    async saveDish(dish) {
      if (dish.id) {
        await this.dishService.update(dish.id, dish);
      } else {
        dish.id = this.generateUniqueId();
        await this.dishService.create(dish);
      }
      this.isDialogVisible = false;
      this.fetchDishes();
    },
    generateUniqueId() {
      return Math.floor(Math.random() * 100000);
    },
    async deleteDish(dishId) {
      await this.dishService.delete(dishId);
      this.fetchDishes();
    },
  }
};
</script>

<style scoped>
.dish-container {
  margin: 20px;
}

.dish-title {
  text-align: center;
  margin: 3rem 0 1.5rem;
  font-size: 2rem;
  color: lightgray;
  padding-top: 30px
}

.search-bar {
  display: block;
  margin: 0 auto 2rem;
  max-width: 400px;
}

.dish-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.dish-card {
  padding: 20px;
  width: 300px;
  position: relative;
}

.favorite-button {
  position: absolute;
  top: 10px;
  left: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 10;
}

.favorite-button i {
  font-size: 1.5rem;
  color: lightgray;
  transition: color 0.3s ease;
}

.favorite-button i.fas.fa-heart {
  color: red;
}

.favorite-button i.far.fa-heart {
  color: lightgray;
}

@media (max-width: 1200px) {
  .dish-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .dish-grid {
    grid-template-columns: 1fr;
  }
}
</style>

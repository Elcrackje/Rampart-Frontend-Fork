<script>
import { RecipeEntity } from "../model/recipe.entity.js";
import DataManager from "../../shared/components/data-manager.component.vue";
import {RecipeService} from "../services/recipe.service.js";
import RecipeCreateAndEditDialog from "../components/recipe-create-and-edit.component.vue";

export default {
  name: "recipe-list.component",
  components: {RecipeCreateAndEditDialog, DataManager },
  data() {
    return {
      title: {singular: "Recipe", plural: "Recipes"},
      recipes: [],
      recipe: new RecipeEntity({}),
      selectedRecipes: [],
      recipeService: new RecipeService(),
      createAndEditDialogIsVisible: false,
      isEdit: false,
      submitted: false
    };
  },
  methods: {
    notifySuccessfulAction(message) {
      this.$toast.add({severity: "success", summary: "Success", detail: message, life: 3000});
    },
    findIndexById(id) {
      return this.recipes.findIndex((recipe) => recipe.id === id);
    },
    async onNewItem() {
      this.recipe = new RecipeEntity({});
      this.isEdit = false;
      this.createAndEditDialogIsVisible = true;
    },
    async onEditItem(item) {
      this.recipe = new RecipeEntity(item);
      this.isEdit = true;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },
    async onDeleteItem(item) {
      this.recipe = new RecipeEntity(item);
      await this.deleteRecipe();
    },
    async onDeleteSelectedItems(selectedItems) {
      this.selectedRecipes = selectedItems;
      await this.deleteSelectedRecipes();
    },
    onCancelRequested() {
      this.createAndEditDialogIsVisible = false;
      this.submitted = false;
      this.isEdit = false;
    },
    async onSaveRequested(item) {
      this.submitted = true;
      if (this.recipe.name_of_dish.trim()) {
        if (item.id) {
          await this.updateRecipe();
        } else {
          await this.createRecipe();
        }
        this.createAndEditDialogIsVisible = false;
        this.isEdit = false;
      }
    },
    async createRecipe() {
      try {
        const response = await this.recipeService.create(this.recipe);
        this.recipes.push(new RecipeEntity(response.data));
        this.notifySuccessfulAction("Recipe created successfully");
      } catch (error) {
        console.error("Error creating Recipe:", error);
      }
    },
    async updateRecipe() {
      try {
        const response = await this.recipeService.update(this.recipe.id, this.recipe);
        const index = this.findIndexById(this.recipe.id);
        this.recipes[index] = new RecipeEntity(response.data);
        this.notifySuccessfulAction("Recipe updated successfully");
      } catch (error) {
        console.error("Error updating Recipe:", error);
      }
    },
    async deleteRecipe() {
      try {
        await this.recipeService.delete(this.recipe.id);
        const index = this.findIndexById(this.recipe.id);
        this.recipes.splice(index, 1);
        this.notifySuccessfulAction("Recipe deleted successfully");
      } catch (error) {
        console.error("Error deleting Recipe:", error);
      }
    },
    async deleteSelectedRecipes() {
      try {
        for (const recipe of this.selectedRecipes) {
          await this.recipeService.delete(recipe.id);
          const index = this.findIndexById(recipe.id);
          if (index !== -1) {
            this.recipes.splice(index, 1);
          }
        }
        this.notifySuccessfulAction("Selected Recipes deleted successfully");
      } catch (error) {
        console.error("Error deleting selected Recipes:", error);
      }
    }
  },
  async created() {
    try {
      const response = await this.recipeService.getAll();
      this.recipes = response.data.map((recipe) => new RecipeEntity(recipe));
    } catch (error) {
      console.error("Error fetching Recipes:", error);
    }
  }
};
</script>

<template>
  <div class="w-full template">
    <h1>Recetas</h1>
    <data-manager
        :title="Recipes"
        v-bind:items="recipes"
        v-on:new-item-requested="onNewItem"
        v-on:edit-item-requested="onEditItem($event)"
        v-on:delete-item-requested="onDeleteItem($event)"
        v-on:delete-selected-items-requested="onDeleteSelectedItems($event)"
    >
      <template #custom-columns>
        <pv-column :sortable="true" field="id" header="ID" style="min-width: 12rem"/>
        <pv-column :sortable="true" field="name_of_dish" header="Nombre del plato" style="min-width: 24rem"/>
        <pv-column :sortable="true" field="posted_by" header="Creado por" style="min-width: 24rem"/>
        <pv-column :sortable="true" field="ingredients" header="Ingredientes" style="min-width: 24rem"/>
        <pv-column :sortable="true" field="preparation_steps" header="Pasos de preparación" style="min-width: 24rem"/>
      </template>
    </data-manager>
    <recipe-create-and-edit-dialog
        :edit="isEdit"
        :item="recipe"
        :visible="createAndEditDialogIsVisible"
        v-on:cancel-requested="onCancelRequested"
        v-on:save-requested="onSaveRequested($event)"
    />
  </div>
</template>

<style scoped>
.template {
  position: relative;
  top: 80px;
}
</style>
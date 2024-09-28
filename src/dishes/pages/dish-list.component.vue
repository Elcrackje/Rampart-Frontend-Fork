<script>
import { DishEntity } from "../model/dish.entity.js";
import DataManager from "../../shared/components/data-manager.component.vue";
import {DishService} from "../services/dish.service.js";
import DishCreateAndEditDialog from "../components/dish-create-and-edit.component.vue";

export default {
  name: "dish-list.component",
  components: {DishCreateAndEditDialog, DataManager },
  data() {
    return {
      title: { singular: "Dish", plural: "Dishes" },
      dishes: [],
      dish: new DishEntity({}),
      selectedDishes: [],
      dishService: new DishService(),
      createAndEditDialogIsVisible: false,
      isEdit: false,
      submitted: false
    };
  },
  methods: {
    notifySuccessfulAction(message) {
      this.$toast.add({ severity: "success", summary: "Success", detail: message, life: 3000 });
    },
    findIndexById(id) {
      return this.dishes.findIndex((dish) => dish.id === id);
    },
    async onNewItem() {
      this.dish = new DishEntity({});
      this.isEdit = false;
      this.createAndEditDialogIsVisible = true;
    },
    async onEditItem(item) {
      this.dish = new DishEntity(item);
      this.isEdit = true;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },
    async onDeleteItem(item) {
      this.dish = new DishEntity(item);
      await this.deleteDish();
    },
    async onDeleteSelectedItems(selectedItems) {
      this.selectedDishes = selectedItems;
      await this.deleteSelectedDishes();
    },
    onCancelRequested() {
      this.createAndEditDialogIsVisible = false;
      this.submitted = false;
      this.isEdit = false;
    },
    async onSaveRequested(item) {
      this.submitted = true;
      if (this.dish.name_of_dish.trim()) {
        if (item.id) {
          await this.updateDish();
        } else {
          await this.createDish();
        }
        this.createAndEditDialogIsVisible = false;
        this.isEdit = false;
      }
    },
    async createDish() {
      try {
        const response = await this.dishService.create(this.dish);
        this.dishes.push(new DishEntity(response.data));
        this.notifySuccessfulAction("Dish created successfully");
      } catch (error) {
        console.error("Error creating Dish:", error);
      }
    },
    async updateDish() {
      try {
        const response = await this.dishService.update(this.dish.id, this.dish);
        const index = this.findIndexById(this.dish.id);
        this.dishes[index] = new DishEntity(response.data);
        this.notifySuccessfulAction("Dish updated successfully");
      } catch (error) {
        console.error("Error updating Dish:", error);
      }
    },
    async deleteDish() {
      try {
        await this.dishService.delete(this.dish.id);
        const index = this.findIndexById(this.dish.id);
        this.dishes.splice(index, 1);
        this.notifySuccessfulAction("Dish deleted successfully");
      } catch (error) {
        console.error("Error deleting Dish:", error);
      }
    },
    async deleteSelectedDishes() {
      try {
        for (const dish of this.selectedDishes) {
          await this.dishService.delete(dish.id);
          const index = this.findIndexById(dish.id);
          if (index !== -1) {
            this.dishes.splice(index, 1);
          }
        }
        this.notifySuccessfulAction("Selected Dishes deleted successfully");
      } catch (error) {
        console.error("Error deleting selected Dishes:", error);
      }
    }
  },
  async created() {
    try {
      const response = await this.dishService.getAll();
      this.dishes = response.data.map((dish) => new DishEntity(dish));
    } catch (error) {
      console.error("Error fetching Dishes:", error);
    }
  }
};
</script>

<template>
  <div class="w-full template">
    <h1> Platos </h1>
    <data-manager
        :title="Dishes"
        v-bind:items="dishes"
        v-on:new-item-requested="onNewItem"
        v-on:edit-item-requested="onEditItem($event)"
        v-on:delete-item-requested="onDeleteItem($event)"
        v-on:delete-selected-items-requested="onDeleteSelectedItems($event)"
    >
      <template #custom-columns>
        <pv-column :sortable="true" field="id" header="ID" style="min-width: 12rem"/>
        <pv-column :sortable="true" field="name_of_dish" header="Nombre del plato" style="min-width: 24rem"/>
        <pv-column :sortable="true" field="description" header="Descripción" style="min-width: 24rem"/>
        <pv-column :sortable="true" field="average_price" header="Precio promedio" style="min-width: 24rem"/>
        <pv-column :sortable="true" field="order_count" header="Conteo de orden mensual" style="min-width: 24rem"/>

      </template>
    </data-manager>
    <dish-create-and-edit-dialog
        :edit="isEdit"
        :item="dish"
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
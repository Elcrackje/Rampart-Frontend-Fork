<script>
import { NutrientEntity } from "../model/nutrient.entity.js";
import DataManager from "../../shared/components/data-manager.component.vue";
import {NutrientService} from "../services/nutrient.service.js";
import NutrientCreateAndEditDialog from "../components/nutrient-create-and-edit.component.vue";

export default {
  name: "nutrient-list.component",
  components: {NutrientCreateAndEditDialog, DataManager },
  data() {
    return {
      title: { singular: "Nutrient", plural: "Nutrients" },
      nutrients: [],
      nutrient: new NutrientEntity({}),
      selectedNutrients: [],
      nutrientService: new NutrientService(),
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
      return this.nutrients.findIndex((nutrient) => nutrient.id === id);
    },
    async onNewItem() {
      this.nutrient = new NutrientEntity({});
      this.isEdit = false;
      this.createAndEditDialogIsVisible = true;
    },
    async onEditItem(item) {
      this.nutrient = new NutrientEntity(item);
      this.isEdit = true;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },
    async onDeleteItem(item) {
      this.nutrient = new NutrientEntity(item);
      await this.deleteNutrient();
    },
    async onDeleteSelectedItems(selectedItems) {
      this.selectedNutrients = selectedItems;
      await this.deleteSelectedNutrients();
    },
    onCancelRequested() {
      this.createAndEditDialogIsVisible = false;
      this.submitted = false;
      this.isEdit = false;
    },
    async onSaveRequested(item) {
      this.submitted = true;
      if (this.nutrient.name.trim()) {
        if (item.id) {
          await this.updateNutrient();
        } else {
          await this.createNutrient();
        }
        this.createAndEditDialogIsVisible = false;
        this.isEdit = false;
      }
    },
    async createNutrient() {
      try {
        const response = await this.nutrientService.create(this.nutrient);
        this.nutrients.push(new NutrientEntity(response.data));
        this.notifySuccessfulAction("Nutrient created successfully");
      } catch (error) {
        console.error("Error creating Nutrient:", error);
      }
    },
    async updateNutrient() {
      try {
        const response = await this.nutrientService.update(this.nutrient.id, this.nutrient);
        const index = this.findIndexById(this.nutrient.id);
        this.nutrients[index] = new NutrientEntity(response.data);
        this.notifySuccessfulAction("Nutrient updated successfully");
      } catch (error) {
        console.error("Error updating Nutrient:", error);
      }
    },
    async deleteNutrient() {
      try {
        await this.nutrientService.delete(this.nutrient.id);
        const index = this.findIndexById(this.nutrient.id);
        this.nutrients.splice(index, 1);
        this.notifySuccessfulAction("Nutrient deleted successfully");
      } catch (error) {
        console.error("Error deleting Nutrient:", error);
      }
    },
    async deleteSelectedNutrients() {
      try {
        for (const nutrient of this.selectedNutrients) {
          await this.nutrientService.delete(nutrient.id);
          const index = this.findIndexById(nutrient.id);
          if (index !== -1) {
            this.nutrients.splice(index, 1);
          }
        }
        this.notifySuccessfulAction("Selected Nutrients deleted successfully");
      } catch (error) {
        console.error("Error deleting selected Nutrients:", error);
      }
    }
  },
  async created() {
    try {
      const response = await this.nutrientService.getAll();
      this.nutrients = response.data.map((nutrient) => new NutrientEntity(nutrient));
    } catch (error) {
      console.error("Error fetching Nutrients:", error);
    }
  }
};
</script>

<template>
  <div class="w-full template">
    <h1> Nutrientes </h1>
    <data-manager
        :title="Nutrients"
        v-bind:items="nutrients"
        v-on:new-item-requested="onNewItem"
        v-on:edit-item-requested="onEditItem($event)"
        v-on:delete-item-requested="onDeleteItem($event)"
        v-on:delete-selected-items-requested="onDeleteSelectedItems($event)"
    >
      <template #custom-columns>
        <pv-column :sortable="true" field="id" header="ID" style="min-width: 8rem" />
        <pv-column :sortable="true" field="name" header="Nombre del plato" style="min-width: 20rem" />
        <pv-column :sortable="true" field="unit" header="Cantidad de nutrientes" style="min-width: 8rem" />
      </template>
    </data-manager>
    <nutrient-create-and-edit-dialog
        :edit="isEdit"
        :item="nutrient"
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
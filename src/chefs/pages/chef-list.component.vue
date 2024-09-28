<script>
import { ChefEntity } from "../model/chef.entity.js";
import DataManager from "../../shared/components/data-manager.component.vue";
import {ChefService} from "../services/chef.service.js";
import CategoryCreateAndEditDialog from "../../publishing/components/category-create-and-edit.component.vue";
import ChefCreateAndEditDialog from "../components/chef-create-and-edit.component.vue";


export default {
  name: "chef-list.component",
  components: {ChefCreateAndEditDialog, CategoryCreateAndEditDialog, DataManager },
  data() {
    return {
      title: { singular: "Chef", plural: "Chefs" },
      chefs: [],
      chef: new ChefEntity({}),
      selectedChefs: [],
      chefService: new ChefService(),
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
      return this.chefs.findIndex((chef) => chef.id === id);
    },
    async onNewItem() {
      this.chef = new ChefEntity({});
      this.isEdit = false;
      this.createAndEditDialogIsVisible = true;
    },
    async onEditItem(item) {
      this.chef = new ChefEntity(item);
      this.isEdit = true;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },
    async onDeleteItem(item) {
      this.chef = new ChefEntity(item);
      await this.deleteChef();
    },
    async onDeleteSelectedItems(selectedItems) {
      this.selectedChefs = selectedItems;
      await this.deleteSelectedChefs();
    },
    onCancelRequested() {
      this.createAndEditDialogIsVisible = false;
      this.submitted = false;
      this.isEdit = false;
    },
    async onSaveRequested(item) {
      this.submitted = true;
      if (this.chef.name.trim()) {
        if (item.id) {
          await this.updateChef();
        } else {
          await this.createChef();
        }
        this.createAndEditDialogIsVisible = false;
        this.isEdit = false;
      }
    },
    async createChef() {
      try {
        const response = await this.chefService.create(this.chef);
        this.chefs.push(new ChefEntity(response.data));
        this.notifySuccessfulAction("Chef created successfully");
      } catch (error) {
        console.error("Error creating Chef:", error);
      }
    },
    async updateChef() {
      try {
        const response = await this.chefService.update(this.chef.id, this.chef);
        const index = this.findIndexById(this.chef.id);
        this.chefs[index] = new ChefEntity(response.data);
        this.notifySuccessfulAction("Chef updated successfully");
      } catch (error) {
        console.error("Error updating Chef:", error);
      }
    },
    async deleteChef() {
      try {
        await this.chefService.delete(this.chef.id);
        const index = this.findIndexById(this.chef.id);
        this.chefs.splice(index, 1);
        this.notifySuccessfulAction("Chef deleted successfully");
      } catch (error) {
        console.error("Error deleting Chef:", error);
      }
    },
    async deleteSelectedChefs() {
      try {
        for (const chef of this.selectedChefs) {
          await this.chefService.delete(chef.id);
          const index = this.findIndexById(chef.id);
          if (index !== -1) {
            this.chefs.splice(index, 1);
          }
        }
        this.notifySuccessfulAction("Selected Chefs deleted successfully");
      } catch (error) {
        console.error("Error deleting selected Chefs:", error);
      }
    }
  },
  async created() {
    try {
      const response = await this.chefService.getAll();
      this.chefs = response.data.map((chef) => new ChefEntity(chef));
    } catch (error) {
      console.error("Error fetching Chefs:", error);
    }
  }
};
</script>

<template>
  <div class="w-full">
    <data-manager
        :title="Chefs"
        v-bind:items="chefs"
        v-on:new-item-requested="onNewItem"
        v-on:edit-item-requested="onEditItem($event)"
        v-on:delete-item-requested="onDeleteItem($event)"
        v-on:delete-selected-items-requested="onDeleteSelectedItems($event)"
    >
      <template #custom-columns>
        <pv-column :sortable="true" field="id" header="ID" style="min-width: 12rem" />
        <pv-column :sortable="true" field="name" header="Nombre" style="min-width: 24rem" />
        <pv-column :sortable="true" field="rating" header="Calificación" style="min-width: 24rem" />
      </template>
    </data-manager>
    <chef-create-and-edit-dialog
        :edit="isEdit"
        :item="chef"
        :visible="createAndEditDialogIsVisible"
        v-on:cancel-requested="onCancelRequested"
        v-on:save-requested="onSaveRequested($event)"
    />
  </div>
</template>

<style scoped>

</style>
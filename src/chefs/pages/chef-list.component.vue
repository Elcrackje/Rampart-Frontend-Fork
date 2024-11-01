<script>
import { ChefEntity } from "../model/chef.entity.js";
import DataManager from "../../shared/components/data-manager.component.vue";
import { ChefService } from "../services/chef.service.js";
import CategoryCreateAndEditDialog from "../../publishing/components/category-create-and-edit.component.vue";
import ChefCreateAndEditDialog from "../components/chef-create-and-edit.component.vue";

export default {
  name: "chef-list.component",
  components: { ChefCreateAndEditDialog, CategoryCreateAndEditDialog, DataManager },
  data() {
    return {
      title: { singular: "Chef", plural: "Chefs" },
      chefs: [],
      chef: new ChefEntity({}),
      selectedChefs: [],
      searchName: "", // Campo de búsqueda por nombre
      searchRating: "", // Campo de búsqueda por rating
      chefService: new ChefService(),
      createAndEditDialogIsVisible: false,
      isEdit: false,
      submitted: false,
      imageUrl: "",
      selectedRecipe: null,   // Receta seleccionada para editar
      isDialogVisible: false, // Controla la visibilidad del modal
    };
  },
  methods: {
    async toggleFavorite(chef) {
      chef.favorite = !chef.favorite; // Alterna el valor de favorito

      // Actualiza el estado del chef en el servidor
      try {
        await this.chefService.update(chef.id, chef);
        this.notifySuccessfulAction(`Chef ${chef.favorite ? 'added to favorites' : 'removed from favorites'}`);
      } catch (error) {
        console.error("Error updating favorite status:", error);
      }
    },

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
  computed: {
    filteredChefs() {
      const nameQuery = this.searchName.toLowerCase();
      const ratingQuery = this.searchRating.toLowerCase();

      return this.chefs.filter(chef => {
        const matchesName = chef.name.toLowerCase().includes(nameQuery);
        const matchesRating = String(chef.rating).toLowerCase().includes(ratingQuery);

        return matchesName && matchesRating;
      });
    }
  },
  async created() {
    try {
      const response = await this.chefService.getAll();
      this.chefs = response.data.map((chef) => new ChefEntity(chef));
    } catch (error) {
      console.error("Error fetching Chefs:", error);
    }
  },
};
</script>

<template>
  <div class="chef-container">
    <h2 class="chef-title">Nuestros chefs</h2>

    <!-- Cuadros de búsqueda para nombre y rating -->
    <div class="search-container">
      <pv-input-text v-model="searchName" placeholder="Buscar por nombre" class="search-bar"></pv-input-text>
      <pv-input-text v-model="searchRating" placeholder="Buscar por rating" class="search-bar"></pv-input-text>
    </div>

    <div class="chef-grid">
      <pv-card v-for="chef in filteredChefs" :key="chef.id" class="chef-card">
        <template #header>
          <button class="favorite-button" @click="toggleFavorite(chef)">
            <i :class="chef.favorite ? 'fas fa-heart' : 'far fa-heart'"></i>
          </button>
          <h3>{{ chef.name }}</h3>
        </template>
        <template #content>
          <img :src="chef.imageUrl" alt="Imagen de {{ chef.name }}" class="chef-image" />
          <p><strong>Rating:</strong> {{ chef.rating }}</p>
        </template>
      </pv-card>
    </div>
  </div>
</template>

<style scoped>
.chef-container {
  margin: 20px;
}

.chef-title {
  text-align: center;
  margin: 3rem 0 1.5rem; /* Mayor margen superior para que no se solape con la barra */
  font-size: 2rem;
  color: lightgray;
}

/* Estilo para alinear los cuadros de búsqueda uno al lado del otro */
.search-container {
  display: flex;
  justify-content: center;
  gap: 1rem; /* Espacio entre los cuadros de búsqueda */
  margin-bottom: 2rem;
}

.search-bar {
  display: block;
  margin: 0 auto 2rem;
  max-width: 400px;
}

.chef-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.chef-card {
  padding: 20px;
  width: 300px;
  position: relative; /* Para que el botón de favorito esté en la esquina */
}

.chef-image {
  width: 100px;
  height: 100px;
  border-radius: 50%; /* Hacer la imagen redonda */
  object-fit: cover; /* Ajustar la imagen dentro del contenedor */
  margin: 10px 0;
}

.favorite-button {
  position: absolute;
  top: 10px;
  left: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 10; /* Asegúrate de que esté por encima de otros elementos */
}

.favorite-button i {
  font-size: 1.5rem;
  color: lightgray; /* Corazón sin sombrear por defecto */
  transition: color 0.3s ease;
}

.favorite-button i.fas.fa-heart {
  color: red; /* Corazón sombreado cuando es favorito */
}

.favorite-button i.far.fa-heart {
  color: lightgray; /* Corazón sin sombrear (solo borde) cuando no es favorito */
}
</style>

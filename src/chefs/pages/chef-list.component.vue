<script>
import { ChefEntity } from "../model/chef.entity.js";
import DataManager from "../../shared/components/data-manager.component.vue";
import { ChefService } from "../services/chef.service.js";
import ChefCreateAndEditDialog from "../components/chef-create-and-edit.component.vue";
import Swal from 'sweetalert2'; // Importa SweetAlert2

export default {
  name: "chef-list.component",
  components: {ChefCreateAndEditDialog, DataManager},
  data() {
    return {
      title: {singular: "Chef", plural: "Chefs"},
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
      selectedRecipe: null, // Receta seleccionada para editar
      isDialogVisible: false, // Controla la visibilidad del modal
    };
  },
  methods: {
    // Cambia el estado de favorito de un chef
    async toggleFavorite(chef) {
      chef.favorite = !chef.favorite;
      try {
        await this.chefService.update(chef.id, chef);
        this.notifySuccessfulAction(`Chef ${chef.favorite ? 'añadido a favoritos' : 'eliminado de favoritos'}`);
      } catch (error) {
        console.error("Error updating favorite status:", error);
      }
    },

    async confirmDeleteChef(chef) {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: `Eliminando a ${chef.name}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      });

      if (result.isConfirmed) {
        await this.deleteChef(chef); // Asegúrate de llamar a deleteChef, no onDeleteItem
        Swal.fire('Eliminado', 'El chef ha sido eliminado', 'success');
      }
    },

    // Notifica al usuario sobre una acción exitosa
    notifySuccessfulAction(message) {
      this.$toast.add({severity: "success", summary: "Success", detail: message, life: 3000});
    },

    // Encuentra el índice de un chef por su id
    findIndexById(id) {
      return this.chefs.findIndex((chef) => chef.id === id);
    },

    // Muestra el diálogo para crear un nuevo chef
    onNewItem() {
      this.chef = new ChefEntity({}); // Crear un objeto vacío para el nuevo chef
      this.isEdit = false;
      this.createAndEditDialogIsVisible = true; // Mostrar el cuadro de diálogo
      console.log('Diálogo visible:', this.createAndEditDialogIsVisible); // Verifica el valor
    },

    // Muestra el diálogo para editar un chef existente
    onEditItem(item) {
      this.chef = new ChefEntity(item);
      this.isEdit = true;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true; // Asegúrate de que el diálogo se muestre
    },

    onCancelRequested() {
      this.createAndEditDialogIsVisible = false; // Cierra el diálogo
      this.submitted = false;
      this.isEdit = false;
    },

    async onSaveRequested(item) {
      this.submitted = true;
      if (this.chef.name.trim()) {
        try {
          if (this.isEdit) {
            await this.updateChef();
          } else {
            await this.createChef();
          }
          this.createAndEditDialogIsVisible = false;
        } catch (error) {
          console.error("Error en la operación:", error);
        }
      }
    },

    // Crea un nuevo chef
    async createChef() {
      try {
        const response = await this.chefService.create(this.chef);
        if (response && response.data) {
          this.chefs.push(new ChefEntity(response.data));
          this.notifySuccessfulAction("Chef creado exitosamente");
        }
        this.createAndEditDialogIsVisible = false; // Ocultar el cuadro de diálogo
      } catch (error) {
        console.error("Error creando Chef:", error);
      }
    },

    // Actualiza un chef existente
    async updateChef() {
      try {
        const response = await this.chefService.update(this.chef.id, this.chef);
        if (response && response.data) {
          const index = this.findIndexById(this.chef.id);
          this.chefs[index] = new ChefEntity(response.data);
          this.notifySuccessfulAction("Chef actualizado exitosamente");
        }
      } catch (error) {
        console.error("Error actualizando Chef:", error);
      }
    },

    // Elimina un chef específico
    async deleteChef(chef) {
      try {
        await this.chefService.delete(chef.id); // Elimina el chef usando el servicio
        const index = this.findIndexById(chef.id); // Encuentra el chef en la lista
        if (index !== -1) {
          this.chefs.splice(index, 1); // Elimina el chef de la lista
        }
        this.notifySuccessfulAction("Chef eliminado exitosamente"); // Muestra la notificación
      } catch (error) {
        console.error("Error eliminando Chef:", error); // Si hay un error, lo muestra en la consola
      }
    },
  },

  // Propiedad computada para filtrar chefs por nombre y rating
  computed: {
    filteredChefs() {
      const nameQuery = this.searchName.toLowerCase();
      const ratingQuery = this.searchRating ? parseFloat(this.searchRating) : null;

      return this.chefs.filter(chef => {
        const matchesName = chef.name.toLowerCase().includes(nameQuery);
        const matchesRating = ratingQuery ? chef.rating >= ratingQuery : true;
        return matchesName && matchesRating;
      });
    }
  },

  // Obtiene la lista de chefs al crear el componente
  async created() {
    try {
      const response = await this.chefService.getAll();
      this.chefs = response.data.map((chef) => {
        // Aquí se asume que chef.gender existe y puede ser 'masculino'
        chef.imageUrl = chef.gender === 'masculino' ? '/path/to/chef-masculino.jpg' : '/path/to/chef-femenino.jpg';
        return new ChefEntity(chef);
      });
    } catch (error) {
      console.error("Error fetching Chefs:", error);
    }
  },
};
</script>

<template>
  <div class="chef-container">
    <h2 class="chef-title">Nuestros chefs</h2>

    <!-- Botón para agregar un nuevo chef -->
    <button class="add-chef-button" @click="onNewItem">Agregar Chef</button>

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
          <img :src="chef.imageUrl" alt="Imagen de {{ chef.name }}" class="chef-image"/>
          <p><strong>Rating:</strong> {{ chef.rating }}</p>
          <button class="edit-chef-button" @click="onEditItem(chef)">Editar</button>
          <button class="delete-chef-button" @click="confirmDeleteChef(chef)">Eliminar</button>
        </template>
      </pv-card>
    </div>

    <!-- Dialogo de creación/edición de chef -->
    <chef-create-and-edit-dialog
        v-if="createAndEditDialogIsVisible"
        :item="chef"
        :isEdit="isEdit"
        :isVisible="createAndEditDialogIsVisible"
        @cancel-requested="onCancelRequested"
        @save-requested="onSaveRequested"
    />
  </div>
</template>

<style scoped>
.chef-container {
  height: 80vh;
  margin-top: 80px;

}

.chef-title {
  text-align: center;
  margin: 3rem 0 1.5rem; /* Mayor margen superior para que no se solape con la barra */
  font-size: 2rem;
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

.add-chef-button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  font-size: 1rem;
  color: white;
  background-color: #55A603;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.edit-chef-button {
  margin-top: 10px;
  margin-right: 5px; /* Separar el botón de eliminar con 5px */
  padding: 5px 10px;
  font-size: 0.9rem;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  background-color: #D9A50D;
}

.delete-chef-button {
  margin-top: 10px;
  padding: 5px 10px;
  font-size: 0.9rem;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  background-color: #D92D07;
}

@media (max-width: 768px) {
  .chef-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .chef-grid {
    grid-template-columns: 1fr;
  }
}
</style>
<script>
import axios from 'axios';
import Swal from 'sweetalert2'; // Importa SweetAlert2

export default {
  name: "food-preferences",
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      userData: {
        id: this.user.id,
        preferences: []
      },
      preferenceOptions: [
        "Pollos y Parrillas",
        "Pizzas",
        "Sushi",
        "Hamburguesas y Sandwiches",
        "Pescados y Mariscos",
        "Comida China",
        "Comida Internacional",
        "Comida Saludable",
        "Comida Vegetariana",
        "Comida Vegana",
        "Comida Sin Gluten",
        "Desayunos",
        "Postres y Tortas"
      ]
    };
  },
  methods: {
    async fetchUserPreferences(userId) {
      try {
        const response = await axios.get(`http://localhost:3000/userProfile`);
        this.userData.preferences = response.data.preferences;
      } catch (error) {
        console.error("Error fetching food preferences:", error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar las preferencias alimentarias.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    },
    async savePreferences() {
      const selectedCount = this.userData.preferences.length;

      if (selectedCount < 4) {
        Swal.fire({
          title: 'Error',
          text: 'Tienes que marcar al menos 4 opciones.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        return; // Detener la ejecución si la validación falla
      }

      try {
        await axios.put(`http://localhost:3000/userProfile`, this.userData);
        //alert("Preferencias alimentarias actualizadas con éxito");
        Swal.fire({
          title: '¡Éxito!',
          text: 'Preferencias alimentarias actualizadas con éxito',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      } catch (error) {
        console.error("Error actualizando preferencias alimentarias:", error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron guardar las preferencias.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    },
    togglePreference(preference) {
      const index = this.userData.preferences.indexOf(preference);
      if (index > -1) {
        this.userData.preferences.splice(index, 1);
      } else {
        this.userData.preferences.push(preference);
      }
    }
  },
  mounted() {
    this.fetchUserPreferences(this.user.id);
  }
}
</script>

<template>

</template>

<style scoped>

</style>
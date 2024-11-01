<script>
import axios from 'axios';
import Swal from 'sweetalert2'; // Importa SweetAlert

export default {
  name: "personal-data",
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      userData: {
        name: '',
        email: '',
        birthDate: null,
        address: '',
        paymentMethod: '',
        cardNumber: '', // Número de tarjeta de crédito
        yapeNumber: '' // Número de Yape
      },
      paymentOptions: ['Yape', 'Tarjeta de Credito', 'Efectivo'],
      validationErrors: {} // Objeto para almacenar errores de validación
    };
  },
  methods: {
    async fetchUser(userId) {
      try {
        const response = await axios.get(`http://localhost:3000/userProfile`);
        this.userData = response.data;
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    },
    validateForm() {
      this.validationErrors = {}; // Reiniciar errores
      let isValid = true;

      // Verificar cada campo
      if (!this.userData.name) {
        this.validationErrors.name = "El nombre es requerido.";
        isValid = false;
      }
      if (!this.userData.email) {
        this.validationErrors.email = "El correo es requerido.";
        isValid = false;
      }
      if (!this.userData.birthDate) {
        this.validationErrors.birthDate = "La fecha de nacimiento es requerida.";
        isValid = false;
      }
      if (!this.userData.address) {
        this.validationErrors.address = "La dirección es requerida.";
        isValid = false;
      }
      if (!this.userData.paymentMethod) {
        this.validationErrors.paymentMethod = "Seleccione un medio de pago.";
        isValid = false;
      }
      // Validar según el método de pago seleccionado
      if (this.userData.paymentMethod === 'Yape' && !this.userData.yapeNumber) {
        this.validationErrors.yapeNumber = "El número de celular es requerido para Yape.";
        isValid = false;
      }
      if (this.userData.paymentMethod === 'Tarjeta de Credito' && !this.userData.cardNumber) {
        this.validationErrors.cardNumber = "El número de tarjeta es requerido.";
        isValid = false;
      }

      return isValid;
    },
    async editUser() {
      if (!this.validateForm()) {
        // Mostrar errores con SweetAlert
        Swal.fire({
          title: 'Error',
          text: 'Por favor, corrige los errores en el formulario.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        return;
      }

      try {
        await axios.put(`http://localhost:3000/userProfile`, this.userData);
        //alert("Usuario actualizado con éxito");
        Swal.fire({
          title: 'Éxito',
          text: 'Usuario actualizado con éxito.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      } catch (error) {
        console.error("Error actualizando el usuario:", error);
      }
    },
    goBack() {
      // Lógica para regresar
    }
  },
  mounted() {
    // Obtener datos del usuario cuando se monta el componente
    this.fetchUser(this.user.id);
  }
}
</script>

<template>

</template>


<style scoped>

</style>

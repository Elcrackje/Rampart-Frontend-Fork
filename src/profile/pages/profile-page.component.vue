<script>
import axios from 'axios';
import Swal from 'sweetalert2'; // Importa SweetAlert2

export default {
  name: "profile-page",
  data() {
    return {
      user: {
        name: '',
        email: '',
        birthDate: '',
        address: '',
        paymentMethod: '',
        cardNumber: '',
        photo: '',
        id: null, // Ensure id is initialized
        preferences: []
      },
      paymentOptions: ['Yape', 'Tarjeta de Credito', 'Efectivo'],
      validationErrors: {}, // Objeto para almacenar errores de validación
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
    async fetchUserProfile() {
      try {
        const response = await axios.get('http://localhost:3000/userProfile');
        this.user = response.data;
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.user.photo = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    formatDate(date) {
      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
    },
    validateForm() {
      this.validationErrors = {}; // Reiniciar errores
      let isValid = true;

      // Verificar cada campo
      if (!this.user.name) {
        this.validationErrors.name = "El nombre es requerido.";
        isValid = false;
      }
      if (!this.user.email) {
        this.validationErrors.email = "El correo es requerido.";
        isValid = false;
      }
      if (!this.user.birthDate) {
        this.validationErrors.birthDate = "La fecha de nacimiento es requerida.";
        isValid = false;
      }
      if (!this.user.address) {
        this.validationErrors.address = "La dirección es requerida.";
        isValid = false;
      }
      if (!this.user.paymentMethod) {
        this.validationErrors.paymentMethod = "Seleccione un medio de pago.";
        isValid = false;
      }
      // Validar según el método de pago seleccionado
      if (this.user.paymentMethod === 'Yape' && !this.user.yapeNumber) {
        this.validationErrors.yapeNumber = "El número de celular es requerido para Yape.";
        isValid = false;
      }
      if (this.user.paymentMethod === 'Tarjeta de Credito' && !this.user.cardNumber) {
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
        await axios.put(`http://localhost:3000/userProfile`, this.user);
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
    async fetchUserPreferences(userId) {
      try {
        const response = await axios.get(`http://localhost:3000/userProfile`);
        this.user.preferences = response.data.preferences;
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
      const selectedCount = this.user.preferences.length;

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
        await axios.put(`http://localhost:3000/userProfile`, this.user);
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
      const index = this.user.preferences.indexOf(preference);
      if (index > -1) {
        this.user.preferences.splice(index, 1);
      } else {
        this.user.preferences.push(preference);
      }
    }
  },
  mounted() {
    this.fetchUserProfile();
    this.fetchUserPreferences(this.user.id);
  }
};
</script>

<template>
  <div class="user-profile-page">
    <!-- Grid para la foto y el formulario -->
    <div class="profile-grid">
      <!-- Foto de perfil y botón cambiar foto -->
      <div class="photo-section">
        <img :src="user.photo" alt="Foto del Usuario" class="profile-photo" />
        <button class="change-photo" @click="triggerFileInput">
          <i class="pi pi-camera"></i> Cambiar foto
        </button>
        <input type="file" ref="fileInput" @change="handleFileChange" style="display: none;" />
      </div>

      <!-- Información del usuario -->
      <div class="user-info">
        <h2>Datos Personales</h2>

        <div class="profile-grid">

        <div class="p-field">
          <label for="name">Nombre:</label>
          <pv-input-text v-model="user.name" id="name"/>
          <span v-if="validationErrors.name" class="error">{{ validationErrors.name }}</span> <!-- Mensaje de error -->
        </div>

        <div class="p-field">
          <label for="email">Correo:</label>
          <pv-input-text v-model="user.email" id="email"/>
          <span v-if="validationErrors.email" class="error">{{ validationErrors.email }}</span> <!-- Mensaje de error -->
        </div>

        <div class="p-field">
          <label for="birthDate">Fecha de Nacimiento:</label>
          <pv-date-picker v-model="user.birthDate" id="birthDate" dateFormat="dd/mm/yy"/>
          <span v-if="validationErrors.birthDate" class="error">{{ validationErrors.birthDate }}</span> <!-- Mensaje de error -->
        </div>

        <div class="p-field">
          <label for="address">Dirección:</label>
          <pv-textarea v-model="user.address" id="address" rows="3" cols="30" />
          <span v-if="validationErrors.address" class="error">{{ validationErrors.address }}</span> <!-- Mensaje de error -->
        </div>

        <div class="p-field">
          <label for="paymentMethod">Medio de Pago:</label>
          <pv-select-button v-model="user.paymentMethod" :options="paymentOptions" id="paymentMethod"/>
          <span v-if="validationErrors.paymentMethod" class="error">{{ validationErrors.paymentMethod }}</span> <!-- Mensaje de error -->
        </div>

        <div class="p-field" v-if="user.paymentMethod === 'Yape'">
          <label for="yapeNumber">Número de Celular:</label>
          <pv-input-text v-model="user.yapeNumber" id="yapeNumber"/>
          <span v-if="validationErrors.yapeNumber" class="error">{{ validationErrors.yapeNumber }}</span> <!-- Mensaje de error -->
        </div>

        <div class="p-field" v-if="user.paymentMethod === 'Tarjeta de Credito'">
          <label for="cardNumber">Número de Tarjeta:</label>
          <pv-input-text v-model="user.cardNumber" id="cardNumber"/>
          <span v-if="validationErrors.cardNumber" class="error">{{ validationErrors.cardNumber }}</span> <!-- Mensaje de error -->
        </div>

        <div class="p-field" v-if="user.paymentMethod === 'Efectivo'">
          <label for="cashPayment">Pago en efectivo</label>
        </div>

        <div class="p-d-flex p-jc-between">
          <pv-button label="Guardar cambios" icon="pi pi-check" class="p-button-success" @click="editUser"/>
        </div>
      </div>
      </div>

      <!-- Preferencias alimentarias -->
      <div class="preferences-grid-box">
        <div class="food-preferences p-fluid">
          <h2>Preferencias Alimentarias</h2>

          <!-- Distribuir las opciones en columnas -->
          <div class="preferences-grid">
            <div class="p-field" v-for="preference in preferenceOptions" :key="preference">
              <label>
                <input
                    type="checkbox"
                    :value="preference"
                    v-model="user.preferences"
                />
                {{ preference }}
              </label>
            </div>
          </div>

          <div class="p-d-flex p-jc-between">
            <pv-button label="Guardar preferencias" icon="pi pi-check" class="p-button-success" @click="savePreferences"/>
          </div>
        </div>
      </div>

      <div class="notifications">
        <h2>Notificaciones</h2>

        <div class="notification-container">
          <p>
            Hay un nuevo plato popular en tu preferencia de
            <strong>Pescados y Mariscos</strong>.
            <router-link to="/" class="notification-link">Míralo ahora</router-link>.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos generales */
.user-profile-page {
  height: 100vh;
  text-align: center;
  padding: 5vw 2vw;
}

/* Grid para la disposición de la página de perfil */
.profile-grid {
  display: grid;
  margin-bottom: 40px;
}

/* Estilos para la foto de perfil */
.photo-section{
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.profile-photo {
  width: 100%;
  max-width: 250px;
  height: auto;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid black;
  margin: 0 auto 10px;
}

/* Botón para cambiar la foto de perfil */
.change-photo {
  background-color: #d9a50d;
  border: none;
  padding: 8px 16px;
  color: white;
  cursor: pointer;
}

.change-photo i {
  margin-right: 5px;
}

/* Estilos para la información del usuario */
.user-info {
  display: flex;
  flex-direction: column;

  gap: 20px; /* Espacio entre columnas */
}

.p-field {
  display: flex;
  flex-direction:column ;
  margin-bottom: 20px;
}

.p-d-flex {
  grid-column: span 2; /* El botón ocupa todo el ancho */
  display: flex;
  justify-content: center;
}

/* Grid para las preferencias alimentarias */
.preferences-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

/* Estilos para las preferencias alimentarias y notificaciones */
.food-preferences,
.notifications {
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Contenedor de notificaciones */
.notification-container {
  border: 2px solid #55a603;
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 10px;
  margin-top: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  color: #333;
  font-size: 16px;
}

/* Enlace de notificación */
.notification-link {
  color: #d92d07;
  font-weight: bold;
  text-decoration: none;
  transition: color 0.3s;
}

.notification-link:hover {
  color: #590202;
  text-decoration: underline;
}

/* Desactivar el redimensionamiento de textarea y input */
.p-field textarea,
.p-field input[type="text"] {
  resize: none;
}

/* Estilos para los mensajes de error */
.error {
  color: red;
  font-size: 0.9em;
  margin-top: 5px;
  margin-bottom: 10px;
  display: block;
}

/* Estilos adicionales para las preferencias alimentarias */
.food-preferences {
  background-color: #f9f9f9;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.preferences-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.p-field {
  flex: 1 1 calc(50% - 20px); /* 50% del ancho menos el gap */
  display: flex;
  align-items: center;
}

.p-field input {
  margin-right: 10px;
}

/* Estilos para los botones */
.p-d-flex {
  margin-top: 30px;
}

.p-d-flex .p-button {
  margin-right: 10px;
  transition: background-color 0.3s, transform 0.2s;
}

.p-d-flex .p-button:hover {
  transform: translateY(-2px);
}

.p-button-success {
  background-color: #28a745;
  color: white;
}

.p-button-success:hover {
  background-color: #218838;
}

@media (min-width: 1024px) {
  /* Estilos para la foto de perfil */
  .photo-section{
    margin-top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  /* Estilos para la información del usuario */
  .profile-grid {
    grid-template-columns: 1fr 1fr 1fr; /* Tres columnas en pantallas grandes */
    column-gap: 40px;
    width: auto;
  }

  .user-info {
    grid-column: span 2;
    display: flex;
    flex-direction: column;

    gap: 10px; /* Espacio entre columnas */
  }

  .p-d-flex {
    grid-column: span 3; /* El botón ocupa todo el ancho */
    display: flex;
    justify-content: center;
  }

  /* Estilos adicionales para las preferencias alimentarias */
  .preferences-grid-box {
    display: grid;
    grid-column: span 2; /* Preferencias y Notificaciones */
  }

  .preferences-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0; /* Espacio entre las columnas y filas */
  }

  .p-field {
    flex: 1 1 calc(25% - 20px); /* 25% del ancho menos el gap */
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 15px;
  }

  .p-field input {
    margin-right: 5px;
  }

  .p-d-flex {
    margin-top: 5px;
  }
}
</style>
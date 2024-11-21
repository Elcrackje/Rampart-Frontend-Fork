<script>
export default {
  name: 'ChefCreateAndEditDialog',
  props: {
    item: {
      type: Object,
      required: true
    },
    isEdit: Boolean,
    isVisible: Boolean
  },
  methods: {
    validateRating() {
      if (this.item.rating < 0 || this.item.rating > 5) {
        this.item.rating = 0; // Resetea a un valor válido
      }
    },
    closeDialog() {
      this.$emit('cancel-requested');
    },
    save() {
      console.log("Datos a guardar antes de emitir:", this.item);

      // Si usas el dropdown o toggle, ya no necesitas convertir isFavorite a 1 o 0
      // Solo debes asegurarte de que rating esté en formato flotante
      this.item.rating = parseFloat(this.item.rating);

      console.log("Datos después de la conversión:", this.item);

      // Emitir el evento con los datos del chef
      this.$emit('save-requested', this.item);
    },
  }
};
</script>


<template>
  <div v-if="isVisible" class="dialog">
    <form @submit.prevent="save">
      <h2>{{ isEdit ? 'Editar Chef' : 'Agregar Chef' }}</h2>
      <div>
        <label for="name">Nombre:</label>
        <input
            type="text"
            id="name"
            v-model="item.name"
            placeholder="Ingrese el nombre del chef"
            required
            aria-required="true"
            aria-label="Nombre del chef"
        />
      </div>
      <div class="rating">
        <label for="rating">Rating:</label>
        <input
            type="number"
            id="rating"
            v-model="item.rating"
            min="0" max="5" step="0.1"
            required
            @input="validateRating"
        />
        <small v-if="item.rating < 0 || item.rating > 5" class="error">
          El rating debe estar entre 0 y 5.
        </small>
      </div>
      <div class="favorite">
        <label for="favorite">¿Es favorito?</label>
        <select id="favorite" v-model="item.isFavorite">
          <option :value="true">Sí</option>
          <option :value="false">No</option>
        </select>
      </div>
      <div class="gender">
        <label for="gender">Género:</label>
        <select v-model="item.gender" required>
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
        </select>
      </div>
      <div class="actions">
        <button type="submit">Guardar</button>
        <button type="button" @click.stop="closeDialog">Cancelar</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

form {
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  min-width: 350px;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  animation: scaleUp 0.3s ease-out;
}

h2 {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
  margin-top: 0; /* Asegura que no haya margen innecesario arriba */
}

label {
  font-size: 14px;
  color: #555;
  margin-bottom: 5px;
  display: block;
}

input[type="text"],
input[type="number"],
select {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

.error {
  color: red;
  font-size: 0.9em;
}

.rating,
.favorite,
.gender {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px; /* Separación entre el texto y el input o checkbox */
}

input[type="checkbox"] {
  margin-left: 10px; /* Ajuste de separación entre el texto y el checkbox */
}

input[type="number"] {
  width: auto; /* Ajusta el ancho del campo rating */
  max-width: 80px; /* Limita el ancho */
}

select {
  width: auto; /* Ajusta el ancho del campo de género */
  max-width: 150px; /* Limita el ancho */
}

.favorite {
  gap: 5px; /* Separación más pequeña entre el texto y el checkbox */
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  padding: 10px 15px;
  font-size: 16px;
  color: #fff;
  background-color: #4CAF50;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button[type="button"] {
  background-color: #f44336;
}

button[type="submit"]:hover,
button[type="button"]:hover {
  background-color: #45a049;
}

button[type="button"]:hover {
  background-color: #d32f2f;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleUp {
  from {
    transform: scale(0.9);
  }
  to {
    transform: scale(1);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.dialog.leave-active {
  animation: fadeOut 0.3s ease-out;
}
</style>
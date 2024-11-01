<script>
import CreateAndEdit from "../../shared/components/create-and-edit.component.vue";

export default {
  name: "chef-create-and-edit-dialog",
  components: { CreateAndEdit },
  props: {
    item: Object, // Cambiado a Object para reflejar la estructura esperada
    visible: Boolean
  },
  data() {
    return {
      submitted: false
    }
  },
  methods: {
    onCancelRequested() {
      // Lógica para cancelar
    },
    onSaveRequested() {
      this.submitted = true;
      // Lógica para guardar
    }
  }
}
</script>

<template>
  <create-and-edit
      :entity="item"
      :visible="visible"
      entity-name="Chef"
      @cancel-requested="onCancelRequested"
      @save-requested="onSaveRequested">

    <template #content>
      <div class="p-fluid">
        <!-- Nombre del Chef -->
        <div class="field mt-5">
          <pv-float-label>
            <label for="name">Nombre</label>
            <pv-input-text id="name" v-model="item.name"
                           :class="{'p-invalid': submitted && !item.name }"/>
          </pv-float-label>
        </div>

        <!-- Rating del Chef -->
        <div class="field mt-5">
          <pv-float-label>
            <label for="rating">Rating</label>
            <pv-input-text id="rating" v-model="item.rating"
                           :class="{'p-invalid': submitted && !item.rating }"/>
          </pv-float-label>
        </div>

        <!-- URL de la imagen del Chef -->
        <div class="field mt-5">
          <pv-float-label>
            <label for="imageUrl">URL de la Imagen</label>
            <pv-input-text id="imageUrl" v-model="item.imageUrl"
                           :class="{'p-invalid': submitted && !item.imageUrl }"/>
          </pv-float-label>
        </div>

        <!-- Checkbox para marcar si es favorito -->
        <div class="field mt-5">
          <pv-checkbox inputId="favorite" v-model="item.favorite">
            <label for="favorite">¿Es favorito?</label>
          </pv-checkbox>
        </div>
      </div>
    </template>
  </create-and-edit>
</template>

<style scoped>
/* Puedes añadir estilos adicionales aquí si es necesario */
.field button {
  margin-left: 10px;
  color: red;
}
</style>

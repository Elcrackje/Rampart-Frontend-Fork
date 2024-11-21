<template>
  <create-and-edit
      :entity="item"
      :visible="visible"
      entity-name="Dish"
      @cancel-requested="onCancelRequested"
      @save-requested="onSaveRequested"
  >
    <template #content>
      <div class="p-fluid">
        <!-- Nombre del plato -->
        <div class="field mt-5">
          <pv-float-label>
            <label for="name_of_dish">Nombre del plato</label>
            <pv-input-text
                id="nameOfDish"
                v-model="item.nameOfDish"
                :class="{'p-invalid': submitted && !item.nameOfDish}"/>
          </pv-float-label>
        </div>

        <!-- Publicado por id del chef-->
        <div class="field mt-5">
          <pv-float-label>
            <label for="chefId">Publicado por(id del chef)</label>
            <pv-input-text
                id="chefId"
                v-model="item.chefId"
                :class="{'p-invalid': submitted && !item.chefId}"/>
          </pv-float-label>
        </div>

        <!-- Ingredientes -->
        <div class="field mt-5">
          <label>Ingredientes</label>
          <div v-for="(ingredient, index) in item.ingredients" :key="index" class="field mt-2">
            <pv-input-text
                v-model="item.ingredients[index]"
                placeholder="Ingrediente"/>
            <button @click="removeIngredient(index)" type="button">Eliminar</button>
          </div>
          <button @click="addIngredient" type="button">Añadir Ingrediente</button>
        </div>

        <!-- Pasos de preparación -->
        <div class="field mt-5">
          <label>Pasos de preparación</label>
          <div v-for="(step, index) in item.preparationSteps" :key="index" class="field mt-2">
            <pv-input-text
                v-model="item.preparationSteps[index]"
                placeholder="Paso de preparación"/>
            <button @click="removePreparationStep(index)" type="button">Eliminar</button>
          </div>
          <button @click="addPreparationStep" type="button">Añadir Paso</button>
        </div>
      </div>
    </template>
  </create-and-edit>
</template>

<script>
import CreateAndEdit from "../../shared/components/create-and-edit.component.vue";

export default {
  name: "dish-create-and-edit-dialog",
  components: {CreateAndEdit},
  props: {
    item: Object,
    visible: Boolean
  },
  data() {
    return {
      submitted: false
    }
  },
  methods: {
    addIngredient() {
      this.item.ingredients.push("");
    },

    removeIngredient(index) {
      this.item.ingredients.splice(index, 1);
    },

    addPreparationStep() {
      this.item.preparationSteps.push("");
    },

    removePreparationStep(index) {
      this.item.preparationSteps.splice(index, 1);
    },

    onSaveRequested() {
      this.submitted = true;

      // Convertimos chefId a número
      this.item.chefId = Number(this.item.chefId);

      // Validación de campos requeridos
      if (this.item.nameOfDish && this.item.chefId && this.item.ingredients.length > 0 && this.item.preparationSteps.length > 0) {
        this.$emit("save-requested", this.item);
      }
    },

    onCancelRequested() {
      this.$emit("cancel-requested");
    }
  }
}
</script>


<style scoped>
.field button {
  margin-left: 10px;
  color: red;
}
</style>

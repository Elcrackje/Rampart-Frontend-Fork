<script>
import CreateAndEdit from "../../shared/components/create-and-edit.component.vue";

export default {
  name: "recipe-create-and-edit-dialog",
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
    },
    onSaveRequested() {
      this.submitted = true;
    }
  }
}
</script>

<template>
  <create-and-edit
      :entity="item"
      :visible="visible"
      entity-name="Recipe"
      @cancel-requested="onCancelRequested"
      @save-requested="onSaveRequested">
    <template #content>
      <div class="p-fluid">
        <div class="field mt-5">
          <pv-float-label>
            <label for="name_of_dish">Nombre del plato</label>
            <pv-input-text id="name_of_dish" v-model="item.name_of_dish"
                           :class="{'p-invalid': submitted && !item.name_of_dish}"/>
          </pv-float-label>
        </div>
        <div class="field mt-5">
          <pv-float-label>
            <label for="posted_by">Publicado por</label>
            <pv-input-text id="posted_by" v-model="item.posted_by"
                           :class="{'p-invalid': submitted && !item.posted_by}"/>
          </pv-float-label>
        </div>
        <div class="field mt-5">
          <pv-float-label>
            <label for="ingredients">Ingredientes</label>
            <pv-input-text id="ingredients" v-model="item.ingredients"
                           :class="{'p-invalid': submitted && !item.ingredients}"/>
          </pv-float-label>
        </div>
        <div class="field mt-5">
          <pv-float-label>
            <label for="preparation_steps">Pasos para la preparación</label>
            <pv-input-text id="preparation_steps" v-model="item.preparation_steps"
                           :class="{'p-invalid': submitted && !item.preparation_steps}"/>
          </pv-float-label>
        </div>
      </div>
    </template>
  </create-and-edit>
</template>

<style>

</style>
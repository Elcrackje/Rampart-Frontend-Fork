<script>
import CreateAndEdit from "../../shared/components/create-and-edit.component.vue";

export default {
  name: "dish-create-and-edit-dialog",
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
      entity-name="Dish"
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
            <label for="description">Descripción</label>
            <pv-input-text id="description" v-model="item.description"
                           :class="{'p-invalid': submitted && !item.description}"/>
          </pv-float-label>
        </div>
        <div class="field mt-5">
          <pv-float-label>
            <label for="average_price">Precio promedio</label>
            <pv-input-text id="average_price" v-model="item.average_price"
                           :class="{'p-invalid': submitted && !item.average_price}"/>
          </pv-float-label>
        </div>
        <div class="field mt-5">
          <pv-float-label>
            <label for="order_count">Conteo de orden mensual</label>
            <pv-input-text id="order_count" v-model="item.order_count"
                           :class="{'p-invalid': submitted && !item.order_count}"/>
          </pv-float-label>
        </div>
      </div>
    </template>
  </create-and-edit>
</template>

<style >

</style>
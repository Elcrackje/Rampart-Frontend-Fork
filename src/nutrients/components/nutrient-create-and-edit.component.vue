<script>
import CreateAndEdit from "../../shared/components/create-and-edit.component.vue";

export default {
  name: "nutrient-create-and-edit",
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
      entity-name="Nutrient"
      @cancel-requested="onCancelRequested"
      @save-requested="onSaveRequested">
    <template #content>
      <div class="p-fluid">
        <div class="field mt-5">
          <pv-float-label>
            <label for="name">Nombre</label>
            <pv-input-text id="name" v-model="item.name"
                           :class="{'p-invalid': submitted && !item.name }"/>
          </pv-float-label>
        </div>
        <div class="field mt-5">
          <pv-float-label>
            <label for="unit">Cantidad de nutrientes</label>
            <pv-input-text id="unit" v-model="item.unit"
                           :class="{'p-invalid': submitted && !item.unit }"/>
          </pv-float-label>
        </div>
      </div>
    </template>
  </create-and-edit>
</template>

<style scoped>
</style>

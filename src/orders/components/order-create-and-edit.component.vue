<script>
import CreateAndEdit from "../../shared/components/create-and-edit.component.vue";

export default {
  name: "order-create-and-edit-dialog",
  components: { CreateAndEdit },
  props: {
    item: Object, // Cambiado a Object para reflejar la estructura esperada
    visible: Boolean
  },
  data() {
    return {
      submitted: false,
      dishOptions: [
        {
          label: "Lomo Saltado",
          value: {
            name: "Lomo Saltado",
            price: 18,
            imageUrl: "/src/assets/lomo-saltado.jpg",
            quantity: 1 // Añade la propiedad quantity
          }
        },
        {
          label: "Ceviche",
          value: {
            name: "Ceviche",
            price: 15.1,
            imageUrl: "/src/assets/ceviche.jpg",
            quantity: 1 // Añade la propiedad quantity
          }
        },
        {
          label: "Aji de Gallina",
          value: {
            name: "Aji de Gallina",
            price: 12.5,
            imageUrl: "/src/assets/aji-gallina.jpg",
            quantity: 1 // Añade la propiedad quantity
          }
        },
        {
          label: "Tallarines Verdes",
          value: {
            name: "Tallarines Verdes",
            price: 15.1,
            imageUrl: "/src/assets/tallarines-verdes.jpg",
            quantity: 1 // Añade la propiedad quantity
          }
        }
      ]
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
      entity-name="Order"
      @cancel-requested="onCancelRequested"
      @save-requested="onSaveRequested">
    <template #content>
      <div class="p-fluid">

        <div class="field mt-5">
          <pv-float-label>
            <label for="name">ClienteId</label>
            <pv-input-text id="customerId" v-model="item.customerId"
                           :class="{'p-invalid': submitted && !item.customerId }"/>
          </pv-float-label>
        </div>
        <div class="field mt-5">
          <pv-float-label>
            <label for="name">Fecha de la orden</label>
            <pv-input-text id="orderDate" v-model="item.orderDate"
                           :class="{'p-invalid': submitted && !item.orderDate }"/>
          </pv-float-label>
        </div>
        <div class="field mt-5">
          <pv-float-label>
            <label for="name">Fecha de entrega</label>
            <pv-input-text id="deliveryDate" v-model="item.deliveryDate"
                           :class="{'p-invalid': submitted && !item.deliveryDate }"/>
          </pv-float-label>
        </div>

        <div class="field mt-5">
          <pv-float-label>
            <label for="name">Hora de entrega</label>
            <pv-input-text id="deliveryTime" v-model="item.deliveryTime"
                           :class="{'p-invalid': submitted && !item.deliveryTime }"/>
          </pv-float-label>
        </div>

        <div class="field mt-5">
          <pv-float-label>
            <label for="name">Metodo de pago</label>
            <pv-input-text id="paymentMethod" v-model="item.paymentMethod"
                           :class="{'p-invalid': submitted && !item.paymentMethod }"/>
          </pv-float-label>
        </div>



        <div class="field mt-5">
          <pv-float-label>
            <label for="name">Status</label>
            <pv-input-text id="status" v-model="item.status"
                           :class="{'p-invalid': submitted && !item.status }"/>
          </pv-float-label>
        </div>
        <!-- Campo para seleccionar platillos y cantidad
        <div class="field mt-5">
          <label>Dishes</label>
          <div v-for="(option, index) in dishOptions" :key="index" class="dish-option">
            <pv-checkbox :value="option.value" v-model="item.dishes" :label="option.label" />
            <span style="margin-left: 10px;">{{ option.value.name }}</span>
            <input type="number" v-model.number="option.value.quantity" min="1" style="width: 50px; margin-left: 10px;" />
            <span>Quantity</span>
          </div>
          <p v-if="submitted && (!item.dishes || item.dishes.length === 0)" class="p-invalid">Please select at least one dish</p>
        </div>
        -->
      </div>
    </template>
  </create-and-edit>

</template>

<style scoped>

</style>
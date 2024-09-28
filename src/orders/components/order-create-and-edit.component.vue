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
      entity-name="Order"
      @cancel-requested="onCancelRequested"
      @save-requested="onSaveRequested">
    <template #content>
      <div class="p-fluid">

        <div class="field mt-5">
          <pv-float-label>
            <label for="name">CustomerId</label>
            <pv-input-text id="customerId" v-model="item.customerId"
                           :class="{'p-invalid': submitted && !item.customerId }"/>
          </pv-float-label>
        </div>
        <div class="field mt-5">
          <pv-float-label>
            <label for="name">OrderDate</label>
            <pv-input-text id="orderDate" v-model="item.orderDate"
                           :class="{'p-invalid': submitted && !item.orderDate }"/>
          </pv-float-label>
        </div>
        <div class="field mt-5">
          <pv-float-label>
            <label for="name">DeliveryDate</label>
            <pv-input-text id="deliveryDate" v-model="item.deliveryDate"
                           :class="{'p-invalid': submitted && !item.deliveryDate }"/>
          </pv-float-label>
        </div>
        <div class="field mt-5">
          <pv-float-label>
            <label for="name">PaymentMethod</label>
            <pv-input-text id="paymentMethod" v-model="item.paymentMethod"
                           :class="{'p-invalid': submitted && !item.paymentMethod }"/>
          </pv-float-label>
        </div>
        <div class="field mt-5">
          <pv-float-label>
            <label for="name">TotalAmount</label>
            <pv-input-text id="totalAmount" v-model="item.totalAmount"
                           :class="{'p-invalid': submitted && !item.totalAmount }"/>
          </pv-float-label>
        </div>
        <div class="field mt-5">
          <pv-float-label>
            <label for="name">Status</label>
            <pv-input-text id="status" v-model="item.status"
                           :class="{'p-invalid': submitted && !item.status }"/>
          </pv-float-label>
        </div>
      </div>
    </template>
  </create-and-edit>

</template>

<style scoped>

</style>
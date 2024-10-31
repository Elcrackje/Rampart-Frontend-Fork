
<script>
export default {
  name: "order-filter",
  data() {
    return {
      selectedOrderId: "",

      selectedStatus: "",
      selectedPaymentMethod: "",

      startDate: "",
      endDate: "",

      statuses: ["pendiente", "completado", "en preparacion"], // Ajusta según tus estados
      paymentMethods: ["Tarjeta de credito", "Efectivo", "Monedero digital"], // Ajusta según tus métodos de pago
    };
  },
  methods: {
    applyFilters() {
      this.$emit("filter-changed", {
        orderId: this.selectedOrderId,

        status: this.selectedStatus,
        paymentMethod: this.selectedPaymentMethod,

        startDate: this.startDate,
        endDate: this.endDate
      });
    },
  },
};
</script>

<template>
  <div class="filters">
    <!-- Campo para filtrar por id -->
    <label for="orderId">Order ID:</label>
    <input type="text" v-model="selectedOrderId" @input="applyFilters" placeholder="Enter Order ID" />

    <label for="status">{{$t("status")}}:</label>
    <select v-model="selectedStatus" @change="applyFilters">
      <option value="">All</option>
      <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
    </select>

    <label for="paymentMethod">{{$t("paymentMethod")}}:</label>
    <select v-model="selectedPaymentMethod" @change="applyFilters">
      <option value="">All</option>
      <option v-for="method in paymentMethods" :key="method" :value="method">{{ method }}</option>
    </select>

    <!-- Campos para filtrar por fecha de order -->
    <label for="startDate">{{$t("from")}}:</label>
    <input type="date" v-model="startDate" @change="applyFilters" />

    <label for="endDate">{{$t("to")}}:</label>
    <input type="date" v-model="endDate" @change="applyFilters" />

  </div>

</template>

<style scoped>

.filters {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

</style>
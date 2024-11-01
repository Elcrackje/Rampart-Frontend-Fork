<script>
import { OrderEntity } from "../../orders/model/order.entity.js";
import { OrderService } from "../../orders/services/order.service.js";

export default {
  name: "prepost-display",
  props: {
    postProp: {
      type: Object,
      required: true
    },
    chefProp: {
      type: Object,
      required: true
    },
    dishProp: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      ingredientListVisible: false,
      orderDialogVisible: false,
      quantity: 1,
      deliveryTime: null,
      orderService: new OrderService(),
      finalPrice: 0,
    }
  },
  watch: {
    quantity(newValue) {
      this.calculatePrice();
    }
  },
  methods: {
    openOrderDialog() {
      this.orderDialogVisible = true;
      this.calculatePrice();
    },
    calculatePrice() {
      const pricePerDish = 10;
      this.finalPrice = this.quantity * pricePerDish;
    },
    submitOrder() {
      const tempDate = new Date(this.postProp.publishDate);
      if (this.deliveryTime) {
        tempDate.setHours(this.deliveryTime.getHours());
        tempDate.setMinutes(this.deliveryTime.getMinutes());
      }
      const order = new OrderEntity({
        customerId: "1",
        orderDate: new Date().toISOString().split('T')[0],
        deliveryDate: tempDate.toISOString().split('T')[0],
        paymentMethod: "Yape",
        totalAmount: this.finalPrice,
        status: "pendiente"
      });
      this.orderService.create(order)
          .then(() => {
            alert(`Pedido realizado. Total a pagar: S/${this.finalPrice}. Yapea al número 987654321`);
            this.orderDialogVisible = false;
          })
          .catch(error => {
            console.error("Error creando la orden:", error);
          });
    },
    cancelOrder() {
      this.orderDialogVisible = false;
    }
  }
}
</script>

<template>
  <template v-if="chefProp && postProp && dishProp">
    <pv-card class="big-container" raised>
      <template #content>
        <div class="container">
          <pv-card class="card-chef">
            <template #title>
              <p><span class="pi pi-user"></span> Chef: {{ chefProp.name }}</p>
            </template>
            <template #content>
              <p>Rating: {{ chefProp.rating }} <span class="pi pi-star"></span></p>
            </template>
          </pv-card>
          <pv-card class="card-dish">
            <template #header>
              <h3 style="margin-top: 2rem">Plato: {{ dishProp.nameOfDish }}</h3>
              <!img :src="dishProp.image" :alt="dishProp.nameOfDish" width="100%" height="45%">
              <p>Fecha de publicación: {{ postProp.publishDate}}</p>
              <p>Stock: {{ dishProp.stock }}</p>
              <pv-button label="Ver Ingredientes" icon="pi pi-eye" @click="ingredientListVisible = true"
                         severity="info"></pv-button>
              <pv-button label="Programar Pedido" icon="pi pi-calendar" @click="openOrderDialog"
                         severity="success"></pv-button>
            </template>
          </pv-card>
        </div>
      </template>
    </pv-card>

    <pv-dialog v-model:visible="orderDialogVisible" modal :header="'Programar Pedido para ' + dishProp.nameOfDish">
      <p>Cantidad de platos:</p>
      <pv-input-number v-model="quantity" min="1" :max="postProp.stock"></pv-input-number>
      <p>Hora de entrega:</p>
      <pv-date-picker v-model="deliveryTime" showIcon timeOnly></pv-date-picker>
      <br>
      <p>Total a pagar: S/{{ finalPrice }}</p>
      <div class="dialog-buttons">
        <pv-button label="Realizar Pedido" icon="pi pi-check" @click="submitOrder" severity="info"></pv-button>
        <pv-button label="Cancelar" icon="pi pi-times" @click="cancelOrder" severity="warn"></pv-button>
      </div>
    </pv-dialog>

    <pv-dialog v-model:visible="ingredientListVisible" modal draggable="draggable"
               :header="'Lista de ingredientes de ' + dishProp.nameOfDish">
      <div style="text-align: center" v-for="ingredient in dishProp.ingredients">
        {{ ingredient }}
      </div>
    </pv-dialog>
  </template>
  <template v-else>
    <p>Cargando datos...</p>
  </template>
</template>

<style scoped>
.dialog-buttons {
  display: flex;
  justify-content: space-between;
}
</style>

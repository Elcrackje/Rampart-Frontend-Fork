<script>
import {PostEntity} from "../model/post.entity.js";
import {ChefEntity} from "../../chefs/model/chef.entity.js";
import {OrderEntity} from "../../orders/model/order.entity.js";
import {OrderService} from "../../orders/services/order.service.js";
import {DishEntity} from "../../dishes/model/dish.entity.js";

export default {
  name: "post-display",
  components: {},
  props: {
    postProp: PostEntity,
    chefProp: ChefEntity,
    dishProp: DishEntity
  },
  created() {
    console.log("Post Prop:", this.postProp);
    console.log("Chef Prop:", this.chefProp);
    console.log("Dish Prop:", this.dishProp);
  },
  data() {
    return {
      ingredientListVisible: false,
      orderDialogVisible: false,
      deliveryTime: null,
      minOrderTime: null,
      orderService: new OrderService(),
      finalPrice: 0,

      amount: 1,
    }
  },
  watch: {
    amount(newValue) {
      this.calculatePrice();
    }
  },
  computed: {
    minOrderTime() {
      const now = new Date();
      now.setHours(now.getHours() + 1);
      return now;
    },
  },
  methods: {
    openOrderDialog() {
      this.minOrderTime = this.setMinOrderTime();
      this.deliveryTime = this.minOrderTime;
      this.orderDialogVisible = true;
      this.calculatePrice();
    },
    calculatePrice() {
      const pricePerDish = 10;
      this.finalPrice = this.amount * pricePerDish;
    },
    setMinOrderTime() {
      const now = new Date();
      now.setHours(now.getHours() + 1);
      return now;
    },
    submitOrder() {
      const tempDate = new Date(this.postProp.publishDate);
      if (this.deliveryTime) {
        tempDate.setHours(this.deliveryTime.getHours());
        tempDate.setMinutes(this.deliveryTime.getMinutes());
      }
      const order = new OrderEntity({
        customerId: 1,
        orderDate: new Date().toISOString().split('T')[0],
        deliveryDate: tempDate.toISOString(),
        paymentMethod: "Yape",
        totalAmount: this.amount,
        status: "Pendiente"
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
  }
}
</script>

<template>
  <template v-if="chefProp && dishProp && postProp">
    <pv-card class="big-container" raised>
      <template #content>
        <div class="container">
          <pv-card class="card-chef">
            <template #title>
              <p><span class="pi pi-user"></span> Chef:<br> {{chefProp.name}}</p>
            </template>
            <template #content>
              <p>Rating: {{chefProp.rating}} <span class="pi pi-star"></span></p>
            </template>
          </pv-card>
          <pv-card class="card-dish">
            <template #header>
              <h3 style="margin-top: 2rem">Plato: {{this.dishProp.nameOfDish}}</h3>
              <!img :src="dishProp.image" :alt="dishProp.nameOfDish" width="100%" height="45%">
              <p>Stock: {{this.postProp.stock}}</p>
              <pv-button label="Ver Ingredientes" icon="pi pi-eye" @click="ingredientListVisible = true" severity="info"></pv-button><br>
              <pv-button style="margin-top: 0.5rem" label="Hacer Pedido" icon="pi pi-plus-circle" @click="openOrderDialog" severity="warn"></pv-button>
            </template>
          </pv-card>
        </div>
      </template>
    </pv-card>

    <pv-dialog v-model:visible="ingredientListVisible" modal draggable="draggable" :header="'Lista de ingredientes de '+ dishProp.nameOfDish">
      <div style="text-align: center" v-for="ingredient in this.dishProp.ingredients">
        {{ingredient}}
      </div>
    </pv-dialog>

    <pv-dialog v-model:visible="orderDialogVisible" modal :header="'Hacer pedido de ' + this.dishProp.nameOfDish">
      <p>Cantidad de Platos</p>
      <pv-input-number v-model="amount" inputId="integeronly" :min="1" :useGrouping="false" fluid></pv-input-number>
      <p>Hora de entrega:</p>
      <pv-date-picker v-model="deliveryTime" showIcon iconDisplay="input" timeOnly inputId="templateDisplay" :minDate="minOrderTime">
        <template #inputicon="slotProps">
          <i class="pi pi-clock" @click="slotProps.clickCallback" />
        </template>
      </pv-date-picker><br>
      <p>Total a pagar: S/{{ finalPrice }}</p>
      <pv-button style="margin-top: 0.5rem;margin-left: 30%" icon="pi pi-check" label="Submit" @click="submitOrder"></pv-button>
    </pv-dialog>
  </template>
  <template v-else>
    <p>Cargando datos...</p>
  </template>
</template>

<style scoped>

.big-container {
  margin-top: 1rem;
}

.container {
  display: flex;
  gap: 1rem;
}

.card-chef {
  width: 10rem;
  align-content: center;
}

.card-dish {
  width: 20rem;
}

</style>
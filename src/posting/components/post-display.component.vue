<script>
import {PostEntity} from "../model/post.entity.js";
import {ChefEntity} from "../../chefs/model/chef.entity.js";
import {OrderEntity} from "../../orders/model/order.entity.js";
import {OrderService} from "../../orders/services/order.service.js";
import {DishEntity} from "../../dishes/model/dish.entity.js";
import {PostService} from "../services/posts.service.js";

export default {
  name: "post-display",
  components: {},
  props: {
    postProp: PostEntity,
    chefProp: ChefEntity,
    dishProp: DishEntity,
    serviceProp: PostService
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
    amount() {
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
      const pricePerDish = this.postProp.pricePerUnit;
      this.finalPrice = this.amount * pricePerDish;
    },
    setMinOrderTime() {
      const now = new Date();
      now.setHours(now.getHours() + 1);
      return now;
    },
    submitOrder() {
      const tempDate = new Date(this.postProp.publishDate + 'T00:00:00');
      if (this.deliveryTime) {
        tempDate.setHours(this.deliveryTime.getHours());
        tempDate.setMinutes(this.deliveryTime.getMinutes());
      }
      const order = new OrderEntity({
        customerId: 1,
        orderDate: new Date().toISOString().split('T')[0],
        deliveryDate: this.postProp.publishDate,
        deliveryTime: this.deliveryTime.getHours() + ":" + this.deliveryTime.getMinutes(),
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
    deletePost() {
      this.serviceProp.delete(this.postProp.id)
          .then(() => {
            this.$emit("postsUpdated")
            alert("Publicación borrada exitosamente")
          })
          .catch(error => {
            console.error("No se pudo borrar la publicación:", error);
          })
    }
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
              <p><span class="pi pi-user"></span> {{ $t('postDisplay.chef') }}:<br> {{chefProp.name}}</p>
            </template>
            <template #content>
              <p>{{ $t('postDisplay.rating') }}: {{chefProp.rating}} <span class="pi pi-star"></span></p>
            </template>
          </pv-card>
          <pv-card class="card-dish">
            <template #header>
              <h3 style="margin-top: 2rem">{{ $t('postDisplay.dish') }}: {{this.dishProp.nameOfDish}}</h3>
              <!-- <img :src="dishProp.image" :alt="dishProp.nameOfDish" width="100%" height="45%"> -->
              <p>{{ $t('postDisplay.stock') }}: {{this.postProp.stock}}</p>
              <p>{{ $t('postDisplay.deliveryDate') }}: {{this.postProp.publishDate}}</p>
              <p>{{ $t('postDisplay.unitPrice') }}: S/{{this.postProp.pricePerUnit}}</p>
              <pv-button :label="$t('postDisplay.viewIngredients')" icon="pi pi-eye" @click="ingredientListVisible = true" severity="info"></pv-button><br>
              <pv-button style="margin-top: 0.5rem" :label="$t('postDisplay.placeOrder')" icon="pi pi-plus-circle" @click="openOrderDialog" severity="warn"></pv-button><br>
              <pv-button style="margin-top: 0.5rem" icon="pi pi-trash" @click="deletePost" severity="danger"></pv-button>
            </template>
          </pv-card>
        </div>
      </template>
    </pv-card>

    <pv-dialog v-model:visible="ingredientListVisible" modal draggable="draggable" :header="$t('postDisplay.ingredientListHeader', {dishName: dishProp.nameOfDish})">
      <div style="text-align: center" v-for="ingredient in this.dishProp.ingredients">
        {{ingredient}}
      </div>
    </pv-dialog>

    <pv-dialog v-model:visible="orderDialogVisible" modal :header="$t('postDisplay.orderHeader', {dishName: this.dishProp.nameOfDish})">
      <p>{{ $t('postDisplay.amountOfDishes') }}</p>
      <pv-input-number v-model="amount" inputId="integeronly" :min="1" :useGrouping="false" fluid></pv-input-number>
      <p>{{ $t('postDisplay.deliveryTime') }}:</p>
      <pv-date-picker v-model="deliveryTime" showIcon iconDisplay="input" timeOnly inputId="templateDisplay" :minDate="minOrderTime">
        <template #inputicon="slotProps">
          <i class="pi pi-clock" @click="slotProps.clickCallback" />
        </template>
      </pv-date-picker><br>
      <p>{{ $t('postDisplay.totalPrice') }}: S/{{ finalPrice }}</p>
      <pv-button style="margin-top: 0.5rem;margin-left: 30%" icon="pi pi-check" :label="$t('postDisplay.submitButton')" @click="submitOrder"></pv-button>
    </pv-dialog>
  </template>
  <template v-else>
    <p>{{ $t('postDisplay.loading') }}</p>
  </template>
</template>

<style scoped>

</style>
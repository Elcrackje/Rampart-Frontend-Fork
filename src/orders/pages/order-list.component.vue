<script>
import OrderCreateAndEditDialog from "../components/order-create-and-edit.component.vue";
import { OrderEntity } from "../model/order.entity.js";
import { OrderService } from "../services/order.service.js";
import DataManager from "../../shared/components/data-manager.component.vue";
import OrderFilter from "../components/order-filter.component.vue";
import {DishEntity} from "../../dishes/model/dish.entity.js";
import {DishService} from "../../dishes/services/dish.service.js";

export default {
  name: "order-list.component",
  components: {OrderFilter, DataManager, OrderCreateAndEditDialog },
  data() {
    return {
      title: { singular: "Order", plural: "Orders" },
      orders: [],
      order: new OrderEntity({}),
      dishes:[],
      dish: new DishEntity({}),
      selectedOrders: [],
      orderService: new OrderService(),
      dishService:new DishService(),
      createAndEditDialogIsVisible: false,
      isEdit: false,
      submitted: false,
      filteredOrders: [], // Nueva propiedad para almacenar las órdenes filtradas
      filters: {
        status: ""
      },
    };
  },
  methods: {

    findDishById(dishId) {
      console.log("Buscando platillo con ID:", dishId); // Verifica el ID que estamos buscando
      const dish = this.dishes.find(dish => dish.id === dishId);
      console.log("Platillo encontrado:", dish); // Verifica si el platillo se encuentra
      return dish;
    },
    //boton
    toggleDetails(order) {
      order.detailsShown = !order.detailsShown; // Cambia el estado solo de la orden específica
    },
    //metodo para las columnas
    getOrdersByStatus(status) {
      return this.filteredOrders.filter(order => order.status === status);
    },
    //metodos filter
    onFilterChanged(filters) {
      this.filters = filters;
      this.applyFilters();
    },
    applyFilters() {
      this.filteredOrders = this.orders.filter(order => {
        const matchesStatus = this.filters.status ? order.status === this.filters.status : true;
        const matchesOrderId = this.filters.orderId ? order.id.toString() === this.filters.orderId : true;

        // Convertir las fechas a objetos Date para comparación
        const orderDate = new Date(order.orderDate);
        const startDate = this.filters.startDate ? new Date(this.filters.startDate) : null;
        const endDate = this.filters.endDate ? new Date(this.filters.endDate) : null;
        const matchesDateRange = (!startDate || orderDate >= startDate) && (!endDate || orderDate <= endDate);

        return matchesStatus  && matchesOrderId && matchesDateRange;
      });
    },

    //metodos crud
    notifySuccessfulAction(message) {
      this.$toast.add({ severity: "success", summary: "Success", detail: message, life: 3000 });
    },
    findIndexById(id) {
      return this.orders.findIndex((order) => order.id === id);
    },
    // Metodo para abrir el diálogo para nueva orden
    async onNewItem() {
      this.order = new OrderEntity({});
      this.isEdit = false;
      this.createAndEditDialogIsVisible = true;
    },
    // Metodo para editar una orden
    async onEditItem(item) {
      this.order = new OrderEntity(item);
      this.isEdit = true;
      this.createAndEditDialogIsVisible = true;
    },
    // Metodo para eliminar una orden
    async onDeleteItem(item) {
      this.order = new OrderEntity(item);
      await this.deleteOrder();
    },
    //Metodo
    async onDeleteSelectedItems(selectedItems) {
      this.selectedOrders = selectedItems;
      await this.deleteSelectedOrders();
    },
    //Metodo
    onCancelRequested() {
      this.createAndEditDialogIsVisible = false;
      this.submitted = false;
      this.isEdit = false;
    },
    // Metodo para manejar el guardado de una orden
    async onSaveRequested(item) {
      this.submitted = true;
      if (item.id) {
        await this.updateOrder();
      } else {
        await this.createOrder();
      }
      this.createAndEditDialogIsVisible = false;
    },
    // Funciones para crear, actualizar y eliminar
    async createOrder() {
      try {
        const response = await this.orderService.create(this.order);
        this.orders.push(new OrderEntity(response.data));
        this.notifySuccessfulAction("G Order created successfully");
      } catch (error) {
        console.error("F Error creating Order:", error);
      }
    },
    async updateOrder() {
      try {
        const response = await this.orderService.update(this.order.id, this.order);
        const index = this.findIndexById(this.order.id);
        this.orders[index] = new OrderEntity(response.data);
        this.notifySuccessfulAction("G Order updated successfully");
      } catch (error) {
        console.error("F Error updating Order:", error);
      }
    },
    async deleteOrder() {
      try {
        await this.orderService.delete(this.order.id);
        const index = this.findIndexById(this.order.id);
        this.orders.splice(index, 1);
        this.notifySuccessfulAction("G Order deleted successfully");
      } catch (error) {
        console.error("F Error deleting Order:", error);
      }
    },
  },
  async created() {
    try {
      const response = await this.orderService.getAll();
      this.orders = response.data.map((order) => {
        return new OrderEntity(order);
      });

      const dishResponse = await this.dishService.getAll();
      this.dishes = dishResponse.data.map((dish) => {
        return new DishEntity(dish);
      });

      this.filteredOrders = this.orders; // Inicializa la lista filtrada

    } catch (error) {
      console.error("F Error fetching Orders:", error);
    }
  }



}
</script>

<template>
  <div class="title">
    <h3>{{$t("orders")}}</h3>
    <div class="main-container">
      <!-- Filtros de búsqueda -->

      <div class="filter-container">
        <h4>{{$t("filters")}}</h4>
        <order-filter @filter-changed="onFilterChanged" />
        <!--
        <pv-button @click="onNewItem" class="p-button-rounded p-button-success mb-4">
          {{$t("newOrder")}}
        </pv-button>
        -->
      </div>

      <!-- Distribuir órdenes en tres columnas según el estado -->
      <div class="p-container">
        <!-- Columna 1: Pendiente -->
        <div class="status-column">
          <h4>{{$t("pending")}}</h4>
          <div v-for="order in getOrdersByStatus('pendiente')" :key="order.id" class="cards">
            <pv-card>
              <template #header>
                <h2>{{$t("order")}} : #{{ order.id }}</h2>
              </template>
              <template #content>
                <p><strong>{{$t("customerId")}}:</strong> {{ order.customerId }}</p>
                <p><strong>{{$t("orderDate")}}:</strong> {{ order.orderDate }}</p>
                <p><strong>{{$t("deliveryDate")}}:</strong> {{ order.deliveryDate }}</p>
                <p><strong>{{$t("deliveryTime")}}:</strong> {{ order.deliveryTime }}</p>
                <p><strong>{{$t("paymentMethod")}}:</strong> {{ order.paymentMethod }}</p>

                <p><strong>{{$t("status")}}:</strong> {{ order.status }}</p>
                <!--
                <p><strong>Platillos:</strong></p>

                <div>
                  <button @click="toggleDetails(order)">
                    {{ order.detailsShown ? 'Hide' : 'Show' }} All Dishes Details
                  </button>
                  <ul v-if="order.detailsShown" style="">
                    <template v-if="findDishById(order.dishes)">
                      <li>
                        <p><strong>Nombre del platillo:</strong> {{ findDishById(order.dishes).nameOfDish }}</p>
                        <p><strong>ChefId:</strong> {{ findDishById(order.dishes).chefId }}</p>
                        <p><strong>Precio:</strong> ${{ findDishById(order.dishes).price }}</p>
                        <p><strong>Ingredientes:</strong></p>
                        <ul>
                          <li v-for="ingredient in findDishById(order.dishes).ingredients" :key="ingredient">
                            {{ ingredient }}
                          </li>
                        </ul>
                        <p><strong>Pasos de preparación:</strong></p>
                        <ul>
                          <li v-for="step in findDishById(order.dishes).preparationSteps" :key="step">
                            {{ step }}
                          </li>
                        </ul>
                      </li>
                    </template>
                  </ul>
                </div>
                -->

              </template>
              <template #footer>
                <pv-button @click="onEditItem(order)" class="p-button-rounded p-button-info">
                  {{$t("edit order")}}
                </pv-button>
                <pv-button @click="onDeleteItem(order)" class="p-button-rounded p-button-danger">
                  {{$t("cancel order")}}
                </pv-button>
              </template>
            </pv-card>
          </div>
        </div>

        <!-- Columna 2: En preparación -->
        <div class="status-column">
          <h4>{{$t("in preparation")}}</h4>
          <div v-for="order in getOrdersByStatus('en preparacion')" :key="order.id" class="cards">
            <pv-card>
              <template #header>
                <h2>{{$t("order")}} : #{{ order.id }}</h2>
              </template>
              <template #content>
                <p><strong>{{$t("customerId")}}:</strong> {{ order.customerId }}</p>
                <p><strong>{{$t("orderDate")}}:</strong> {{ order.orderDate }}</p>
                <p><strong>{{$t("deliveryDate")}}:</strong> {{ order.deliveryDate }}</p>
                <p><strong>{{$t("deliveryTime")}}:</strong> {{ order.deliveryTime }}</p>
                <p><strong>{{$t("paymentMethod")}}:</strong> {{ order.paymentMethod }}</p>

                <p><strong>{{$t("status")}}:</strong> {{ order.status }}</p>
                <!--
                <p><strong>Platillos:</strong></p>
                <div>
                  <button @click="toggleDetails(order)">
                    {{ order.detailsShown ? 'Hide' : 'Show' }} All Dishes Details
                  </button>
                  <ul v-if="order.detailsShown">
                    <template v-if="findDishById(order.dishes)">
                      <li>
                        <p><strong>Nombre del platillo:</strong> {{ findDishById(order.dishes).nameOfDish }}</p>
                        <p><strong>ChefId:</strong> {{ findDishById(order.dishes).chefId }}</p>
                        <p><strong>Precio:</strong> ${{ findDishById(order.dishes).price }}</p>
                        <p><strong>Ingredientes:</strong></p>
                        <ul>
                          <li v-for="ingredient in findDishById(order.dishes).ingredients" :key="ingredient">
                            {{ ingredient }}
                          </li>
                        </ul>
                        <p><strong>Pasos de preparación:</strong></p>
                        <ul>
                          <li v-for="step in findDishById(order.dishes).preparationSteps" :key="step">
                            {{ step }}
                          </li>
                        </ul>
                      </li>
                    </template>
                  </ul>
                </div>
                -->
              </template>
              <template #footer>
                <pv-button @click="onEditItem(order)" class="p-button-rounded p-button-info">
                  {{$t("edit order")}}
                </pv-button>
                <pv-button @click="onDeleteItem(order)" class="p-button-rounded p-button-danger">
                  {{$t("cancel order")}}
                </pv-button>
              </template>
            </pv-card>
          </div>
        </div>

        <!-- Columna 3: Completado -->
        <div class="status-column">
          <h4>{{$t("completed")}}</h4>
          <div v-for="order in getOrdersByStatus('completado')" :key="order.id" class="cards">
            <pv-card>
              <template #header>
                <h2>{{$t("order")}} : #{{ order.id }}</h2>
              </template>
              <template #content>
                <p><strong>{{$t("customerId")}}:</strong> {{ order.customerId }}</p>
                <p><strong>{{$t("orderDate")}}:</strong> {{ order.orderDate }}</p>
                <p><strong>{{$t("deliveryDate")}}:</strong> {{ order.deliveryDate }}</p>
                <p><strong>{{$t("deliveryTime")}}:</strong> {{ order.deliveryTime }}</p>
                <p><strong>{{$t("paymentMethod")}}:</strong> {{ order.paymentMethod }}</p>

                <p><strong>{{$t("status")}}:</strong> {{ order.status }}</p>
                <!--
                <p><strong>Platillos:</strong></p>

                <div>
                  <button @click="toggleDetails(order)">
                    {{ order.detailsShown ? 'Hide' : 'Show' }} All Dishes Details
                  </button>
                  <ul v-if="order.detailsShown">
                    <template v-if="findDishById(order.dishes)">
                      <li>
                        <p><strong>Nombre del platillo:</strong> {{ findDishById(order.dishes).nameOfDish }}</p>
                        <p><strong>ChefId:</strong> {{ findDishById(order.dishes).chefId }}</p>
                        <p><strong>Precio:</strong> ${{ findDishById(order.dishes).price }}</p>
                        <p><strong>Ingredientes:</strong></p>
                        <ul>
                          <li v-for="ingredient in findDishById(order.dishes).ingredients" :key="ingredient">
                            {{ ingredient }}
                          </li>
                        </ul>
                        <p><strong>Pasos de preparación:</strong></p>
                        <ul>
                          <li v-for="step in findDishById(order.dishes).preparationSteps" :key="step">
                            {{ step }}
                          </li>
                        </ul>
                      </li>
                    </template>
                  </ul>
                </div>
                -->
              </template>
              <template #footer>
                <pv-button @click="onEditItem(order)" class="p-button-rounded p-button-info">
                  {{$t("edit order")}}
                </pv-button>
                <pv-button @click="onDeleteItem(order)" class="p-button-rounded p-button-danger">
                  {{$t("cancel order")}}
                </pv-button>
              </template>
            </pv-card>
          </div>
        </div>
      </div>
    </div>


    <!-- Dialog para editar/crear una orden -->
    <order-create-and-edit-dialog
        :edit="isEdit"
        :item="order"
        :visible="createAndEditDialogIsVisible"
        v-on:cancel-requested="onCancelRequested"
        v-on:save-requested="onSaveRequested($event)"
    />
  </div>
</template>


<style scoped>
.main-container {
  display: flex; /* Flexbox para crear dos columnas: filtros y cards */
  justify-content: space-between; /* Mantiene las columnas separadas */
}

.filter-container {
  width: 25%; /* El ancho de los filtros a la izquierda */
  margin-right: 2rem; /* Espacio entre los filtros y las columnas de estado */
}

.p-container {
  width: 75%; /* El ancho de las columnas de cards a la derecha */
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Tres columnas, una por cada estado */
  gap: 20px;
}

.status-column {
  border: 1px solid #FFA500; /* Añadir estilo para cada columna */
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Sombra para un efecto de profundidad */
}

.cards {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .main-container {
    flex-direction: column; /* Coloca los filtros y cards uno debajo de otro en pantallas pequeñas */
  }
  .p-container {
    grid-template-columns: repeat(1, 1fr); /* Una columna en pantallas pequeñas */
  }
}

img{
  width: 100px;
}
.filter-container {
  width: 25%; /* El ancho de los filtros a la izquierda */
  margin-right: 2rem; /* Espacio entre los filtros y las columnas de estado */
  background-color: #f9f9f9; /* Color de fondo claro */
  border: 1px solid #e0e0e0; /* Bordes suaves */
  border-radius: 8px; /* Bordes redondeados */
  padding: 1rem; /* Espaciado interno */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Sombra para un efecto de profundidad */
  display: flex;
  flex-direction: column; /* Coloca los elementos en columna */
}

.filter-container h4 {
  margin-bottom: 0.5rem; /* Espacio debajo del título */
  font-size: 1.25rem; /* Tamaño de fuente del título */
  color: #333; /* Color del texto del título */
}
</style>

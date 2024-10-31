<script>


import OrderCreateAndEditDialog from "../components/order-create-and-edit.component.vue";
import DataManager from "../../../../FrontEnd/src/shared/components/data-manager.component.vue";
import {OrderEntity} from "../model/order.entity.js";
import {OrderService} from "../services/order.service.js";


export default {
  name: "order-list.component",
  components: {OrderCreateAndEditDialog, DataManager },
  data() {
    return {
      title: { singular: "Order", plural: "Orders" },
      orders: [],
      order: new OrderEntity({}),
      selectedOrders: [],
      orderService: new OrderService(),
      createAndEditDialogIsVisible: false,
      isEdit: false,
      submitted: false
    };
  },
  methods: {
    notifySuccessfulAction(message) {
      this.$toast.add({ severity: "success", summary: "Success", detail: message, life: 3000 });
    },
    findIndexById(id) {
      return this.orders.findIndex((order) => order.id === id);
    },

    async onNewItem() {
      this.order = new OrderEntity({});
      this.isEdit = false;
      this.createAndEditDialogIsVisible = true;
    },
    async onEditItem(item) {
      this.order = new OrderEntity(item);
      this.isEdit = true;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },
    //
    async onDeleteItem(item) {
      this.order = new OrderEntity(item);
      await this.deleteOrder();
    },
    async onDeleteSelectedItems(selectedItems) {
      this.selectedOrders = selectedItems;
      await this.deleteSelectedOrders();
    },
    onCancelRequested() {
      this.createAndEditDialogIsVisible = false;
      this.submitted = false;
      this.isEdit = false;
    },
    async onSaveRequested(item) {
      this.submitted = true;
      if (this.order.status.trim()) {
        if (item.id) {
          await this.updateOrder();
        } else {
          await this.createOrder();
        }
        this.createAndEditDialogIsVisible = false;
        this.isEdit = false;
      }
    },
    //
    async createOrder() {
      try {
        const response = await this.orderService.create(this.order);
        this.orders.push(new OrderEntity(response.data));
        this.notifySuccessfulAction("Order created successfully");
      } catch (error) {
        console.error("Error creating Order:", error);
      }
    },
    async updateOrder() {
      try {
        const response = await this.orderService.update(this.order.id, this.order);
        const index = this.findIndexById(this.order.id);
        this.orders[index] = new OrderEntity(response.data);
        this.notifySuccessfulAction("Order updated successfully");
      } catch (error) {
        console.error("Error updating Order:", error);
      }
    },
    async deleteOrder() {
      try {
        await this.orderService.delete(this.order.id);
        const index = this.findIndexById(this.order.id);
        this.orders.splice(index, 1);
        this.notifySuccessfulAction("Order deleted successfully");
      } catch (error) {
        console.error("Error deleting Order:", error);
      }
    },
    async deleteSelectedOrders() {
      try {
        for (const order of this.selectedOrders) {
          await this.orderService.delete(order.id);
          const index = this.findIndexById(order.id);
          if (index !== -1) {
            this.orders.splice(index, 1);
          }
        }
        this.notifySuccessfulAction("Selected Orders deleted successfully");
      } catch (error) {
        console.error("Error deleting selected Orders:", error);
      }
    }
  },
  async created() {
    try {
      const response = await this.orderService.getAll();
      this.orders = response.data.map((order) => new OrderEntity(order));
    } catch (error) {
      console.error("Error fetching Orders:", error);
    }
  }
}
</script>

<template>
  <div class="w-full template">
    <h3>Orders</h3>
    <data-manager
        :title = "title"
        v-bind:items="orders"
        v-on:new-item-requested="onNewItem"
        v-on:edit-item-requested="onEditItem($event)"
        v-on:delete-item-requested="onDeleteItem($event)"
        v-on:delete-selected-items-requested="onDeleteSelectedItems($event)"
    >
      <template #custom-columns>
        <pv-column :sortable="true" field="id" header="Id" style="min-width: 12rem" />
        <pv-column :sortable="true" field="customerId" header="CustomerId" style="min-width: 24rem" />
        <pv-column :sortable="true" field="orderDate" header="OrderDate" style="min-width: 24rem" />
        <pv-column :sortable="true" field="deliveryDate" header="DeliveryDate" style="min-width: 24rem" />
        <pv-column :sortable="true" field="paymentMethod" header="PaymentMethod" style="min-width: 24rem" />
        <pv-column :sortable="true" field="totalAmount" header="TotalAmount" style="min-width: 24rem" />
        <pv-column :sortable="true" field="status" header="Status" style="min-width: 24rem" />
      </template>
    </data-manager>
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
.template {
  position: relative;
  top: 80px;
}
</style>
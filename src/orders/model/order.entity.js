export class OrderEntity {
    constructor({id= "",customerId= "",orderDate= "",deliveryDate= "",paymentMethod= "",totalAmount= 0.0,status= ""}) {
        this.id = id;
        this.customerId = customerId;
        this.orderDate = orderDate;
        this.deliveryDate = deliveryDate;
        this.paymentMethod = paymentMethod;
        this.totalAmount = totalAmount;
        this.status = status;
    }
}
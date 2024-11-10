export class OrderEntity {
    constructor({id= "",customerId= "",orderDate= "",deliveryDate= "",deliveryTime= "",paymentMethod= "",totalAmount= 0.0,status= "", dishes = 0}) {
        this.id = id;
        this.customerId = customerId;
        this.orderDate = orderDate;
        this.deliveryDate = deliveryDate;
        this.deliveryTime = deliveryTime; // Agregamos el campo deliveryTime para almacenar la hora de entrega
        this.paymentMethod = paymentMethod;
        this.totalAmount = totalAmount;
        this.status = status;
        this.dishes = dishes;
        this.detailsShown = false;
    }


}
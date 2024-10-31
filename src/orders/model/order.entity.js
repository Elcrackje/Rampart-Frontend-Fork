export class OrderEntity {
    constructor({id= "",customerId= "",orderDate= "",deliveryDate= "",paymentMethod= "",totalAmount= 0.0,status= "", dishes = []}) {
        this.id = id;
        this.customerId = customerId;
        this.orderDate = orderDate;
        this.deliveryDate = deliveryDate;
        this.paymentMethod = paymentMethod;
        this.totalAmount = this.calculateTotalAmount(dishes);
        this.status = status;
        this.dishes = dishes; // Agregamos el campo dishes para almacenar los platillos seleccionados
        this.detailsShown = false;
    }
    calculateTotalAmount(dishes) {
        if (Array.isArray(dishes)) {
            return dishes.reduce((total, dish) => {
                return total + (dish.price * dish.quantity);
            }, 0);
        }
        return 0; // Retorna 0 si dishes no es un arreglo
    }

}
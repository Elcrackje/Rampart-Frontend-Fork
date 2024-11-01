export class UserProfile {
    constructor({
                    id = null,
                    photo = '',
                    name = '',
                    email = '',
                    birthDate = '',
                    address = '',
                    paymentMethod = '',
                    cardNumber = '',       // Número de tarjeta (si aplica)
                    yapeNumber = '',       // Número de Yape (si aplica)
                    cashPayment = false    // Pago en efectivo (booleano)
                }) {
        this.id = id;
        this.photo = photo;         // Foto del perfil
        this.name = name;           // Nombre del usuario
        this.email = email;         // Correo del usuario
        this.birthDate = birthDate; // Fecha de nacimiento
        this.address = address;     // Dirección
        this.paymentMethod = paymentMethod; // Método de pago
        this.cardNumber = cardNumber;       // Número de tarjeta de crédito
        this.yapeNumber = yapeNumber;       // Número para Yape
        this.cashPayment = cashPayment;     // Indica si paga en efectivo
    }
}

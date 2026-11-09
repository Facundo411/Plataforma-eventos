class TicketDTO {
    constructor(ticket) {
        this.id = ticket._id;
        this.user = ticket.user;
        this.event = ticket.event;
        this.status = ticket.status;
        this.quantity = ticket.quantity;
        this.reservationCode = ticket.reservationCode;
        this.createdAt = ticket.createdAt;
        this.cancelledAt = ticket.cancelledAt;
    }
}

export default TicketDTO;

import { randomUUID } from 'crypto'

export class Client {
    public readonly id: string;
    public name: string;
    public email: string | null;
    public phone: string | null;
    public externalId: string | null; // ID da academia, por exemplo
    public instructorId: string; // Chave estrangeira para Instructor
    public createdAt: Date;
    public updatedAt: Date;

    constructor(
        name: string,
        instructorId: string,
        email: string | null = null,
        phone: string | null = null,
        externalId: string | null = null,
        id?: string,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        this.id = id || randomUUID();
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.externalId = externalId;
        this.instructorId = instructorId;
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
    }
}

export default Client;
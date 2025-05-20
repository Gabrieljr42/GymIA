// src/app/entities/Instructor.ts
import { randomUUID } from 'crypto';

// No Prisma, a senha será armazenada com hash.
// Esta entidade é uma representação para a lógica da aplicação.
export class Instructor {
    public readonly id: string;
    public name: string;
    public email: string;
    public password?: string; // Senha em texto plano só existe antes do hash
    public avatar: string | null;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(
        name: string,
        email: string,
        password?: string, // Opcional no construtor, pois pode vir com hash ou ser para atualização sem senha
        avatar: string | null = null,
        id?: string,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        this.id = id || randomUUID();
        this.name = name;
        this.email = email;
        if (password) this.password = password;
        this.avatar = avatar;
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
    }
}

export default Instructor;
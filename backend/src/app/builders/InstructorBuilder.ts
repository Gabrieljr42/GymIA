
import { Instructor } from '../entities/Instructor';
import { randomUUID } from 'crypto'

export class InstructorBuilder {
    private _id?: string;
    private _name: string;
    private _email: string;
    private _password?: string;
    private _avatar: string | null;
    private _createdAt?: Date;
    private _updatedAt?: Date;

    constructor(
        id?: string,
        name: string = 'Instrutor Padrão',
        email: string = `instrutor${Date.now()}@padrao.com`, // Email padrão único
        password?: string,
        avatar: string | null = null
    ) {
        this._id = id;
        this._name = name;
        this._email = email;
        this._password = password;
        this._avatar = avatar;
    }

    get id(): string | undefined { return this._id; }
    setId(id: string): this { this._id = id; return this; }

    get name(): string { return this._name; }
    setName(name: string): this { this._name = name; return this; }

    get email(): string { return this._email; }
    setEmail(email: string): this { this._email = email; return this; }

    get password(): string | undefined { return this._password; }
    setPassword(password: string): this { this._password = password; return this; }

    get avatar(): string | null { return this._avatar; }
    setAvatar(avatar: string | null): this { this._avatar = avatar; return this; }

    get createdAt(): Date | undefined { return this._createdAt; }
    setCreatedAt(createdAt: Date): this { this._createdAt = createdAt; return this; }

    get updatedAt(): Date | undefined { return this._updatedAt; }
    setUpdatedAt(updatedAt: Date): this { this._updatedAt = updatedAt; return this; }

    reset(): this {
        this._id = undefined;
        this._name = 'Instrutor Padrão';
        this._email = `instrutor${Date.now()}@padrao.com`;
        this._password = undefined;
        this._avatar = null;
        this._createdAt = undefined;
        this._updatedAt = undefined;
        return this;
    }

    validate(): boolean {
        return !!(this._name && this._email && (this._id || this._password)); // Senha é obrigatória se não for um update/find com ID
    }

    build(): Instructor | null {
        if (!this.validate()) {
            console.error("Validação falhou para InstructorBuilder");
            return null;
        }

        return new Instructor(
            this._id || randomUUID(),
            this._name,
            this._email,
            this._password,
            this._avatar === null ? undefined : this._avatar,
            this._createdAt,
            this._updatedAt
        );}}
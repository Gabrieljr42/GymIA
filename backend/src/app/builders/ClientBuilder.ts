import { Client } from '../entities/Client';


export class ClientBuilder {
    private _id?: string;
    private _name: string;
    private _email: string | null;
    private _phone: string | null;
    private _externalId: string | null;
    private _instructorId!: string; // '\!' para indicar que será inicializado no construtor ou por um método obrigatório
    private _createdAt?: Date;
    private _updatedAt?: Date;

    constructor(
        id?: string,
        name: string = 'Aluno Padrão',
        email: string | null = `aluno${Date.now()}@padrao.com`,
        phone: string | null = null,
        externalId: string | null = null
        // instructorId não tem valor padrão aqui, deve ser definido explicitamente
    ) {
        this._id = id;
        this._name = name;
        this._email = email;
        this._phone = phone;
        this._externalId = externalId;
    }

    get id(): string | undefined { return this._id; }
    setId(id: string): this { this._id = id; return this; }

    get name(): string { return this._name; }
    setName(name: string): this { this._name = name; return this; }

    get email(): string | null { return this._email; }
    setEmail(email: string | null): this { this._email = email; return this; }

    get phone(): string | null { return this._phone; }
    setPhone(phone: string | null): this { this._phone = phone; return this; }

    get externalId(): string | null { return this._externalId; }
    setExternalId(externalId: string | null): this { this._externalId = externalId; return this; }

    get instructorId(): string { return this._instructorId; }
    setInstructorId(instructorId: string): this {
        this._instructorId = instructorId;
        return this;
    }

    get createdAt(): Date | undefined { return this._createdAt; }
    setCreatedAt(createdAt: Date): this { this._createdAt = createdAt; return this; }

    get updatedAt(): Date | undefined { return this._updatedAt; }
    setUpdatedAt(updatedAt: Date): this { this._updatedAt = updatedAt; return this; }

    reset(): this {
        this._id = undefined;
        this._name = 'Aluno Padrão';
        this._email = `aluno${Date.now()}@padrao.com`;
        this._phone = null;
        this._externalId = null;
        this._instructorId = ''; 
        this._createdAt = undefined;
        this._updatedAt = undefined;
        return this;
    }

    validate(): boolean {
        // Nome e instructorId são obrigatórios para criar um cliente
        return !!(this._name && this._instructorId);
    }

    build(): Client | null {
        if (!this.validate()) {
            console.error("Validação falhou para ClientBuilder: name e instructorId são obrigatórios.");
            return null;
        }

        const client = new Client(
            this._name,
            this._instructorId,
            this._email,
            this._phone,
            this._externalId,
            this._id
        );

        if (this._createdAt) (client as any).createdAt = this._createdAt;
        if (this._updatedAt) (client as any).updatedAt = this._updatedAt;

        return client;


    }
}

export default ClientBuilder;

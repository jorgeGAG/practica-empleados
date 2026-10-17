export interface Empleado {
    id?: string;
    _id?: string;
    nombre: string;
    cargo: string;
    departamento: string;
    sueldo: number;
    createdAt?: Date;
    updatedAt?: Date;
}
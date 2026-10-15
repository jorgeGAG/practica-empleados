export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    error?: unknown;
    timestamp?: string;
}

export interface Empleado {
    id?: string;
    _id?: string;
    nombre: string;
    cargo: string;
    departamento: string;
    sueldo: number;
    createdAt?: string;
    updatedAt?: string;
}
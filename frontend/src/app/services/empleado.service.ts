import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Empleado, ApiResponse } from '../models/empleado';

@Injectable({ providedIn: 'root' })
export class EmpleadoService {

    readonly URL_API = 'https://44.216.80.64/api/v1/empleados';

    // 1. BehaviorSubject privado para encapsular el estado reactivo
    private readonly _empleados$ = new BehaviorSubject<Empleado[]>([]);

    // 2. Flujo de solo lectura expuesto hacia los componentes
    public readonly empleados$: Observable<Empleado[]> = this._empleados$.asObservable();

    // Estado reactivo del empleado seleccionado en el formulario
    selectedEmpleado: Empleado = this.getInitialEmpleado();

    constructor(private http: HttpClient) {
        console.log('Servicio reactivo EmpleadoService inicializado');
    }

    // Acceso síncrono al estado actual para vistas o lógica interna
    get empleados(): Empleado[] {
        return this._empleados$.getValue();
    }

    private getInitialEmpleado(): Empleado {
        return {
            nombre: '',
            cargo: '',
            departamento: '',
            sueldo: 0
        };
    }

    resetSelectedEmpleado(): void {
        this.selectedEmpleado = this.getInitialEmpleado();
    }

    // Consulta reactiva: mapea la respuesta del backend y emite el nuevo estado
    getEmpleados(): Observable<Empleado[]> {
        return this.http.get<ApiResponse<Empleado[]> | Empleado[]>(this.URL_API).pipe(
            map((response) => {
                if (Array.isArray(response)) {
                    return response;
                }

                return (response && response.data) ? response.data : [];
            }),
            tap((empleados: Empleado[]) => {
                this._empleados$.next([...empleados]);
            })
        );
    }

    // Registro reactivo con mutación inmutable: [...current, nuevoEmpleado]
    createEmpleado(empleado: Empleado): Observable<Empleado> {
        return this.http.post<ApiResponse<Empleado> | Empleado>(this.URL_API, empleado).pipe(
            map((response) => {
                if (response && 'data' in response && response.data) {
                    return response.data;
                }

                return response as Empleado;
            }),
            tap((nuevoEmpleado: Empleado) => {
                const current = this._empleados$.getValue();
                // Patrón de mutación de referencias inmutables exigido por el reto
                this._empleados$.next([...current, nuevoEmpleado]);
            })
        );
    }

    // Actualización reactiva con mutación inmutable
    updateEmpleado(id: string, empleado: Partial<Empleado>): Observable<Empleado> {
        return this.http.put<ApiResponse<Empleado> | Empleado>(`${this.URL_API}/${id}`, empleado).pipe(
            map((response) => {
                if (response && 'data' in response && response.data) {
                    return response.data;
                }

                return response as Empleado;
            }),
            tap((actualizado: Empleado) => {
                const current = this._empleados$.getValue();
                // Mutación inmutable preservando la referencia del nuevo arreglo
                this._empleados$.next(
                    current.map((item) =>
                        (item.id === id || item._id === id) ? { ...item, ...actualizado } : item
                    )
                );
            })
        );
    }

    // Eliminación reactiva con mutación inmutable
    deleteEmpleado(id: string): Observable<void> {
        return this.http.delete<ApiResponse<null> | void>(`${this.URL_API}/${id}`).pipe(
            map(() => void 0),
            tap(() => {
                const current = this._empleados$.getValue();
                // Mutación inmutable mediante filtrado
                this._empleados$.next(
                    current.filter((item) => item.id !== id && item._id !== id)
                );
            })
        );
    }
}

// Alias para satisfacer explícitamente el nombre del servicio exigido en la guía
export { EmpleadoService as EmployeeService };

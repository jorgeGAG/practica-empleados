import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { EmpleadoService } from '../../services/empleado.service';
import { AuthService } from '../../services/auth.service';
import { Empleado } from '../../models/empleado';

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrl: './empleado.component.css'
})
export class EmpleadoComponent implements OnInit {

  // Smart Component (Orquestador): Expone el flujo reactivo para el async pipe
  public readonly empleados$: Observable<Empleado[]> = this.empleadoService.empleados$;

  // Estado del empleado que se está editando actualmente
  selectedEmpleado: Empleado | null = null;
  usuarioActual: any = null;

  constructor(
    private readonly empleadoService: EmpleadoService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.usuarioActual = this.authService.obtenerUsuario();

    // Inicia la carga de datos a través del servicio reactivo
    this.empleadoService.getEmpleados().subscribe({
      error: (err) => console.error('Error al cargar empleados:', err)
    });
  }

  onLogout(): void {
    this.authService.logout();
  }

  // Maneja el evento emitido por el Dumb Component del formulario
  onSaveEmpleado(empleado: Empleado): void {
    const id = empleado.id || empleado._id;

    if (id) {
      this.empleadoService.updateEmpleado(id, empleado).subscribe({
        next: () => {
          this.selectedEmpleado = null;
        },
        error: (err) => console.error('Error al actualizar empleado:', err)
      });
    } else {
      this.empleadoService.createEmpleado(empleado).subscribe({
        next: () => {
          this.selectedEmpleado = null;
        },
        error: (err) => console.error('Error al crear empleado:', err)
      });
    }
  }

  // Maneja el evento de edición emitido por el Dumb Component de la tabla
  onEditEmpleado(empleado: Empleado): void {
    this.selectedEmpleado = { ...empleado };
  }

  // Maneja el evento de eliminación emitido por el Dumb Component de la tabla
  onDeleteEmpleado(id: string): void {
    this.empleadoService.deleteEmpleado(id).subscribe({
      next: () => {
        if (this.selectedEmpleado && (this.selectedEmpleado.id === id || this.selectedEmpleado._id === id)) {
          this.selectedEmpleado = null;
        }
      },
      error: (err) => console.error('Error al eliminar empleado:', err)
    });
  }

  // Maneja la limpieza del formulario
  onResetForm(): void {
    this.selectedEmpleado = null;
  }
}

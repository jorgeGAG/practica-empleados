import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Empleado } from '../../models/empleado';

@Component({
  selector: 'app-empleado-table',
  templateUrl: './empleado-table.component.html',
  styleUrl: './empleado-table.component.css'
})
export class EmpleadoTableComponent {

  // Dumb Component: Recibe el listado de empleados exclusivamente por @Input()
  @Input() empleados: Empleado[] | null = [];

  // Dumb Component: Comunica eventos de acción hacia el componente Smart exclusivamente por @Output()
  @Output() edit = new EventEmitter<Empleado>();
  @Output() delete = new EventEmitter<string>();

  onEdit(empleado: Empleado): void {
    this.edit.emit(empleado);
  }

  onDelete(empleado: Empleado): void {
    const id = empleado.id || empleado._id;
    if (id && confirm(`¿Está seguro de eliminar a ${empleado.nombre}?`)) {
      this.delete.emit(id);
    }
  }
}

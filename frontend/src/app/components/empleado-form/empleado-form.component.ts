import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Empleado } from '../../models/empleado';

@Component({
  selector: 'app-empleado-form',
  templateUrl: './empleado-form.component.html',
  styleUrl: './empleado-form.component.css'
})
export class EmpleadoFormComponent implements OnChanges {

  @ViewChild('empleadoForm') empleadoForm?: NgForm;

  // Dumb Component: Recibe el empleado exclusivamente por @Input()
  @Input() empleado: Empleado | null = null;

  // Dumb Component: Comunica eventos hacia el componente Smart exclusivamente por @Output()
  @Output() save = new EventEmitter<Empleado>();
  @Output() reset = new EventEmitter<void>();

  // Modelo local del formulario para edición
  formData: Empleado = this.getInitialModel();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['empleado']) {
      if (this.empleado) {
        this.formData = { ...this.empleado };
      } else {
        this.resetInternalForm();
      }
    }
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    // Copia de los datos antes de limpiar el formulario
    const payload = { ...this.formData };

    // Limpia los campos del formulario y restablece el estado
    this.resetInternalForm(form);

    // Emite el valor del nuevo registro hacia el componente Smart
    this.save.emit(payload);
  }

  onReset(form?: NgForm): void {
    this.resetInternalForm(form);
    this.reset.emit();
  }

  private resetInternalForm(form?: NgForm): void {
    const targetForm = form ?? this.empleadoForm;
    if (targetForm) {
      targetForm.resetForm();
    }
    this.formData = this.getInitialModel();
  }

  private getInitialModel(): Empleado {
    return {
      nombre: '',
      cargo: '',
      departamento: '',
      sueldo: 0
    };
  }
}

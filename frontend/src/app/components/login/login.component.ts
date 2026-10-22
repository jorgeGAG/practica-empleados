import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  esModoRegistro: boolean = false;

  nombre: string = '';
  email: string = '';
  password: string = '';

  mensajeError: string = '';
  mensajeExito: string = '';
  cargando: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleModo(): void {
    this.esModoRegistro = !this.esModoRegistro;
    this.mensajeError = '';
    this.mensajeExito = '';
  }

  onSubmit(): void {
    this.mensajeError = '';
    this.mensajeExito = '';

    if (!this.email || !this.password) {
      this.mensajeError = 'Por favor complete todos los campos obligatorios';
      return;
    }

    if (this.esModoRegistro && !this.nombre) {
      this.mensajeError = 'Por favor ingrese su nombre para el registro';
      return;
    }

    this.cargando = true;

    if (this.esModoRegistro) {
      this.authService.registro({ nombre: this.nombre, email: this.email, password: this.password }).subscribe({
        next: (res) => {
          this.cargando = false;
          this.mensajeExito = '¡Registro exitoso! Redirigiendo...';
          setTimeout(() => {
            this.router.navigate(['/empleados']);
          }, 1000);
        },
        error: (err) => {
          this.cargando = false;
          this.mensajeError = err.error?.mensaje || 'Error al registrar usuario';
        }
      });
    } else {
      this.authService.login({ email: this.email, password: this.password }).subscribe({
        next: (res) => {
          this.cargando = false;
          this.mensajeExito = '¡Bienvenido! Redirigiendo al panel...';
          setTimeout(() => {
            this.router.navigate(['/empleados']);
          }, 800);
        },
        error: (err) => {
          this.cargando = false;
          this.mensajeError = err.error?.mensaje || 'Credenciales inválidas. Verifique sus datos.';
        }
      });
    }
  }
}

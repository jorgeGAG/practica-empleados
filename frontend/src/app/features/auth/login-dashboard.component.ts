import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login-dashboard',
  template: `
    <div class="auth-wrapper min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-sm-10 col-md-7 col-lg-5">
            <!-- Alerta de Errores Semánticos atrapados por el wrapper -->
            <div *ngIf="errorMessage" class="alert alert-danger py-2 shadow-sm d-flex align-items-center gap-2 rounded-3 mb-3 border-0">
              <i class="bi bi-exclamation-triangle-fill fs-5"></i>
              <div class="small fw-medium">{{ errorMessage }}</div>
            </div>

            <!-- Componente de Presentación Pura (Dumb) -->
            <app-login-form 
              [isLoading]="loading" 
              (submitLogin)="onExecuteLogin($event)">
            </app-login-form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      background: radial-gradient(circle at 10% 20%, rgb(239, 246, 255) 0%, rgb(248, 250, 252) 90%);
    }
  `]
})
export class LoginDashboardComponent {
  loading = false;
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onExecuteLogin(credentials: any): void {
    this.loading = true;
    this.errorMessage = null;

    this.authService.login(credentials).subscribe({
      next: () => {
        this.loading = false;
        // Redirección segura una vez guardado el token en localStorage
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        this.loading = false;
        // Captura el mensaje específico devuelto por el DTO de Zod o el controlador
        if (err.error) {
          if (Array.isArray(err.error.error) && err.error.error.length > 0) {
            // Error de validación perimetral Zod (ej. email inválido o password corto)
            this.errorMessage = err.error.error.map((e: any) => e.mensaje || e.message).join(' | ');
          } else if (err.error.error?.message) {
            this.errorMessage = err.error.error.message;
          } else if (err.error.message) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'Error de validación contractual (400 Bad Request)';
          }
        } else {
          this.errorMessage = err.message || 'Error de infraestructura al validar credenciales.';
        }
      }
    });
  }
}

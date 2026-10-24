import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginDashboardComponent } from './features/auth/login-dashboard.component';
import { EmpleadoComponent } from './components/empleado/empleado.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  // Ruta de Autenticación (Punto 4 de la guía)
  { path: 'auth', component: LoginDashboardComponent },
  { path: 'login', redirectTo: 'auth', pathMatch: 'full' },

  // Ruta del Módulo de Personal protegida mediante Guardián
  { path: 'employees', component: EmpleadoComponent, canActivate: [authGuard] },
  { path: 'empleados', redirectTo: 'employees', pathMatch: 'full' },

  // Redirecciones por defecto hacia /auth
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

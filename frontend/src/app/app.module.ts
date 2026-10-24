import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration
} from '@angular/platform-browser';

import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi
} from '@angular/common/http';

import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmpleadoComponent } from './components/empleado/empleado.component';
import { EmpleadoFormComponent } from './components/empleado-form/empleado-form.component';
import { EmpleadoTableComponent } from './components/empleado-table/empleado-table.component';
import { LoginComponent } from './components/login/login.component';
import { LoginDashboardComponent } from './features/auth/login-dashboard.component';
import { LoginFormComponent } from './features/auth/components/login-form/login-form.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    EmpleadoComponent,
    EmpleadoFormComponent,
    EmpleadoTableComponent,
    LoginComponent,
    LoginDashboardComponent,
    LoginFormComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],

  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],

  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}

import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {SchoolComponent} from "./pages/school/school.component";
import {TvComponent} from "./pages/tv/tv.component";
import {QrFormComponent} from "./pages/qr-form/qr-form.component";

export const routes: Routes = [
  { path: 'tv/:id', component: TvComponent },
  { path: 'qr-form/:id', component: QrFormComponent },
  { path: 'login', component: LoginComponent },
  { path: '',
    component: DashboardComponent,
    children : [
      {
        path : 'school',
        component : SchoolComponent
      }
    ]
  },




];

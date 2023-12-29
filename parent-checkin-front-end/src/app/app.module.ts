import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {routes} from "./app.routes";
import {AppComponent} from "./app.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {SidebarComponent} from "./layout/sidebar/sidebar.component";
import {HeaderComponent} from "./layout/header/header.component";
import {FooterComponent} from "./layout/footer/footer.component";
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
@NgModule({
  declarations : [
    AppComponent,
    DashboardComponent,
    SidebarComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports : [
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    RouterModule.forRoot(routes, {
      useHash: true
    }),
  ],
})

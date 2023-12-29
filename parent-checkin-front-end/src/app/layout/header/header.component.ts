import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../_services/auth.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(
              private router: Router
  ) {
  }


  sidebarState: string = '';

  toggle() {
    this.sidebarState = this.sidebarState === 'show-sidebar' ? 'hide-sidebar' : 'show-sidebar';
  }


  logout(){
    window.localStorage.removeItem('authToken')
    this.router.navigate(['/login']);
  }
}

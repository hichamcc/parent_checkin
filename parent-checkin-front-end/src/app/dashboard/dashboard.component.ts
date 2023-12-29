import {Component, OnInit} from '@angular/core';
import {SidebarComponent} from "../layout/sidebar/sidebar.component";
import {HeaderComponent} from "../layout/header/header.component";
import {FooterComponent} from "../layout/footer/footer.component";
import {Router, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent , HeaderComponent , FooterComponent , RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  constructor(
    private router: Router
  ) {
  }
ngOnInit() {
  if ( !window.localStorage.getItem('authToken')) {
    this.router.navigate(['/login']);
  }
}
}

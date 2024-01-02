import { Component  ,  OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ FormsModule,
    ReactiveFormsModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup;
  isAuthenticated = false;
  loginFailed : string = "";

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

  }

  ngOnInit() {

    if ( window.localStorage.getItem('authToken')) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    console.log("test");
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      this.authService.login(credentials).subscribe(
        (response) => {
          if(response){
            console.log('Login successful', response);
            window.localStorage.setItem('authToken','logged')
            this.router.navigate(['/']);
          }else {
            console.error('Login failed', response);
            this.loginFailed = "Login failed!";
          }


        },
        (error) => {
          console.error('Login failed', error);
          this.loginFailed = "Login failed!";
        }
      );
    } else {
      console.error('Login failed');
      this.loginFailed = "Login failed!";


    }
  }
}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent implements OnInit {


  authForm!: FormGroup;

  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.authForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

  }

  onLogin(): void {

    let username = this.authForm.get('username')?.value;
    let password = this.authForm.get('password')?.value;


    this.authService.login({ username: username, password: password }).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.router.navigate(['/topic']);
      },
      error: (error) => {
        console.error('Login failed', error);
      }
    });
  }
}

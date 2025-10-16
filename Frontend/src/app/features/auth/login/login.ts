import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  template: `
    <div class="flex items-center justify-center py-8">
      <mat-card class="w-full max-w-md p-6">
        <mat-card-header>
          <mat-card-title class="text-xl font-semibold">Login</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <mat-form-field appearance="fill">
            <mat-label>Username</mat-label>
            <input matInput formControlName="username" required>
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password" required>
          </mat-form-field>
          <button mat-raised-button color="primary" type="submit" [disabled]="loginForm.invalid" class="w-full bg-sky-600 text-white hover:bg-sky-700">Login</button>
        </form>
        <div class="register-actions" style="margin-top: 1rem;">
          <p class="text-sm text-gray-600 mb-2">Don't have an account? Register as:</p>
          <div style="display:flex; gap:8px; justify-content:space-between;">
            <button mat-stroked-button color="accent" (click)="goRegister('citizen')" class="px-3">Citizen</button>
            <button mat-stroked-button color="accent" (click)="goRegister('agent')" class="px-3">Agent</button>
            <button mat-stroked-button color="accent" (click)="goRegister('supervisor')" class="px-3">Supervisor</button>
          </div>
        </div>
      </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    mat-card { max-width: 400px; margin: 2rem auto; }
    form { display: flex; flex-direction: column; gap: 1rem; }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => console.error('Login failed', err)
      });
    }
  }

  goRegister(role: string) {
    this.router.navigate(['/register'], { queryParams: { role } });
  }
}

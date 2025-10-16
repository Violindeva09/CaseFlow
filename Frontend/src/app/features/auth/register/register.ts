import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatSnackBarModule
  ],
  template: `
    <div class="min-h-[60vh] flex items-center justify-center px-4">
      <div class="w-full max-w-md">
        <mat-card class="p-6">
          <h2 class="text-2xl font-semibold mb-4">Create account</h2>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <mat-form-field appearance="fill" class="w-3/4">
              <mat-label>Username</mat-label>
              <input matInput formControlName="username" required autocomplete="username">
            </mat-form-field>

            <mat-form-field appearance="fill" class="w-3/4">
              <mat-label>Name</mat-label>
              <input matInput formControlName="name" required autocomplete="name">
            </mat-form-field>

            <mat-form-field appearance="fill" class="w-3/4">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" required autocomplete="new-password">
            </mat-form-field>

            <mat-form-field appearance="fill" class="w-3/4">
              <mat-label>Role</mat-label>
              <mat-select formControlName="role" required>
                <mat-option value="citizen">Citizen</mat-option>
                <mat-option value="agent">Agent</mat-option>
                <mat-option value="supervisor">Supervisor</mat-option>
                <mat-option value="admin">Admin</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="fill" class="w-3/4" *ngIf="registerForm.get('role')?.value === 'agent'">
              <mat-label>Skills (comma separated)</mat-label>
              <input matInput formControlName="skills" placeholder="e.g. traffic, sanitation">
            </mat-form-field>

            <div *ngIf="skillError" class="text-sm text-red-600">Please provide at least one skill for agents.</div>

            <div class="flex items-center justify-between gap-2 mt-2">
              <button mat-stroked-button color="primary" type="button" (click)="router.navigate(['/login'])">Back to Login</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="registerForm.invalid">Register</button>
            </div>
          </form>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      mat-card { width: 100%; max-width: 600px; margin: 2rem auto; }
      form { display: flex; flex-direction: column; gap: 1rem; }
    `
  ]
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
  private fb: FormBuilder,
  private auth: AuthService,
  public router: Router,
  private route: ActivatedRoute
    , private snack: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      name: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
      skills: ['']
    });

    const roleFromQuery = this.route.snapshot.queryParamMap.get('role');
    if (roleFromQuery) {
      this.registerForm.get('role')?.setValue(roleFromQuery);
    }
  }

  onSubmit() {
    this.skillError = false;
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      if (formValue.skills) {
        if (Array.isArray(formValue.skills)) {
          formValue.skills = formValue.skills.map((s: string) => String(s).trim()).filter((s: string) => s.length);
        } else if (typeof formValue.skills === 'string') {
          formValue.skills = formValue.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s.length);
        } else {
          // unexpected type, coerce to empty
          formValue.skills = [];
        }
      }
      // If role is agent, ensure skills has at least one entry
      if (formValue.role === 'agent' && (!formValue.skills || formValue.skills.length === 0)) {
        this.skillError = true;
        return;
      }
      this.auth.register(formValue).subscribe({
        next: () => {
          this.snack.open('Registration successful, please login', 'Close', { duration: 3000 });
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Registration failed', err);
          this.snack.open('Registration failed: ' + (err?.error?.error || err?.message || 'Unknown'), 'Close', { duration: 5000 });
        }
      });
    }
  }

  skillError = false;
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CaseService } from '../../../core/case.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-case-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
    , MatSnackBarModule
  ],
  template: `
  <h2 class="text-xl font-semibold mb-2">Create New Case</h2>
  <form [formGroup]="caseForm" (ngSubmit)="onSubmit()" class="space-y-4">
      <mat-form-field appearance="fill">
        <mat-label>Title</mat-label>
        <input matInput formControlName="title" required autofocus>
        <mat-hint *ngIf="caseForm.get('title')?.invalid && caseForm.get('title')?.touched">Title is required</mat-hint>
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Description</mat-label>
        <textarea matInput formControlName="description"></textarea>
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Priority</mat-label>
        <mat-select formControlName="priority" required>
          <mat-option value="low">Low</mat-option>
          <mat-option value="medium">Medium</mat-option>
          <mat-option value="high">High</mat-option>
          <mat-option value="critical">Critical</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Tier</mat-label>
        <mat-select formControlName="tier" required>
          <mat-option value="standard">Standard</mat-option>
          <mat-option value="premium">Premium</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Topic</mat-label>
        <input matInput formControlName="topic">
      </mat-form-field>
      <div class="flex justify-end gap-3 mt-4">
        <button mat-button (click)="onCancel()" class="text-slate-600">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="caseForm.invalid" class="bg-emerald-600 text-white hover:bg-emerald-700">Create</button>
      </div>
      <div *ngIf="caseForm.invalid" style="color:rgba(0,0,0,0.6); margin-top:8px; font-size:0.9rem;">
        Please fill required fields (title, priority, tier) to enable Create.
      </div>
    </form>
  `,
  styles: [`
    form { display: flex; flex-direction: column; gap: 1rem; padding: 1rem; }
    .actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; }
  `]
})
export class CaseFormComponent {
  caseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private caseService: CaseService,
    private dialogRef: MatDialogRef<CaseFormComponent>,
    private snack: MatSnackBar
  ) {
    this.caseForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      priority: ['medium', Validators.required],
      tier: ['standard', Validators.required],
      topic: ['']
    });
  }

  onSubmit() {
    if (this.caseForm.valid) {
      const payload = this.caseForm.value;
      console.log('Creating case payload:', payload);
      this.caseService.createCase(payload).subscribe({
        next: (result) => {
          this.snack.open('Case created', 'Close', { duration: 3000 });
          this.dialogRef.close(result);
        },
        error: (err) => {
          console.error('Failed to create case', err);
          const msg = err?.error?.error || err?.message || 'Failed to create case';
          this.snack.open(`Error: ${msg}`, 'Close', { duration: 5000 });
        }
      });
    }
    else {
      // Make validation visible
      this.caseForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}

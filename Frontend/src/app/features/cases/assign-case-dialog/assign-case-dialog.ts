import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-assign-case-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  template: `
    <h2 mat-dialog-title>Assign Case</h2>
    <mat-dialog-content>
      <p>Select an agent to assign this case to:</p>
      <mat-form-field appearance="fill" class="w-full">
        <mat-label>Agent</mat-label>
        <mat-select [(ngModel)]="selectedAgentId">
          <mat-option *ngFor="let agent of agents" [value]="agent._id">
            {{ agent.name }} ({{ agent.username }}) - Workload: {{ agent.workload || 0 }}/{{ agent.capacity || 5 }}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onAssign()" [disabled]="!selectedAgentId">Assign</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-form-field { width: 100%; }
  `]
})
export class AssignCaseDialogComponent {
  selectedAgentId: string = '';

  constructor(
    public dialogRef: MatDialogRef<AssignCaseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { agents: User[] }
  ) {}

  get agents(): User[] {
    return this.data.agents;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onAssign(): void {
    this.dialogRef.close(this.selectedAgentId);
  }
}

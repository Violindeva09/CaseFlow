import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CaseService } from '../../../core/case.service';
import { AuthService } from '../../../core/auth.service';
import { Case } from '../../../shared/models/case.model';
import { CaseFormComponent } from '../case-form/case-form';
import { AssignCaseDialogComponent } from '../assign-case-dialog/assign-case-dialog';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-case-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="case-list app-shell">
      <div class="bg-white rounded-lg p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-semibold text-slate-800">Cases</h2>
          <button mat-raised-button color="primary" class="bg-sky-600 text-white hover:bg-sky-700" (click)="openCaseForm()" [disabled]="!isLoggedIn()">Create Case</button>
        </div>
        <div class="overflow-x-auto">
          <table mat-table [dataSource]="cases" class="min-w-full">
        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef>Title</th>
          <td mat-cell *matCellDef="let case">{{ case.title }}</td>
        </ng-container>
        <ng-container matColumnDef="priority">
          <th mat-header-cell *matHeaderCellDef>Priority</th>
          <td mat-cell *matCellDef="let case">
            <mat-chip [color]="getPriorityColor(case.priority)" selected>{{ case.priority }}</mat-chip>
          </td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let case">{{ case.status }}</td>
        </ng-container>
        <ng-container matColumnDef="assignedTo">
          <th mat-header-cell *matHeaderCellDef>Assigned To</th>
          <td mat-cell *matCellDef="let case">{{ case.assignedTo?.name || 'Unassigned' }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let case">
            <button mat-icon-button (click)="assignCase(case)" *ngIf="!case.assignedTo && canAssign()">
              <mat-icon>assignment</mat-icon>
            </button>
            <button mat-icon-button (click)="escalateCase(case)" *ngIf="case.status !== 'escalated' && canEscalate()">
              <mat-icon>arrow_upward</mat-icon>
            </button>
            <button mat-icon-button (click)="resolveCase(case)" *ngIf="case.status !== 'resolved' && canResolve()">
              <mat-icon>check_circle</mat-icon>
            </button>
          </td>
        </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .case-list { padding: 2rem; }
    table { width: 100%; margin-top: 1rem; }
  `]
})
export class CaseListComponent implements OnInit {
  cases: Case[] = [];
  displayedColumns: string[] = ['title', 'priority', 'status', 'assignedTo', 'actions'];
  currentUser: User | null = null;

  constructor(
    private caseService: CaseService,
    private dialog: MatDialog,
    private auth: AuthService
    , private snack: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadCases();
    this.auth.getCurrentUser().subscribe(user => this.currentUser = user);
  }

  loadCases() {
    this.caseService.getCases().subscribe(cases => this.cases = cases);
  }

  openCaseForm() {
    const dialogRef = this.dialog.open(CaseFormComponent, {
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadCases();
    });
  }

  isLoggedIn() {
    return this.auth.isLoggedIn();
  }

  assignCase(caseItem: Case) {
    this.auth.getAgents().subscribe((agents: any) => {
      const dialogRef = this.dialog.open(AssignCaseDialogComponent, {
        width: '400px',
        data: { agents }
      });
      dialogRef.afterClosed().subscribe(selectedAgentId => {
        if (selectedAgentId) {
          this.caseService.assignCase(caseItem._id, selectedAgentId).subscribe({
            next: () => { this.snack.open('Case assigned', 'Close', { duration: 3000 }); this.loadCases(); },
            error: (err) => { this.snack.open('Assign failed', 'Close', { duration: 5000 }); console.error(err); }
          });
        }
      });
    }, (err) => { this.snack.open('Failed to load agents', 'Close', { duration: 5000 }); console.error(err); });
  }

  escalateCase(caseItem: Case) {
    if (!window.confirm('Escalate this case?')) return;
    this.caseService.escalateCase(caseItem._id).subscribe({
      next: () => { this.snack.open('Case escalated', 'Close', { duration: 3000 }); this.loadCases(); },
      error: (err) => { this.snack.open('Escalate failed', 'Close', { duration: 5000 }); console.error(err); }
    });
  }

  resolveCase(caseItem: Case) {
    if (!window.confirm('Mark this case as resolved?')) return;
    this.caseService.resolveCase(caseItem._id).subscribe({
      next: () => { this.snack.open('Case resolved', 'Close', { duration: 3000 }); this.loadCases(); },
      error: (err) => { this.snack.open('Resolve failed', 'Close', { duration: 5000 }); console.error(err); }
    });
  }

  canAssign(): boolean {
    return !!this.currentUser && (this.currentUser.role === 'admin' || this.currentUser.role === 'supervisor');
  }

  canEscalate(): boolean {
    return !!this.currentUser && (this.currentUser.role === 'supervisor' || this.currentUser.role === 'citizen');
  }

  canResolve(): boolean {
    return !!this.currentUser && this.currentUser.role === 'agent';
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'critical': return 'warn';
      case 'high': return 'accent';
      default: return 'primary';
    }
  }
}

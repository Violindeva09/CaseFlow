import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../core/auth.service';
import { CaseService } from '../../core/case.service';
import { NotificationService } from '../../core/notification.service';
import { User } from '../../shared/models/user.model';
import { Case } from '../../shared/models/case.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule
  ],
  template: `
    <div class="dashboard">
      <h1>Welcome, {{ user?.username }}</h1>

      <div class="stats">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Total Cases</mat-card-title>
          </mat-card-header>
          <mat-card-content>{{ cases.length }}</mat-card-content>
        </mat-card>
        <mat-card>
          <mat-card-header>
            <mat-card-title>Open Cases</mat-card-title>
          </mat-card-header>
          <mat-card-content>{{ getOpenCasesCount() }}</mat-card-content>
        </mat-card>
        <mat-card>
          <mat-card-header>
            <mat-card-title>Assigned Cases</mat-card-title>
          </mat-card-header>
          <mat-card-content>{{ getAssignedCasesCount() }}</mat-card-content>
        </mat-card>
      </div>

      <mat-card>
        <mat-card-header>
          <mat-card-title>Recent Cases</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="cases.slice(0, 5)" class="mat-elevation-z8">
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
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard { padding: 2rem; }
    .stats { display: flex; gap: 1rem; margin-bottom: 2rem; }
    mat-card { margin-bottom: 1rem; }
    table { width: 100%; }
  `]
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  cases: Case[] = [];
  displayedColumns: string[] = ['title', 'priority', 'status'];

  constructor(
    private auth: AuthService,
    private caseService: CaseService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.auth.getCurrentUser().subscribe(user => this.user = user);
    this.loadCases();
    this.notificationService.getNotifications().subscribe(notification => {
      console.log('Notification:', notification);
      this.loadCases(); // Refresh cases on notification
    });
  }

  loadCases() {
    this.caseService.getCases().subscribe(cases => this.cases = cases);
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'critical': return 'warn';
      case 'high': return 'accent';
      default: return 'primary';
    }
  }

  getOpenCasesCount(): number {
    return (this.cases || []).filter(c => c.status === 'open').length;
  }

  getAssignedCasesCount(): number {
    return (this.cases || []).filter(c => c.status === 'assigned').length;
  }
}

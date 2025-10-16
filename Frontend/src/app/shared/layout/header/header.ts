import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="header-container relative">
      <mat-toolbar class="w-full bg-white rounded-md p-4 flex items-center shadow-sm">
        <div class="flex items-center gap-4">
          <span class="caseflow-logo font-bold text-slate-800">CaseFlow</span>
          <span class="text-sm text-slate-500"> Manage your cases effortlessly</span>
        </div>
      </mat-toolbar>
      <div *ngIf="user" class="absolute top-4 right-4 flex items-center gap-3 bg-white px-3 py-2 rounded-md shadow-sm">
        <span class="text-sm text-slate-700">{{ user.username }}</span>
        <button mat-icon-button (click)="logout()" aria-label="Logout">
          <mat-icon>logout</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .spacer { flex: 1 1 auto; }
    button[aria-label="Logout"] mat-icon {
      color: #000;
    }
    .caseflow-logo {
      font-size: 50px;
    }
  `]
})
export class HeaderComponent {
  user: User | null = null;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    this.auth.getCurrentUser().subscribe(user => this.user = user);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    RouterModule
  ],
  outputs: ['toggle'],
  template: `
    <button mat-icon-button class="toggle-btn" (click)="toggleSidebar()">
      <mat-icon>{{ isCollapsed ? 'chevron_right' : 'chevron_left' }}</mat-icon>
    </button>
    <mat-nav-list>
      <a mat-list-item routerLink="/dashboard">
        <mat-icon matListIcon>dashboard</mat-icon>
        <span matLine class="nav-item-text">Dashboard</span>
      </a>
      <a mat-list-item routerLink="/cases" *ngIf="user?.role !== 'citizen'">
        <mat-icon matListIcon>list</mat-icon>
        <span matLine class="nav-item-text">Cases</span>
      </a>
      <a mat-list-item routerLink="/cases" *ngIf="user?.role === 'citizen'">
        <mat-icon matListIcon>list</mat-icon>
        <span matLine class="nav-item-text">My Cases</span>
      </a>
      <a mat-list-item routerLink="/analytics" *ngIf="user?.role === 'admin'">
        <mat-icon matListIcon>analytics</mat-icon>
        <span matLine class="nav-item-text">Analytics</span>
      </a>
    </mat-nav-list>
  `,
  styles: [`
    :host {
      width: 250px;
      background-color: #f8f9fa;
      height: 100vh;
      border-right: 1px solid #e0e0e0;
      transition: width 0.3s ease;
    }
    :host.collapsed {
      width: 60px;
    }
    mat-nav-list { padding-top: 3rem; }
    .nav-item-text {
      transition: opacity 0.3s ease;
    }
    :host.collapsed .nav-item-text {
      opacity: 0;
    }
    .toggle-btn {
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 10;
    }
    .toggle-btn mat-icon {
      color: #333;
    }
    mat-nav-list mat-icon {
      color: #000;
    }
  `]
})
export class SidebarComponent {
  user: User | null = null;
  isCollapsed = false;
  @Output() toggle = new EventEmitter<boolean>();

  constructor(private auth: AuthService) {
    this.auth.getCurrentUser().subscribe(user => this.user = user);
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.toggle.emit(this.isCollapsed);
  }
}

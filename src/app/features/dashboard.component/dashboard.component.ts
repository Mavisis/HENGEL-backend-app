// ===============================================
// FILE: src/app/features/dashboard/dashboard.component.ts
// ===============================================
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  
  user: any = null;
  currentTime = new Date();

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    
    // Update time every second
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  logout(): void {
    this.authService.logout();
  }
}
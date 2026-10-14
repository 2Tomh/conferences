import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-admin-statistics',
  templateUrl: './admin-statistics.component.html',
  styleUrls: ['./admin-statistics.component.css']
})
export class AdminStatisticsComponent implements OnInit, AfterViewInit {
  stats: any = null;
  isLoading = true;
  error = '';

  totalRaisedILS = 0;
  totalRaisedUSD = 0;
  tier150Count = 0;
  tier750Count = 0;
  tier50UsdCount = 0;
  tier250UsdCount = 0;

  searchText = '';

  constructor(private apiService: ApiService) { }

  // ⭐ שינוי: בקשה אחת בלבד.
  // קודם העמוד הוריד גם את רשימת הכנסים וגם את כל הנרשמים (כולל טקסטי האבסטרקט, כמה MB)
  // רק כדי לחשב סכומים. עכשיו השרת מחשב את הסכומים ומחזיר אותם יחד עם הסטטיסטיקה.
  ngOnInit(): void {
    this.apiService.getStatistics().subscribe({
      next: (data) => {
        this.stats = data;
        this.totalRaisedILS = data?.TotalRaisedILS ?? 0;
        this.totalRaisedUSD = data?.TotalRaisedUSD ?? 0;
        this.tier150Count = data?.Tier150Count ?? 0;
        this.tier750Count = data?.Tier750Count ?? 0;
        this.tier50UsdCount = data?.Tier50UsdCount ?? 0;
        this.tier250UsdCount = data?.Tier250UsdCount ?? 0;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('שגיאה בטעינת סטטיסטיקות:', err);
        this.error = 'לא ניתן לטעון את הנתונים כרגע';
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit(): void { }

  getAbstractCountFor(conferenceName: string): number {
    const match = this.stats?.AbstractsByConference?.find((a: any) => a.ConferenceName === conferenceName);
    return match ? match.Count : 0;
  }

  get filteredConferences(): any[] {
    const list = this.stats?.RegistrationsByConference || [];
    const term = this.searchText.trim().toLowerCase();
    if (!term) return list;
    return list.filter((conf: any) => (conf.ConferenceName || '').toLowerCase().includes(term));
  }

  // ⭐ שונה: מייצא רק פירוט לפי כנס - שם, מספר נרשמים, מספר הגשות תקציר
  // (הוסרו הסיכום הכספי והפילוח לפי תעריף)
  exportStatsToCSV(): void {
    if (!this.stats) {
      alert('אין נתונים לייצוא');
      return;
    }

    const lines: string[] = [];

    lines.push('שם הכנס,נרשמים,הגשות תקציר');
    const allConferences = this.stats.RegistrationsByConference || [];
    allConferences.forEach((conf: any) => {
      const name = String(conf.ConferenceName || '').replace(/"/g, '""');
      const abstractCount = this.getAbstractCountFor(conf.ConferenceName);
      lines.push(`"${name}",${conf.Count},${abstractCount}`);
    });

    const csvContent = '﻿' + lines.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'conference-statistics.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service'; // וודא שהנתיב נכון
@Injectable({
  providedIn: 'root'
})
export class ConferenceEventsService {

  constructor(private apiService: ApiService) { }
  getSurveys(): Observable<any[]> {
    return this.apiService.getSurveys();
  }
}

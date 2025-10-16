import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Case } from '../shared/models/case.model';

@Injectable({ providedIn: 'root' })
export class CaseService {
  constructor(private api: ApiService) {}

  createCase(caseData: Partial<Case>): Observable<any> {
    console.log('CaseService.createCase', caseData);
    return this.api.post('cases', caseData);
  }

  getCases(): Observable<any> {
    return this.api.get('cases');
  }

  updateCase(id: string, updates: Partial<Case>): Observable<any> {
    return this.api.patch(`cases/${id}`, updates);
  }

  assignCase(caseId: string, agentId: string): Observable<any> {
    return this.api.put(`cases/${caseId}/assign`, { agentId });
  }

  escalateCase(caseId: string): Observable<any> {
    return this.api.put(`cases/${caseId}/escalate`, {});
  }

  resolveCase(caseId: string): Observable<any> {
    return this.api.put(`cases/${caseId}/resolve`, {});
  }
}

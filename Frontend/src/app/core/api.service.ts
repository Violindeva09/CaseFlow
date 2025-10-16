import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  base = environment.apiUrl;
  constructor(private http: HttpClient) {}
  post(path: string, body: any) {
    const token = localStorage.getItem('caseflow_token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.post(`${this.base}/${path}`, body, headers ? { headers } : undefined);
  }
  get(path: string) {
    const token = localStorage.getItem('caseflow_token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.get(`${this.base}/${path}`, headers ? { headers } : undefined);
  }
  patch(path: string, body: any) {
    const token = localStorage.getItem('caseflow_token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.patch(`${this.base}/${path}`, body, headers ? { headers } : undefined);
  }
  put(path: string, body: any) {
    const token = localStorage.getItem('caseflow_token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.put(`${this.base}/${path}`, body, headers ? { headers } : undefined);
  }
}

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private socket: Socket;
  private notifications$ = new Subject<any>();

  constructor() {
    this.socket = io(environment.apiUrl.replace('/api', ''));
    this.socket.on('notification', (data) => {
      this.notifications$.next(data);
    });
  }

  getNotifications(): Observable<any> {
    return this.notifications$.asObservable();
  }

  disconnect() {
    this.socket.disconnect();
  }
}

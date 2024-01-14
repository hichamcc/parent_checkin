import { Injectable } from '@angular/core';
import { io , Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.endpoint); // Replace with your server URL
  }

  public listen(event: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(event, (data: any) => {
        observer.next(data);
      });
    });
  }

  public emit(event: string, data: any): void {
    this.socket.emit(event, data);
  }
}

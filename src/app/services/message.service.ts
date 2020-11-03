import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { Socket } from 'ngx-socket-io';
// import { EMPTY, Observable, Subject, timer } from 'rxjs';
// import { catchError, delayWhen, retryWhen, switchAll, tap } from 'rxjs/operators';
// import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

// export const WS_ENDPOINT = 'wss://1wn0vx0tva.execute-api.us-east-1.amazonaws.com/prod';
// export const RECONNECT_INTERVAL = 2000;

@Injectable({
  providedIn: 'root'
})

export class MessageService {
  ws:WebSocket

  constructor() {}

  connectWS(url:string ):Observable<any>{
    this.ws = new WebSocket(url);
    return new Observable<any>(
      observable =>{
        this.ws.onmessage = (event)=> observable.next(event.data);
        this.ws.onerror = (event)=>observable.error(event);
        this.ws.onclose = (event)=>observable.complete();
      }
    )
  }
  sendMessage(message:string){
    console.log(message);
    this.ws.send(message);
  }
}

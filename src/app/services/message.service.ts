import { Injectable } from '@angular/core';
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
  // private socket$: WebSocketSubject<any>;
  // private messagesSubject$ = new Subject();
  // public messages$ = this.messagesSubject$.pipe(switchAll(), catchError(e => { throw e }));
 
  // constructor() {}

  // public connect(cfg: { reconnect: boolean } = { reconnect: false }): void {
  //   console.log(this.socket$);
  //   if (!this.socket$ || this.socket$.closed) {
  //     this.socket$ = this.getNewWebSocket();
  //     const messages = this.socket$.pipe(cfg.reconnect ? this.reconnect : o => o,
  //       tap({
  //         error: error => console.log(error),
  //       }), 
  //       catchError(_ => EMPTY)
  //     );
  //     this.messagesSubject$.next(messages);
  //   }
  // }
 
  // private reconnect(observable: Observable<any>): Observable<any> {
  //   return observable.pipe(
  //     retryWhen(errors => errors.pipe(
  //       tap(val => console.log('Try to reconnect', val)), 
  //       delayWhen(_ => timer(RECONNECT_INTERVAL))
  //       )
  //     )
  //   ); 
  // }

  // private getNewWebSocket() {
  //   console.log("entro a conectarse");
  //   return webSocket({
  //     url: WS_ENDPOINT,
  //     openObserver: {
  //       next: () => {
  //         console.log('connection ok');
  //       }
  //     },
  //     closeObserver: {
  //       next: () => {
  //         console.log('connection closed');
  //         this.socket$ = undefined;
  //         this.connect({ reconnect: true });
  //       }
  //     },
  //   });
  // }

  // sendMessage(msg: any) {
  //   this.socket$.next(msg);
  // }

  // public close() {
  //   this.socket$.complete();
  //   this.socket$ = undefined;
  // }
  // constructor(private socket: Socket) { }

  // sendMsg(message){
  //   console.log("entro aca");
  //   this.socket.emit('sendMessage', message);
  // }

  // receiveMsg(){
  //   return this.socket.fromEvent('sendMessage');
  // }

  // getUsers(){
  //   return this.socket.fromEvent('users');
  // }
}

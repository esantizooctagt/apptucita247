import { Injectable } from '@angular/core';
import { EMPTY, Observable, Subject, timer } from 'rxjs';
import { catchError, delayWhen, retryWhen, switchAll, tap } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { GlobalService } from './global.service';

// export const WS_ENDPOINT = 'wss://1wn0vx0tva.execute-api.us-east-1.amazonaws.com/prod?customerId=';
export const RECONNECT_INTERVAL = 3000;

@Injectable({
  providedIn: 'root'
})

export class MessageService {
  private customerId: string = '';
  private Customer: any;
  private socket$: WebSocketSubject<any>;
  private messagesSubject$ = new Subject();
  public messages$ = this.messagesSubject$.pipe(switchAll(), catchError(e => { throw e }));
  private WS_ENDPOINT: string = 'wss://z9m2csbl4j.execute-api.us-east-1.amazonaws.com/prod?customerId=';
 
  constructor(
    public global: GlobalService
  ) {
    this.Customer = this.global.Customer;
    this.customerId = this.Customer.CustomerId;
    if (this.global.EnvApp == 0) {
      this.WS_ENDPOINT = 'wss://z9m2csbl4j.execute-api.us-east-1.amazonaws.com/prod?customerId=';
    } else {
      this.WS_ENDPOINT = 'wss://k93m5dsm4c.execute-api.us-east-1.amazonaws.com/prod?customerId=';
    }
  }
  
  public connect(cfg: { reconnect: boolean } = { reconnect: false }): void {
    console.log("method connect");
    console.log(this.socket$);
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getNewWebSocket();
      console.log("connect after validate");
      const messages = this.socket$.pipe(cfg.reconnect ? this.reconnect : o => o,
        tap({
          error: error => console.log(error),
        }), 
        catchError(_ => EMPTY)
      );
      this.messagesSubject$.next(messages);
    }
  }
 
  private reconnect(observable: Observable<any>): Observable<any> {
    console.log("method re-connect");
    return observable.pipe(
      retryWhen(errors => errors.pipe(
        tap(val => console.log('Try to reconnect', val)), 
        delayWhen(_ => timer(RECONNECT_INTERVAL))
        )
      )
    ); 
  }

  private getNewWebSocket() {
    console.log(this.WS_ENDPOINT+this.customerId);
    return webSocket({
      url: this.WS_ENDPOINT+this.customerId,
      openObserver: {
        next: () => {
          console.log('connection ok');
        }
      },
      closeObserver: {
        next: () => {
          console.log('connection closed');
          this.socket$ = undefined;
          this.connect({ reconnect: true });
        }
      },
    });
  }

  sendMessage(msg: any) {
    this.socket$.next(msg);
  }

  public close() {
    this.socket$.complete();
    this.socket$ = undefined;
  }
}

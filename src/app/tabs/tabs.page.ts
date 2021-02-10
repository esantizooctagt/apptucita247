import { Component, OnInit } from '@angular/core';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { catchError, map, tap } from 'rxjs/operators';
import { GlobalService } from '../services/global.service';
import { MessageService } from '../services/message.service';
import { MonitorService } from '../services/monitor.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})

export class TabsPage implements OnInit {
  Customer: any;
  messages: number = 0;

  runWS$ = this.backgroundMode.on("activate").pipe(
    map(_ => {
      this.ws.setWebSocket(0);
      this.ws.connect();
    })
  );

  result$ = this.ws.messages$.pipe(
    map((res: any) => {
      console.log(res);
      if (res.Tipo == 'MESS'){
        this.messages = 1;
      }
      this.monitorService.syncData(res);
    }),
    catchError(error => { throw error }),
    tap({
      error: error => console.log('[Live Table component] Error:', error),
      complete: () => console.log('[Live Table component] Connection Closed')
    })
  );

  constructor(
    public global: GlobalService,
    private ws: MessageService,
    public backgroundMode : BackgroundMode,
    private monitorService: MonitorService
  ) {}

  ngOnInit(){
  }

  ionViewWillEnter(){
    this.Customer = this.global.Customer;
    // this.backgroundMode.enable();
    this.ws.setWebSocket(0);
    this.ws.connect();
  }
}

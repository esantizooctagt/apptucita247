import { Component, OnInit } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { GlobalService } from '../services/global.service';
import { MessageService } from '../services/message.service';
import { MonitorService } from '../services/monitor.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})

export class TabsPage implements OnInit {
  Customer: any;
  messages: number = 0;
  result$ = this.ws.messages$.pipe(
    map((res: any) => {
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
    private monitorService: MonitorService
  ) {}

  ngOnInit(){
  }

  ionViewWillEnter(){
    this.Customer = this.global.Customer;
    this.ws.connect();
  }
}

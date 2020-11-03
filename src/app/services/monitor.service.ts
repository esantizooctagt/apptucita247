import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MonitorService {
  private syncSource = new BehaviorSubject<any>(null);

  syncMessage = this.syncSource.asObservable();

  constructor() { }

  syncData(message: any){
    this.syncSource.next(message);
  }
}

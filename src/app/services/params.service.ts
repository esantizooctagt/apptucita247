import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParamsService {
  objParam: any;
  constructor() { }

  public setParams(data){
    this.objParam = data;
  }

  public getParams(){
    return this.objParam;
  }
}

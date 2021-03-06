import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, retry, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  RemoteVersionStatus;
  LocalVersion = 129;
  NewSession;
  ApiURL = 'https://apimob.tucita247.com/';
  BucketPath = 'https://tucita247.s3.amazonaws.com';

  Customer: any;
  Language: string;
  PlayerId: string;
  VerifcationCode: any;
  AdmPhones: any[]=[];
  PhoneNumber: any;
  EnvApp = 0;
  Country = 'PRI';
  CountryCode = 'PRI';
  Where = '';
  WhereLabel = '';
  When = '';
  Qeue: any[]=[];

  Categories: any;

  HttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private http: HttpClient
  ) { }

  SetMode(dark){
    window.localStorage.darkMode = dark;
  }

  GetMode(){
    return window.localStorage.darkMode;
  }

  SetSessionInfo(customer: any) {
    this.Customer = customer;
    window.localStorage.customer = JSON.stringify(this.Customer);
  }
  SetSessionCitas(citas: any){
    window.localStorage.citas = JSON.stringify(citas);
  }
  SetSessionCitasOld(citas: any){
    window.localStorage.citasold = JSON.stringify(citas);
  }
  SetDatePreviousDate(date: string){
    window.localStorage.prevDate = date;
  }
  GetAdmPhones(){
    return this.http.get('https://tucita247.s3.amazonaws.com/adm_phones/adm-phones.json').pipe(
      map((res: any) => res
      )
    );
  }
  GetCurrentCity(url){
    return this.http.get(url).pipe(
      map((res: any) => res
      )
    );
  }
  GetSessionCitas(){
    let localCitas: any;
    localCitas = JSON.parse(window.localStorage.citas || '[]');
    return localCitas;
  }
  GetSessionOldCitas(){
    let localCitas: any;
    localCitas = JSON.parse(window.localStorage.citasold || '[]');
    return localCitas;
  }
  GetDatePreviousDate(){
    let datePrev: any;
    datePrev = window.localStorage.prevDate;
    return datePrev;
  }
  GetLastItem(){
    let lastItem: any;
    lastItem = window.localStorage.lastItem;
    return (lastItem == undefined ? '' : lastItem);
  }
  SetLastItem(lastItem: any){
    window.localStorage.lastItem = lastItem;
  }
  GetCustomerInfo() {
    let customerData: any;
    if (window.localStorage.customer != undefined){
      customerData = JSON.parse(window.localStorage.customer);
    }
    
    return customerData;
  }
  GetSessionInfo() {
    let localSession: any;
    localSession = JSON.parse(window.localStorage.customer || '[]');
    if (localSession.CustomerId === undefined) {
      this.NewSession = true;
    } else {
      this.NewSession = false;
      this.Customer = localSession;
    }
    return this.NewSession;
  }
  VerifyPhone(phoneNumber: any) {
    this.PhoneNumber = phoneNumber;
    let body;
    body = {
      PlayerId: this.PlayerId
    };
    return this.http.post(this.ApiURL + 'mobile/' + phoneNumber, body, this.HttpOptions).pipe(
      map(results => results)
    );
  }
  GetPhoneInfo(phoneNumber: any) {
    this.PhoneNumber = phoneNumber;
    let body;
    body = {
      PlayerId: this.PlayerId
    };
    return this.http.post(this.ApiURL + 'mobile/info/' + phoneNumber, body, this.HttpOptions).pipe(
      map(results => results)
    );
  }
  VerifyEmail(email: any){
    return this.http.post(this.ApiURL + 'mobile/email/' + email, '', this.HttpOptions).pipe(
      map(results => results)
    );
  }
  UploadAvatar(customerId, mobile, formData){
    return this.http.put(this.ApiURL + 'mobile/avatar/' + customerId + '/' + mobile, formData).pipe(
      map(results => results)
    );
  }
  SetNewUser(phoneNumber: any, name: any, email: any, birthDate: any, custId: string) {
    let body;
    body = {
      Phone: phoneNumber,
      Name: name,
      Email: email,
      DOB: birthDate,
      Gender: '',
      Preferences: '1',
      Disability: '',
      CustId: custId,
      PlayerId: this.PlayerId,
      Country: this.CountryCode,
      Language: (this.Language == '' ? 'en' : this.Language)
    };
    console.log(body);
    return this.http.post(this.ApiURL + 'mobile', body, this.HttpOptions).pipe(
      map(results => results)
    );
  }
  SetLanguage(mobile: string, customerId: string, language: string){
    return this.http.put(this.ApiURL + 'mobile/lng/' + mobile + '/' + customerId + '/' + language, '').pipe(
      map(results => results)
    );
  }
  GetAds() {
    return this.http.get(this.ApiURL + 'mobile/ads/' + this.Language).pipe(
      map(results => results)
    );
  }
  GetPremiumBussines() {
    return this.http.get(this.ApiURL + 'mobile/business/ads').pipe(
      map(results => results)
    );
  }
  GetCategories() {
    return this.http.get(this.ApiURL + 'mobile/categories/' + this.Language).pipe(
      map(results => results)
    );
  }
  GetBusinessLocation(business: string){
    return this.http.get(this.ApiURL + 'mobile/business/' + business).pipe(
      map(results => results)
    );
  }
  GetAppointments(typeAppo: number, dateAppo: string, lastItem: string){
    let customerId;
    let info;
    info = {
      lastItem: lastItem
    }
    customerId = this.Customer.CustomerId;
    return this.http.put(this.ApiURL + 'mobile/appointments/' + customerId + '/' + typeAppo + '/' + dateAppo, info).pipe(
      map(results => results),
      retry(2),
      catchError(this.errorHandler)
    );
  }
  GetReserve(){
    let customerId;
    customerId = this.Customer.CustomerId;
    return this.http.get(this.ApiURL + 'mobile/appointments/reserve/' + customerId).pipe(
      map(results => results),
      retry(2),
      catchError(this.errorHandler)
    );
  }
  CancelReserve(appointmentId: string){
    let customerId;
    customerId = this.Customer.CustomerId;
    return this.http.delete(this.ApiURL + 'mobile/appointments/reserve/' + appointmentId + '/' + customerId).pipe(
      map(results => results)
    );
  }
  PostAppos(dataForm: any){
    return this.http.post(this.ApiURL + 'mobile/appointments', dataForm, this.HttpOptions).pipe(
      map(results => results)
    );
  }
  GetProviders(businessId: string, locationId: string){
    return this.http.get(this.ApiURL + 'mobile/providers/' + businessId + '/' + locationId).pipe(
      map(results => results)
    );
  }
  GetServices(businessId: string, providerId: string){
    return this.http.get(this.ApiURL + 'mobile/services/' + businessId + '/' + providerId).pipe(
      map(results => results)
    );
  }
  CancelAppointment(appointmentId: string, dateAppo: string){
    return this.http.put(this.ApiURL + 'mobile/cancel-appo/' + appointmentId + '/' + dateAppo, '').pipe(
      map(results => results)
    );
  }
  GetMessages(appointmentId: string){
    return this.http.get(this.ApiURL + 'mobile/messages/' + appointmentId).pipe(
      map(results => results)
    );
  }
  SendMessage(appointmentId: string, message: string){
    const dataForm = {
      Message: message
    };
    return this.http.put(this.ApiURL + 'mobile/message/' + appointmentId, dataForm).pipe(
      map(results => results)
    );
  }
  GetFavorites() {
    let customerId;
    customerId = this.Customer.CustomerId;
    return this.http.get(this.ApiURL + 'mobile/favorites/' + customerId).pipe(
      map(results => results)
    );
  }
  GetSearchData(searchData: string, city: string, sector: string, when: string) {
    return this.http.get(this.ApiURL + 'mobile/search/' + searchData + '/' + city + '/' + sector + '/' + when).pipe(
      map(results => results)
    );
  }
  UpdateProfile(name: string, gender: string, email: string, birthDate: string, preferences: string, disability: string, custom: string){
    let mobile;
    let customerId;
    mobile = this.Customer.Mobile;
    customerId = this.Customer.CustomerId;

    let body;
    body = {
      Name: name,
      Gender: gender,
      Email: email,
      DOB: birthDate,
      Preferences: preferences,
      Disability: disability,
      Custom: custom
    };
    return this.http.put(this.ApiURL + 'mobile/profile/' + mobile + '/' + customerId, body, this.HttpOptions).pipe(
      map(results => results)
    );
  }
  SetFavorite(bussinesId: any, locationId: any){
    let customerId;
    customerId = this.Customer.CustomerId;

    let body;
    body = {
      CustomerId: customerId,
      BusinessId: bussinesId,
      LocationId: locationId
    };

    return this.http.post(this.ApiURL + 'mobile/favorite', body, this.HttpOptions).pipe(
        map(results => results)
    );
  }
  DelFavorite(locationId){
    let customerId;
    customerId = this.Customer.CustomerId;
    return this.http.delete(this.ApiURL + 'mobile/favorite/' + customerId + '/' + locationId, this.HttpOptions).pipe(
      map(results => results)
    );
  }
  GetFavorite(locationId){
    let customerId;
    customerId = this.Customer.CustomerId;
    return this.http.get(this.ApiURL + 'mobile/favorite/' + customerId + '/' + locationId).pipe(
      map(results => results)
    );
  }
  GetAvailabity(businessId: string, locationId: string, providerId: string, serviceId: string, appoDate: string){
    return this.http.get(this.ApiURL + 'mobile/appointment/availability/' + businessId + '/' + locationId + '/' + providerId + '/' + serviceId + '/' + appoDate).pipe(
      map(results => results)
    );
  }
  GetPlaces(countriID: string){
    return this.http.get(this.ApiURL + 'mobile/where/' + countriID + '/' + this.Language).pipe(
        map(results => results)
    );
  }
  PostAppointment(dataForm: any){
    return this.http.post(this.ApiURL + 'mobile/appointment', dataForm, this.HttpOptions).pipe(
      map(results => results)
    );
  }
  PostOnHold(dataForm: any){
    return this.http.post(this.ApiURL + 'mobile/appointment/onhold', dataForm, this.HttpOptions).pipe(
      map(results => results)
    );
  }
  GetSubCategories(categoryId: string){
    return this.http.get(this.ApiURL + 'mobile/subcategories/' + categoryId + '/' + this.Language).pipe(
        map(results => results)
    );
  }
  GetBusiness(businessId: string, categoryId: string, subCategoryId: string, lastItem: string){
    return this.http.get(this.ApiURL + 'mobile/result/' + businessId + '/' + categoryId + '/' + subCategoryId + '/' + lastItem).pipe(
        map(results => results)
    );
  }
  GetLastVersion(){
    return this.http.get(this.ApiURL + 'mobile/version' ).pipe(
        map(results => results)
    );
  }
  errorHandler(error) {
    return throwError(error || 'Server Error');
  }
}

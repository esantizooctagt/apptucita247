import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appPhonenum]'
})
export class PhonenumDirective {
  @Input() ccode:string;

  constructor(public ngControl: NgControl) { }

  @HostListener('ngModelChange', ['$event'])
  onModelChange(event) {
    this.onInputChange(event, false);
  }

  @HostListener('keydown.backspace', ['$event'])
  keydownBackspace(event) {
    this.onInputChange(event.target.value, true);
  }

  onInputChange(event, backspace) {
    let newVal = event.replace(/\D/g, '');
    if (this.ccode == 'PER' || this.ccode == 'REP' || this.ccode == 'USA'){
      if (backspace && newVal.length <= 6) {
        newVal = newVal.substring(0, newVal.length - 1);
      }
      if (newVal.length === 0) {
        newVal = '';
      } else if (newVal.length <= 3) {
        newVal = newVal.replace(/^(\d{0,3})/, '($1)');
      } else if (newVal.length <= 6) {
        newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
      } else if (newVal.length < 10) {
        if (newVal.substring(0,1) == "1"){
          newVal = newVal.substring(1, newVal.length);
        }
        newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
      } else {
        if (newVal.substring(0,1) == "1"){
          newVal = newVal.substring(1, newVal.length);
        }
        newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
      }
      this.ngControl.valueAccessor.writeValue(newVal);
    }
    if (this.ccode == 'GUA'){
      if (newVal.length === 0) {
        newVal = '';
      } else if (newVal.length <= 4) {
        newVal = newVal.replace(/^(\d{0,4})/, '$1');
      } else if (newVal.length <= 8) {
        newVal = newVal.replace(/^(\d{0,4})(\d{0,4})/, '$1-$2');
      }
      if (newVal.length > 8){
        newVal = newVal.replace(/\D/g, '').substring(0,8);
        newVal = newVal.replace(/^(\d{0,4})(\d{0,4})/, '$1-$2');
      }
      this.ngControl.valueAccessor.writeValue(newVal);
    }
    if (this.ccode == 'GER'){
      if (newVal.length === 0) {
        newVal = '';
      } else if (newVal.length <= 3) {
        newVal = newVal.replace(/^(\d{0,3})/, '$1');
      } else if (newVal.length <= 11) {
        newVal = newVal.replace(/^(\d{0,3})(\d{0,8})/, '$1 $2');
      }
      if (newVal.length > 11){
        newVal = newVal.replace(/\D/g, '').substring(0,11);
        newVal = newVal.replace(/^(\d{0,3})(\d{0,8})/, '$1 $2');
      }
      this.ngControl.valueAccessor.writeValue(newVal);
    }
    if (this.ccode == 'ESP'){
      if (newVal.length === 0) {
        newVal = '';
      } else if (newVal.length <= 3) {
        newVal = newVal.replace(/^(\d{0,3})/, '$1');
      } else if (newVal.length <= 6) {
        newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, '$1 $2');
      } else if (newVal.length <= 9) {
        newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,3})/, '$1 $2 $3');
      }
      if (newVal.length > 9){
        newVal = newVal.replace(/\D/g, '').substring(0,9);
        newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,3})/, '$1 $2 $3');
      }
      this.ngControl.valueAccessor.writeValue(newVal);
    }
  }

}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighlightPipe } from '../services/highlight.pipe';
import { PhonePipe } from '../services/phone.pipe';
// import { PhonenumDirective } from './phonenum.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  // PhonenumDirective
  declarations: [HighlightPipe, PhonePipe],
  exports: [HighlightPipe, PhonePipe]
})
export class PipesModule { }
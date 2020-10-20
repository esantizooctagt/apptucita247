import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VerifemailPage } from './verifemail.page';

describe('VerifemailPage', () => {
  let component: VerifemailPage;
  let fixture: ComponentFixture<VerifemailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifemailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VerifemailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

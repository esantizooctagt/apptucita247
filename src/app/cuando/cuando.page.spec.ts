import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CuandoPage } from './cuando.page';

describe('CuandoPage', () => {
  let component: CuandoPage;
  let fixture: ComponentFixture<CuandoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [CuandoPage],
    imports: [IonicModule.forRoot()]
}).compileComponents();

    fixture = TestBed.createComponent(CuandoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

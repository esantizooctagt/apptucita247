import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VerificacionPage } from './verificacion.page';

describe('VerificacionPage', () => {
  let component: VerificacionPage;
  let fixture: ComponentFixture<VerificacionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [VerificacionPage],
    imports: [IonicModule.forRoot()],
    teardown: { destroyAfterEach: false }
}).compileComponents();

    fixture = TestBed.createComponent(VerificacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

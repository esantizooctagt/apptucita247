import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ComercioLocalidadPage } from './comercio-localidad.page';

describe('ComercioLocalidadPage', () => {
  let component: ComercioLocalidadPage;
  let fixture: ComponentFixture<ComercioLocalidadPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [ComercioLocalidadPage],
    imports: [IonicModule.forRoot()]
}).compileComponents();

    fixture = TestBed.createComponent(ComercioLocalidadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

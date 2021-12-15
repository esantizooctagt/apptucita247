import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CategoriasDetallePage } from './categorias-detalle.page';

describe('CategoriasDetallePage', () => {
  let component: CategoriasDetallePage;
  let fixture: ComponentFixture<CategoriasDetallePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [CategoriasDetallePage],
    imports: [IonicModule.forRoot()]
}).compileComponents();

    fixture = TestBed.createComponent(CategoriasDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

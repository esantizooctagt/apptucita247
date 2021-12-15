import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ComercioPage } from './comercio.page';

describe('ComercioPage', () => {
  let component: ComercioPage;
  let fixture: ComponentFixture<ComercioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [ComercioPage],
    imports: [IonicModule.forRoot()]
}).compileComponents();

    fixture = TestBed.createComponent(ComercioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

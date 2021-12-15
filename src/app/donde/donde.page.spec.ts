import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DondePage } from './donde.page';

describe('DondePage', () => {
  let component: DondePage;
  let fixture: ComponentFixture<DondePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [DondePage],
    imports: [IonicModule.forRoot()]
}).compileComponents();

    fixture = TestBed.createComponent(DondePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

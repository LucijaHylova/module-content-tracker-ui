import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleDetailsComponent } from './node-details-dialog.component';

describe('ModuleDetails', () => {
  let component: ModuleDetailsComponent;
  let fixture: ComponentFixture<ModuleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuleDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

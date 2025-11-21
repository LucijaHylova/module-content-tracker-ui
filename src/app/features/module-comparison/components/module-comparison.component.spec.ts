import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleComparisonComponent } from './module-comparison.component';

describe('ModuleComparison', () => {
  let component: ModuleComparisonComponent;
  let fixture: ComponentFixture<ModuleComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuleComparisonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuleComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

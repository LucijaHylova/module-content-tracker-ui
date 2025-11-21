import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailedModuleDecisionDialogComponent } from './failed-module-decision-dialog.component';

describe('FailedModuleDecisionDialog', () => {
  let component: FailedModuleDecisionDialogComponent;
  let fixture: ComponentFixture<FailedModuleDecisionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FailedModuleDecisionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FailedModuleDecisionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

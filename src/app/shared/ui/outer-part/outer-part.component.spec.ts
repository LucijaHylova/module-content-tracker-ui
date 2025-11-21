import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OuterPartComponent } from './outer-part.component';

describe('OuterPartComponent', () => {
  let component: OuterPartComponent;
  let fixture: ComponentFixture<OuterPartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OuterPartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OuterPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

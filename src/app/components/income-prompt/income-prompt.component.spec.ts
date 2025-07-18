import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomePromptComponent } from './income-prompt.component';

describe('IncomePromptComponent', () => {
  let component: IncomePromptComponent;
  let fixture: ComponentFixture<IncomePromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomePromptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomePromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

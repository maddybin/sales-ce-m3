import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmSettingComponent } from './crm-setting.component';

describe('CrmSettingComponent', () => {
  let component: CrmSettingComponent;
  let fixture: ComponentFixture<CrmSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrmSettingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrmSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

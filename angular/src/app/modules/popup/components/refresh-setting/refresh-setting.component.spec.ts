import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefreshSettingComponent } from './refresh-setting.component';

describe('RefreshSettingComponent', () => {
  let component: RefreshSettingComponent;
  let fixture: ComponentFixture<RefreshSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefreshSettingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefreshSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

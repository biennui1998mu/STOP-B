import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersManagesComponent } from './members-manages.component';

describe('MembersManagesComponent', () => {
  let component: MembersManagesComponent;
  let fixture: ComponentFixture<MembersManagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MembersManagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersManagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

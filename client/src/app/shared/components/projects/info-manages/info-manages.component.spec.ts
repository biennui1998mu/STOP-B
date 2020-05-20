import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoManagesComponent } from './info-manages.component';

describe('InfoManagesComponent', () => {
  let component: InfoManagesComponent;
  let fixture: ComponentFixture<InfoManagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoManagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoManagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

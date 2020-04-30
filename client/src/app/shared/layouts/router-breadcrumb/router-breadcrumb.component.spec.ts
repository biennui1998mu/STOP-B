import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterBreadcrumbComponent } from './router-breadcrumb.component';

describe('RouterBreadcrumbComponent', () => {
  let component: RouterBreadcrumbComponent;
  let fixture: ComponentFixture<RouterBreadcrumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RouterBreadcrumbComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouterBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

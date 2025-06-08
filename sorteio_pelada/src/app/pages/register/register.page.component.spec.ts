/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Register.pageComponent } from './register.page.component';

describe('Register.pageComponent', () => {
  let component: Register.pageComponent;
  let fixture: ComponentFixture<Register.pageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Register.pageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Register.pageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

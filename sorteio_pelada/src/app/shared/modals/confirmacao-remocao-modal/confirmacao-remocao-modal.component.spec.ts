/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ConfirmacaoRemocaoModalComponent } from './confirmacao-remocao-modal.component';

describe('ConfirmacaoRemocaoModalComponent', () => {
  let component: ConfirmacaoRemocaoModalComponent;
  let fixture: ComponentFixture<ConfirmacaoRemocaoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmacaoRemocaoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmacaoRemocaoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

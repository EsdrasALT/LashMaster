import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClienteDetalhePage } from './cliente-detalhe.page';

describe('ClienteDetalhePage', () => {
  let component: ClienteDetalhePage;
  let fixture: ComponentFixture<ClienteDetalhePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteDetalhePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

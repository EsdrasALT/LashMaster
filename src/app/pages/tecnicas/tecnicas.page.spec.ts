import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TecnicasPage } from './tecnicas.page';

describe('TecnicasPage', () => {
  let component: TecnicasPage;
  let fixture: ComponentFixture<TecnicasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TecnicasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

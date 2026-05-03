import { TestBed } from '@angular/core/testing';
import { TecnicasService } from './tecnicas'; // Nome corrigido aqui

describe('TecnicasService', () => {
  let service: TecnicasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TecnicasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
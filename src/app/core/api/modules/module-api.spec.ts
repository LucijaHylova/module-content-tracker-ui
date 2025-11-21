import { TestBed } from '@angular/core/testing';

import { ModuleApi } from './module-api';

describe('ModuleApi', () => {
  let service: ModuleApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModuleApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

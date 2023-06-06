import { TestBed } from '@angular/core/testing';

import { TokenService } from './token.service';
import { CookieService } from 'ngx-cookie';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CookieService]
    });
    service = TestBed.inject(TokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

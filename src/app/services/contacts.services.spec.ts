import { TestBed } from '@angular/core/testing';

import { ContactsServices } from './contacts.services';

describe('ContactsServices', () => {
  let service: ContactsServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactsServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

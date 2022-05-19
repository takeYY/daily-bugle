import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry } from 'rxjs/operators';

import { ConnectService } from '../connect.service';
import { ErrorService } from '../error.service';

@Injectable({
  providedIn: 'root',
})
export class UsrsOrdinariesService extends ConnectService {
  basePath: string = this.basePath + '/api/users-ordinaries';
  http: HttpClient = this.http;
  errorService: ErrorService = this.errorService;

  findAllByUid(uid: string) {
    const params = { params: { uid: uid } };
    return this.http.get(`${this.basePath}/list`, params).pipe(retry(2), catchError(this.errorService.handleError));
  }
}

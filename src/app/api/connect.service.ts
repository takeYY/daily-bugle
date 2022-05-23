import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { ErrorService } from './error.service';

import { environment } from '../../environments/environment';
import { IOrdinary } from '../interfaces/ordinary/IOrdinary';
import { IWeekday } from '../interfaces/weekday/IWeekday';
import { IUsersOrdinary } from '../interfaces/users-ordinary/IUsersOrdinary';
import { IAchievement } from '../interfaces/achievement/IAchievement';

@Injectable({
  providedIn: 'root',
})
// TODO インターセプターを導入
export class ConnectService {
  basePath: string = environment.apiUrl;
  httpOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(public http: HttpClient, public errorService: ErrorService) {}

  getList(): Observable<ArrayBuffer> {
    return this.http.get(this.basePath, this.httpOptions).pipe(retry(2), catchError(this.errorService.handleError));
  }

  postData(data: IOrdinary | IWeekday | IUsersOrdinary | IAchievement) {
    return this.http
      .post(this.basePath, data, this.httpOptions)
      .pipe(retry(2), catchError(this.errorService.handleError));
  }
}

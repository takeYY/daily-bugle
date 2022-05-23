import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry } from 'rxjs/operators';

import { ConnectService } from '../connect.service';
import { ErrorService } from '../error.service';

@Injectable({
  providedIn: 'root',
})
export class AchievementsService extends ConnectService {
  basePath: string = this.basePath + '/api/achievements';
  http: HttpClient = this.http;
  errorService: ErrorService = this.errorService;

  constructor(http: HttpClient, errorService: ErrorService) {
    super(http, errorService);
  }

  findAllByUid(uid: string) {
    const params = { params: { uid } };
    return this.http.get(`${this.basePath}/query`, params).pipe(retry(2), catchError(this.errorService.handleError));
  }

  findAllByDate(uid: string, date: string) {
    const params = { params: { uid, date } };
    return this.http.get(`${this.basePath}/query`, params).pipe(retry(2), catchError(this.errorService.handleError));
  }

  updateData(id: string, data) {
    const params = { isAchieved: data.isAchieved, comment: data.comment };
    return this.http.patch(`${this.basePath}/${id}`, params).pipe(retry(2), catchError(this.errorService.handleError));
  }
}

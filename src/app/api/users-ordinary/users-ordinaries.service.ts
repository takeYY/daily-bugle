import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry } from 'rxjs/operators';

import { ConnectService } from '../connect.service';
import { ErrorService } from '../error.service';

import { OrdinariesService } from '../ordinary/ordinaries.service';

@Injectable({
  providedIn: 'root',
})
export class UsersOrdinariesService extends ConnectService {
  basePath: string = this.basePath + '/api/users-ordinaries';
  http: HttpClient = this.http;
  errorService: ErrorService = this.errorService;

  constructor(http: HttpClient, errorService: ErrorService, private ordinariesService: OrdinariesService) {
    super(http, errorService);
  }

  findAllByUid(uid: string) {
    const params = { params: { uid } };
    return this.http.get(`${this.basePath}/list`, params).pipe(retry(2), catchError(this.errorService.handleError));
  }

  createUesrsOrdinaries(user, ordinary, weekdays, usersOrdinary, ordinariesWeekday) {
    // TODO: 以下のバリデーションなどを別の場所で処理するように
    if (!user) {
      alert('ログインが必要です！');
      return;
    }

    if (!ordinary.name) {
      alert('日常名がありません！');
      return;
    }
    if (!weekdays.filter((w) => w.isChecked)) {
      alert('曜日が選択されていません！');
      return;
    }
    // 日常の登録
    this.ordinariesService.postData(ordinary).subscribe((response) => {
      // 日常のデータを一時保存
      const tmpOrdinary = { id: response['id'], name: response['name'] };
      // 日常の入力項目初期化
      ordinary.name = '';
      // 登録する曜日毎にweekdaysを保存し、まとめてusersOrdinaryに追加
      const tmpWeekday: [] = weekdays.filter((w) => w.isChecked);
      const tmpWeekdayLength: number = weekdays.filter((w) => w.isChecked).length;
      // 雛形作成
      usersOrdinary.isClosed = false;
      usersOrdinary.ordinary = tmpOrdinary;
      usersOrdinary.weekdays = tmpWeekday;
      this.postData(usersOrdinary).subscribe((res) => {
        ordinariesWeekday.push({
          ordinary: tmpOrdinary,
          weekdays: tmpWeekday,
          scene: tmpWeekdayLength === 7 ? 'everyday' : tmpWeekdayLength === 1 ? 'week' : 'weekday',
        });
        weekdays.map((w) => {
          w.isChecked = false;
        });
      });
    });
    return ordinariesWeekday;
  }
}

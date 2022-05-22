import { Injectable } from '@angular/core';

import { ConnectService } from '../connect.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends ConnectService {
  basePath: string = this.basePath + '/api/users';
}

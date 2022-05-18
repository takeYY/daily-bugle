import { Injectable } from '@angular/core';

import { ConnectService } from '../connect.service';

@Injectable({
  providedIn: 'root',
})
export class UsrsOrdinariesService extends ConnectService {
  basePath: string = this.basePath + '/api/users-ordinaries';
}

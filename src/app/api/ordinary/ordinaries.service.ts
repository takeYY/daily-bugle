import { Injectable } from '@angular/core';

import { ConnectService } from '../connect.service';

@Injectable({
  providedIn: 'root',
})
export class OrdinariesService extends ConnectService {
  basePath: string = this.basePath + '/api/ordinaries';
}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsualPage } from './usual.page';

const routes: Routes = [
  {
    path: '',
    component: UsualPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsualPageRoutingModule {}

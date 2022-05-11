import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsualPageRoutingModule } from './usual-routing.module';

import { UsualPage } from './usual.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, UsualPageRoutingModule],
  declarations: [UsualPage],
})
export class UsualPageModule {}

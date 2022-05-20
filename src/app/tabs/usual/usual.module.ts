import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsualPageRoutingModule } from './usual-routing.module';

import { UsualPage } from './usual.page';

import { ComponentsModule } from './components/components.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, UsualPageRoutingModule, ComponentsModule],
  declarations: [UsualPage],
})
export class UsualPageModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { OrdinaryModalComponent } from './ordinary-modal/ordinary-modal.component';

@NgModule({
  declarations: [OrdinaryModalComponent, OrdinaryModalComponent],
  exports: [OrdinaryModalComponent, OrdinaryModalComponent],

  imports: [IonicModule, CommonModule, FormsModule],
})
export class ComponentsModule {}

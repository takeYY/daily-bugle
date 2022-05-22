import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilePage } from './profile/profile.page';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [ProfilePage],
  imports: [CommonModule, FormsModule, IonicModule],
})
export class SharedModule {}

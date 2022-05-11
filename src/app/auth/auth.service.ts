import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { NavController, AlertController } from '@ionic/angular';
import { firebaseError } from './firebase.error';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(public afAuth: Auth, public navController: NavController, public alertController: AlertController) {}

  async getUserId(): Promise<string> {
    const user = await this.afAuth.currentUser;
    return user.uid;
  }

  authSignUp(login: { email: string; password: string }) {
    return createUserWithEmailAndPassword(this.afAuth, login.email, login.password)
      .then(() => this.navController.navigateForward('/'))
      .catch((error) => {
        this.alertError(error);
        throw error;
      });
  }

  authSignIn(login: { email: string; password: string }) {
    return signInWithEmailAndPassword(this.afAuth, login.email, login.password).catch((error) => {
      this.alertError(error);
      throw error;
    });
  }

  authSignOut() {
    return this.afAuth
      .signOut()
      .then(() => this.navController.navigateRoot('/auth/signin'))
      .catch((error) => {
        this.alertError(error);
        throw error;
      });
  }

  async alertError(e) {
    if (firebaseError.hasOwnProperty(e.code)) {
      e = firebaseError[e.code];
    }
    const alert = await this.alertController.create({
      header: e.code,
      message: e.message,
      buttons: ['閉じる'],
    });
    await alert.present();
  }
}

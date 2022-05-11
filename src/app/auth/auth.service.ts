import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { firebaseError } from './firebase.error';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public afAuth: Auth,
    public navController: NavController,
    public alertController: AlertController,
    public toastController: ToastController,
  ) {}

  async getUserId(): Promise<string> {
    const user = await this.afAuth.currentUser;
    return user.uid;
  }

  async authSignUp(login: { email: string; password: string; passwordConfirmation: string }) {
    if (login.password !== login.passwordConfirmation) {
      const error = { code: 'auth/mismatch-password-confirmation' };
      this.alertError(error);
      throw error;
    }
    return createUserWithEmailAndPassword(this.afAuth, login.email, login.password)
      .then(() => {
        this.navController.navigateForward('/').then(async () => {
          const toast = await this.toastController.create({
            message: 'ユーザ登録に成功しました。',
            duration: 3000,
            position: 'top',
          });
          await toast.present();
        });
      })
      .catch((error) => {
        this.alertError(error);
        throw error;
      });
  }

  authSignIn(login: { email: string; password: string }) {
    return signInWithEmailAndPassword(this.afAuth, login.email, login.password)
      .then(() => {
        this.navController.navigateForward('/').then(async () => {
          const toast = await this.toastController.create({
            message: 'ログインしました。',
            duration: 3000,
            position: 'top',
          });
          await toast.present();
        });
      })
      .catch((error) => {
        this.alertError(error);
        throw error;
      });
  }

  authSignOut() {
    return this.afAuth
      .signOut()
      .then(() => {
        this.navController.navigateRoot('/auth/signin').then(async () => {
          const toast = await this.toastController.create({
            message: 'ログアウトしました。',
            duration: 3000,
            position: 'top',
          });
          await toast.present();
        });
      })
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

import { Injectable } from '@angular/core';
import {
  Firestore,
  collectionData,
  collection,
  orderBy,
  DocumentReference,
  CollectionReference,
  addDoc,
  setDoc,
  query,
  doc,
  docData,
} from '@angular/fire/firestore';
import { first, concatMap } from 'rxjs/operators';

export interface IUser {
  displayName: string;
  photoDataUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  userDoc: DocumentReference<any>;
  userCollection: CollectionReference<any>;

  constructor(public af: Firestore) {
    this.userCollection = collection(this.af, 'users');
  }

  userInit(uid: string): Promise<IUser> {
    this.userDoc = doc(this.af, `users/${uid}`);
    return docData(this.userDoc).pipe(first()).toPromise(Promise);
  }
  userSet(user: IUser): Promise<void> {
    return setDoc(this.userDoc, user);
  }
}

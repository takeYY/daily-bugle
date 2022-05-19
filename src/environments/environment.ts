// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyCDzAfvwTkPMm1lDgtgxRSahclDO53go7U',
    authDomain: 'daily-bugle-2de82.firebaseapp.com',
    projectId: 'daily-bugle-2de82',
    storageBucket: 'daily-bugle-2de82.appspot.com',
    messagingSenderId: '660937532508',
    appId: '1:660937532508:web:4a3a6e589f2c5b383bf299',
  },
  apiUrl: 'https://asia-northeast1-daily-bugle-2de82.cloudfunctions.net',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

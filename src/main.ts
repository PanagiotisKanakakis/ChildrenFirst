import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from '@src/app/app.module';
import { environment } from '@src/environments/environment';
import Theme from '@nativescript/theme';
require( 'nativescript-platform-css' );

setTimeout(() => {
  console.log('Setting mode to light');
  Theme.setMode(Theme.Light);
},100);
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

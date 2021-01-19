import {Component, OnInit} from '@angular/core';
import {Device, Enums, Page} from '@nativescript/core';
import {android as androidApp} from 'tns-core-modules/application';
import {Device as device} from 'tns-core-modules/platform';
import {RouterExtensions} from '@nativescript/angular';
import {File, knownFolders, path} from 'tns-core-modules/file-system';
import DeviceType = Enums.DeviceType;

declare var android: any;


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

    constructor(
        public page: Page,
        public router: RouterExtensions
    ) {


        if (androidApp && device.sdkVersion >= '21') {
            const View = android.view.View;
            const window = androidApp.startActivity.getWindow();
            const decorView = window.getDecorView();
            decorView.setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
                View.SYSTEM_UI_FLAG_FULLSCREEN |
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
            );
        }
    }

    ngOnInit() {

    }
}

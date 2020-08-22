import {Component, OnInit} from '@angular/core';
import {orientationCleanup, setCurrentOrientation} from 'nativescript-screen-orientation';
import {GestureEventData, Page} from '@nativescript/core';
import * as fs from 'tns-core-modules/file-system';
import {NavigationExtras, Router} from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
    public bgSrc: string;
    public logoSrc: string;
    private router:Router;
    private REDIRECT_ROUTE = ['/character-selection'];


    constructor(router: Router, page: Page) {
        this.router = router;
        this.bgSrc = encodeURI(`${fs.knownFolders.currentApp().path}/assets/images/background.PNG`);
        this.logoSrc = encodeURI(`${fs.knownFolders.currentApp().path}/assets/images/logo.PNG`);
        // page.actionBarHidden = true;
        page.on('navigatedTo', function() {
            setCurrentOrientation('landscape', function() {
                console.log('landscape orientation');
            });
        });
        page.on('navigatingFrom', function() {
            orientationCleanup();
        });
    }

    onTap(args: GestureEventData) {
        this.router.navigate(this.REDIRECT_ROUTE, {clearHistory: true} as NavigationExtras);
    }

    ngOnInit() {
    }
}

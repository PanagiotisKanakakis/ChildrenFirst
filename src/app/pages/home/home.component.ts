import {Component, OnInit} from '@angular/core';
import {orientationCleanup, setCurrentOrientation} from 'nativescript-screen-orientation';
import {GestureEventData, Page} from '@nativescript/core';
import {knownFolders} from 'tns-core-modules/file-system';
import {NavigationExtras, Router} from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
    public bgSrc: string;
    public logoSrc: string;
    private REDIRECT_ROUTE = ['/character-selection'];

    constructor(
        private router: Router,
        private page: Page
    ) {
        this.bgSrc = encodeURI(`${knownFolders.currentApp().path}/assets/images/background.PNG`);
        this.logoSrc = encodeURI(`${knownFolders.currentApp().path}/assets/images/logo.PNG`);
    }

    onTap(args: GestureEventData) {
        this.router.navigate(this.REDIRECT_ROUTE, {clearHistory: true} as NavigationExtras);
    }

    ngOnInit() {
        this.page.on('navigatedTo', function() {
            setCurrentOrientation('landscape', function() {
                console.log('landscape orientation');
            });
        });
        this.page.on('navigatingFrom', function() {
            orientationCleanup();
        });
    }
}

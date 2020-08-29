import {Component} from '@angular/core';
import {GestureEventData, Page} from '@nativescript/core';
import {knownFolders} from 'tns-core-modules/file-system';
import {NavigationExtras, Router} from '@angular/router';
import {AppComponent} from '@src/app/app.component';
import {RouterExtensions} from '@nativescript/angular';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent extends AppComponent {
    public bgSrc: string;
    public logoSrc: string;
    public buttonSrc: string;
    private REDIRECT_ROUTE = ['/character-selection'];

    constructor(
        public router: RouterExtensions,
        public page: Page
    ) {
        super(page, router);
        this.logoSrc = encodeURI(`${knownFolders.currentApp().path}/assets/images/logo.PNG`);
        this.buttonSrc = encodeURI(`${knownFolders.currentApp().path}/assets/images/home/startButton.jpg`);
    }

    onTap(args: GestureEventData) {
        this.router.navigate(this.REDIRECT_ROUTE, {clearHistory: true} as NavigationExtras);
    }
}
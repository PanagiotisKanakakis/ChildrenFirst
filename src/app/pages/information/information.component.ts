import {AfterContentInit, Component, OnInit} from '@angular/core';
import {AppComponent} from '@src/app/app.component';
import {GestureEventData, Page} from '@nativescript/core';
import {RouterExtensions} from '@nativescript/angular';
import {File, knownFolders, path} from 'tns-core-modules/file-system';
import {NavigationExtras} from '@angular/router';

@Component({
    selector: 'app-information',
    templateUrl: './information.component.html',
    styleUrls: ['./information.component.css']
})
export class InformationComponent extends AppComponent implements OnInit {

    private REDIRECT_ROUTE = ['/characters'];
    private payload = {};
    public avatar: string;
    public question: string;
    public answer: string;
    private counter:any = 0;

    constructor(public page: Page,
                public router: RouterExtensions) {
        super(page, router);
        const filePath = encodeURI(path.join(`${knownFolders.currentApp().path}/assets/information.json`));
        const text = File.fromPath(filePath).readTextSync(() => {
        });
        this.payload = JSON.parse(text).payload;
        this.answer = this.payload[this.counter]['answer']
        this.question = this.payload[this.counter]['question']
        this.avatar = encodeURI(`${knownFolders.currentApp().path}` + this.payload[this.counter]['avatar']);

    }

    ngOnInit(): void {
    }

    onNextTap(args: GestureEventData) {
        this.counter++;
        if(this.counter > 4)
            this.router.navigate(this.REDIRECT_ROUTE, {clearHistory: true} as NavigationExtras);
        this.answer = this.payload[this.counter]['answer']
        this.question = this.payload[this.counter]['question']
        this.avatar = encodeURI(`${knownFolders.currentApp().path}` + this.payload[this.counter]['avatar']);
    }

}

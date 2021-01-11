import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AppComponent} from '@src/app/app.component';
import {Device, Enums, GestureEventData, Page} from '@nativescript/core';
import {RouterExtensions} from '@nativescript/angular';
import {File, knownFolders, path} from 'tns-core-modules/file-system';
import {NavigationExtras} from '@angular/router';
import {isAndroid} from 'tns-core-modules/platform';
import DeviceType = Enums.DeviceType;
import {Data} from '@src/app/domain/Data';


const fs = require('tns-core-modules/file-system');
let sqlite = require('nativescript-sqlite');

@Component({
    selector: 'app-information',
    templateUrl: './information.component.html',
    styleUrls: ['./information.component.css']
})
export class InformationComponent extends AppComponent implements OnInit {

    private REDIRECT_ROUTE = ['/characters'];
    public infoImage: string;
    public title: string;
    public description: string;
    private counter: any = 0;
    private information: Array<any>;
    public next:any;
    public back:any;
    @ViewChild('bc') bc: ElementRef;

    constructor(public page: Page,
                private data: Data,
                public router: RouterExtensions) {
        super(page, router);
        this.infoImage = encodeURI(`${knownFolders.currentApp().path}/assets/images/info-small.png`);
        let title_column = 'TITLE_' + this.data.storage.language;
        let description_column = 'DESCRIPTION_' + this.data.storage.language;
        new sqlite(encodeURI(path.join(`${knownFolders.currentApp().path}/assets/chf.db`))).then(db => {
            db.resultType(sqlite.RESULTSASOBJECT);
            db.all('SELECT * FROM info').then(rows => {
                this.information = [];
                for (let row in rows) {
                    this.information.push({
                        'description': rows[row][description_column],
                        'title': rows[row][title_column],
                    });
                }
                this.description = this.information[this.counter]['description'];
                this.title = this.information[this.counter]['title'];
            });
        }, error => {
            console.log('Failed to connect to db!', error);
        });
        if (isAndroid) {
            if (Device.deviceType === DeviceType.Tablet) {
                this.page.className = 'tablet';
                const pageCss = path.join(encodeURI(`${knownFolders.currentApp().path}/assets/android.tablet.css`));
                let css = File.fromPath(pageCss).readTextSync(() => {
                });
                console.log(css);
                this.page.addCss(css);
                // this.page.addCss("~/pages/information/android.tablet.css");
            } else if (Device.deviceType === DeviceType.Phone) {
                console.log('phone');
            }
        }
    }

    ngOnInit(): void {
        this.next = encodeURI(`${knownFolders.currentApp().path}/assets/images/continue.png`);
        this.back = encodeURI(`${knownFolders.currentApp().path}/assets/images/back.png`);
    }

    onNextTap(args: GestureEventData) {
        this.bc.nativeElement.set('opacity',1);
        this.counter++;
        if (this.counter > 4) {
            this.router.navigate(this.REDIRECT_ROUTE, {clearHistory: true} as NavigationExtras);
        }
        this.description = this.information[this.counter]['description'];
        this.title = this.information[this.counter]['title'];
    }

    onBackTap(args: GestureEventData) {
        this.counter--;
        this.description = this.information[this.counter]['description'];
        this.title = this.information[this.counter]['title'];
        if(this.counter == 0)
            this.bc.nativeElement.set('opacity',0);
    }

}

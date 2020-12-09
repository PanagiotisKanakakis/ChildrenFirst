import {AfterContentInit, Component, OnInit} from '@angular/core';
import {AppComponent} from '@src/app/app.component';
import {Device, GestureEventData, Page} from '@nativescript/core';
import {RouterExtensions} from '@nativescript/angular';
import {File, knownFolders, path} from 'tns-core-modules/file-system';
import {NavigationExtras} from '@angular/router';
import {DeviceType} from '@nativescript/core/ui/enums';
import {isAndroid} from "tns-core-modules/platform"


const fs = require('tns-core-modules/file-system');
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
    public characterSrc: string;
    public answer: string;
    private counter:any = 0;

    constructor(public page: Page,
                public router: RouterExtensions) {
        super(page, router);

        console.log(Device.deviceType);
        if (isAndroid) {
            if (Device.deviceType === DeviceType.Tablet) {
                this.page.className = "tablet";
                const pageCss = path.join(encodeURI(`${knownFolders.currentApp().path}/assets/android.tablet.css`));
                var css = File.fromPath(pageCss).readTextSync(() => {});
                console.log(css);
                this.page.addCss(css);
                // this.page.addCss("~/pages/information/android.tablet.css");
            }else if(Device.deviceType === DeviceType.Phone){
                console.log("phone");
            }
        }


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

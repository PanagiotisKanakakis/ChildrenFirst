import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Device, Enums, GestureEventData, Page, View} from '@nativescript/core';
import {File, knownFolders, path} from 'tns-core-modules/file-system';
import {NavigationExtras} from '@angular/router';
import {AppComponent} from '@src/app/app.component';
import {RouterExtensions} from '@nativescript/angular';
import {Data} from '@src/app/domain/Data';
import {Animation} from '@nativescript/core/ui/animation';
import DeviceType = Enums.DeviceType;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent extends AppComponent implements OnInit {
    public logoSrc: string;
    public buttonSrc: string;
    private REDIRECT_ROUTE = ['/information'];
    public languages = {
        1: 'EN',
        2: 'GR',
        3: 'IT',
        4: 'LT'
    };
    public icons: any[];
    @ViewChild('en') en: ElementRef;
    @ViewChild('gr') gr: ElementRef;
    @ViewChild('it') it: ElementRef;
    @ViewChild('lt') lt: ElementRef;
    @ViewChild('bg') bg: ElementRef;
    public _isFabOpen: Boolean;
    public euLogo:string;
    public imageButton:string;

    constructor(
        public router: RouterExtensions,
        public page: Page,
        private data: Data
    ) {
        super(page, router);
        this.logoSrc = encodeURI(`${knownFolders.currentApp().path}/assets/images/logo_3.png`);
        this.imageButton = encodeURI(`${knownFolders.currentApp().path}/assets/images/intro_start_clicked.png`);
        this.euLogo = encodeURI(`${knownFolders.currentApp().path}/assets/images/eulogo.jpg`);
        this.data.storage = {'language': 'EN'};


        if (Device.deviceType === DeviceType.Tablet) {
            this.page.className = 'tablet';
            const pageCss = path.join(encodeURI(`${knownFolders.currentApp().path}/assets/tablet.css`));
            let css = File.fromPath(pageCss).readTextSync(() => {
            });
            // console.log(css);
            this.page.addCss(css);
        }
    }

    onTap(args: GestureEventData) {
        this.router.navigate(this.REDIRECT_ROUTE, {clearHistory: true} as NavigationExtras);
    }

    fabTap(args: GestureEventData) {

        if (this._isFabOpen) {
            const btnEn = <View> this.en.nativeElement;
            btnEn.animate({translate: {x: 0, y: 0}, opacity: 0, duration: 280, delay: 0});

            const btnLt = <View> this.lt.nativeElement;
            btnLt.animate({translate: {x: 0, y: 0}, opacity: 0, duration: 280, delay: 0});

            const btnIt = <View> this.it.nativeElement;
            btnIt.animate({translate: {x: 0, y: 0}, opacity: 0, duration: 280, delay: 0});

            const btnGr = <View> this.gr.nativeElement;
            btnGr.animate({translate: {x: 0, y: 0}, opacity: 0, duration: 280, delay: 0});
            const background = <View> this.bg.nativeElement;
            background.animate({opacity: 1, duration: 280, delay: 0});
            this._isFabOpen = false;
        } else {
            console.log('tap');
            this.data.storage = {'language': 'EN'};
            var definitions = [];

            const btnEn = <View> this.en.nativeElement;
            const btnLt = <View> this.lt.nativeElement;
            const btnIt = <View> this.it.nativeElement;
            const btnGr = <View> this.gr.nativeElement;
            const background = <View> this.bg.nativeElement;
            var en = {
                target: btnEn,
                translate: {x: 0, y: -90},
                opacity: 1,
                duration: 280,
                delay: 0
            };
            var it = {
                target: btnIt,
                translate: {x: 0, y: -150},
                opacity: 1,
                duration: 280,
                delay: 0
            };
            var lt = {
                target: btnLt,
                translate: {x: 0, y: -280},
                opacity: 1,
                duration: 280,
                delay: 0
            };
            var gr = {
                target: btnGr,
                translate: {x: 0, y: -220},
                opacity: 1,
                duration: 280,
                delay: 0
            };

            var bg = {
                target: background,
                opacity: 0.5,
                duration: 280,
                delay: 0
            };
            definitions.push(bg);
            definitions.push(en);
            definitions.push(it);
            definitions.push(lt);
            definitions.push(gr);


            var animationSet = new Animation(definitions);
            animationSet.play().then(() => {
                console.log('Animation completed!');
            }).catch((e) => {
                console.log(e.message);
            });
            this._isFabOpen = true;
        }
    }

    tap(args: GestureEventData, languageCode: any) {
        this.data.storage = {'language': this.languages[languageCode]};
        console.log(this.data.storage);
        const btnEn = <View> this.en.nativeElement;
        btnEn.animate({translate: {x: 0, y: 0}, opacity: 0, duration: 280, delay: 0});

        const btnLt = <View> this.lt.nativeElement;
        btnLt.animate({translate: {x: 0, y: 0}, opacity: 0, duration: 280, delay: 0});

        const btnIt = <View> this.it.nativeElement;
        btnIt.animate({translate: {x: 0, y: 0}, opacity: 0, duration: 280, delay: 0});

        const btnGr = <View> this.gr.nativeElement;
        btnGr.animate({translate: {x: 0, y: 0}, opacity: 0, duration: 280, delay: 0});
        const background = <View> this.bg.nativeElement;
        background.animate({opacity: 1, duration: 280, delay: 0});
        this._isFabOpen = false;
    }

    ngOnInit() {
        super.ngOnInit();
    }
}

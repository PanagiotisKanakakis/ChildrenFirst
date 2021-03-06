import {AfterContentInit, Component, OnInit} from '@angular/core';
import {Device, Enums, GestureEventData, Page} from '@nativescript/core';
import {RouterExtensions} from '@nativescript/angular';
import {ActivatedRoute, NavigationExtras} from '@angular/router';
import {AppComponent} from '@src/app/app.component';
import {Data} from '@src/app/domain/Data';
import {File, knownFolders, path} from 'tns-core-modules/file-system';
import DeviceType = Enums.DeviceType;

@Component({
    selector: 'app-feedback',
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent extends AppComponent implements OnInit, AfterContentInit {

    public characterSrc: string;
    public feedback: string;
    public description: string;
    public score: string;
    public text: string;
    public replayScenarioText: string;
    public next: string;
    public summaryLabel: string;
    public playAgainButtonText: string;
    private REDIRECT_ROUTE = ['/characters'];

    constructor(public page: Page,
                public router: RouterExtensions,
                private activatedroute: ActivatedRoute,
                private data: Data) {
        super(page, router);
        this.summaryLabel = this.data.storage.other["3"][this.data.storage['language']];
        this.playAgainButtonText = this.data.storage.other["4"][this.data.storage['language']];
        this.replayScenarioText = this.data.storage.other["5"][this.data.storage['language']];
    }

    ngOnInit(): void {
    }

    ngAfterContentInit() {
        this.characterSrc = this.data.storage.characterSrc;
        this.score = 'YOUR SCORE: ' + this.data.storage.score;
        this.description = this.normalizeGreek(this.data.storage.description);
        this.feedback = this.normalizeGreek(this.data.storage.feedback);
        this.next = encodeURI(`${knownFolders.currentApp().path}/assets/images/continue.png`);
        this.addDescription();
        if (Device.deviceType === DeviceType.Tablet) {
            this.page.className = 'tablet';
            const pageCss = path.join(encodeURI(`${knownFolders.currentApp().path}/assets/tablet.css`));
            let css = File.fromPath(pageCss).readTextSync(() => {});
            this.page.addCss(css);
        }
    }

    onReplayScenarioTap(args: GestureEventData) {
        console.log(this.data)
        this.router.navigate(['/dialogs'], {clearHistory: true} as NavigationExtras);
    }

    onPlayAgainTap(args: GestureEventData) {
        this.router.navigate(this.REDIRECT_ROUTE, {clearHistory: true} as NavigationExtras);
    }

    onNextTap(args: GestureEventData) {
        this.text = this.feedback;
        let button = this.page.getViewById('nextButton');
        button.set('visibility', 'collapse');
        button = this.page.getViewById('playAgainButton');
        button.set('visibility', '');
    }

    private addDescription() {

        if(this.description.localeCompare("") != 0){
            this.text = this.description;

            if(this.feedback == null){
                let button = this.page.getViewById('nextButton');
                button.set('visibility', 'collapse');
                button = this.page.getViewById('playAgainButton');
                button.set('visibility', '');
            }else{
                const button = this.page.getViewById('playAgainButton');
                button.set('visibility', 'collapse');
            }
        }else{
            this.text = this.feedback;
            const button = this.page.getViewById('nextButton');
            button.set('visibility', 'collapse');
        }
    }
}

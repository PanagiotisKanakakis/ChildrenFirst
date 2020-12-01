import {AfterContentInit, Component, OnInit} from '@angular/core';
import {GestureEventData, Page} from '@nativescript/core';
import {RouterExtensions} from '@nativescript/angular';
import {ActivatedRoute, NavigationExtras} from '@angular/router';
import {AppComponent} from '@src/app/app.component';
import {Data} from '@src/app/domain/Data';

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
    public comment: string;
    private REDIRECT_ROUTE = ['/characters'];

    constructor(public page: Page,
                public router: RouterExtensions,
                private activatedroute: ActivatedRoute,
                private data: Data) {
        super(page, router);
        console.log(data);
    }

    ngOnInit(): void {
    }

    ngAfterContentInit() {
        this.characterSrc = this.data.storage.avatar;
        this.score = 'YOUR SCORE: ' + this.data.storage.score;
        this.description = this.data.storage.description;
        this.feedback = this.data.storage.feedback;
        this.addDescription();
    }

    onPlayAgainTap(args: GestureEventData) {
        this.router.navigate(this.REDIRECT_ROUTE, {clearHistory: true} as NavigationExtras);
    }

    onNextTap(args: GestureEventData) {
        this.comment = this.feedback;
        let button = this.page.getViewById('nextButton');
        button.set('visibility', 'collapse');
        button = this.page.getViewById('playAgainButton');
        button.set('visibility', '');
    }

    private addDescription() {
        if (this.feedback.localeCompare("") != 0) {
            this.comment = this.description;
            const button = this.page.getViewById('playAgainButton');
            button.set('visibility', 'collapse');
        } else {
            this.comment = this.feedback;
            const button = this.page.getViewById('nextButton');
            button.set('visibility', 'collapse');
        }
    }
}

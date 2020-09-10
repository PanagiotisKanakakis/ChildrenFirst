import {Component, OnInit} from '@angular/core';
import {GestureEventData, Page} from '@nativescript/core';
import {RouterExtensions} from '@nativescript/angular';
import {ActivatedRoute} from '@angular/router';
import {AppComponent} from '@src/app/app.component';

@Component({
    selector: 'app-score',
    templateUrl: './score.component.html',
    styleUrls: ['./score.component.css']
})
export class ScoreComponent extends AppComponent implements OnInit {

    public characterSrc: string;

    constructor(public page: Page,
                public router: RouterExtensions,
                private activatedroute: ActivatedRoute) {
        super(page, router);
    }

    ngOnInit(): void {
    }

    onTap(args: GestureEventData) {

    }

}

import {AfterContentInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AppComponent} from '@src/app/app.component';
import {Device, Enums, GestureEventData, GridLayout, HorizontalAlignment, Image, Page, ScrollView, StackLayout} from '@nativescript/core';
import {RouterExtensions} from '@nativescript/angular';
import {File, knownFolders, path} from 'tns-core-modules/file-system';
import {LabelPayload} from '@src/app/pages/dialogs/labelPayload';
import {Data} from '@src/app/domain/Data';
import {Animation} from '@nativescript/core/ui/animation';
import {style, transition, trigger, animate} from '@angular/animations';
import DeviceType = Enums.DeviceType;

enum State {
    OnDescription,
    OnStatements,
    OnQuestion,
    OnAnswer,
    OnEnding,
    OnFinal
}

enum Position {
    Left,
    Right
}

var sqlite = require('nativescript-sqlite');




@Component({
    selector: 'app-dialogs',
    templateUrl: './dialogs.component.html',
    styleUrls: ['./dialogs.component.css'],
    animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({opacity: '0'}),
                animate('.5s ease-out', style({opacity: '1'})),
            ]),
        ]),
    ]
})
export class DialogsComponent extends AppComponent implements OnInit, AfterContentInit {

    public rightChar: string;
    public leftChar: string;
    public scoreText: string;
    private score: number;
    public background: string;
    private stackLayout: StackLayout;
    private gridLayout: GridLayout;
    labels: LabelPayload[];
    @ViewChild('dialogsContent') gridContent: ElementRef;
    private state: State;
    private payload = {};
    private language;
    private FEEDBACK_ROUTE = '/feedback';
    private bubble: any;
    public isInDialog: any;
    public next: any;
    private maxScore: any;
    public scroll: ScrollView;

    constructor(public page: Page,
                public router: RouterExtensions,
                private data: Data) {
        super(page, router);
        this.language = this.data.storage.language;
        this.maxScore = 0;
        new sqlite(encodeURI(path.join(`${knownFolders.currentApp().path}/assets/chf.db`))).then(db => {
            db.resultType(sqlite.RESULTSASOBJECT);
            db.all('SELECT * FROM payload p , stories s where p.STORY_ID = s.STORY_ID and' +
                ' p.STORY_ID = ?', [this.data.storage.storyID]).then(rows => {
                this.background = encodeURI(`${knownFolders.currentApp().path}` + rows[0]['BD']);
                this.rightChar = encodeURI(`${knownFolders.currentApp().path}` + rows[0]['RC']);
                this.leftChar = encodeURI(`${knownFolders.currentApp().path}` + rows[0]['LC']);
                for (let row in rows) {
                    this.payload[rows[row]['PAYLOAD_ID']] = rows[row];
                }
            });
        }, error => {
            console.log('Failed to connect to db!', error);
        });
        this.score = 0;
        this.scoreText = '0%';

    }

    ngOnInit(): void {
        this.scroll = <ScrollView>this.page.getViewById('scroll');
        this.stackLayout = <StackLayout>this.page.getViewById('dialogs-content');
        this.gridLayout = <GridLayout>this.page.getViewById('grid');
        this.stackLayout.className = 'centerAlignment';
        this.gridLayout.backgroundImage = encodeURI(this.background);
        this.gridLayout.className = 'dialog-background';
        this.next = encodeURI(`${knownFolders.currentApp().path}/assets/images/continue.png`);
    }

    ngAfterContentInit() {
        this.labels = new Array<LabelPayload>();
        let source = this.payload['D1'];
        this.labels.push({
            state: source['STATE'],
            score: source['SCORE'], text: this.normalizeGreek(source[this.language]), 'id': 'D1'
        });
        this.bubble = false;
        this.state = State.OnDescription;
        if (Device.deviceType === DeviceType.Tablet) {
            this.page.className = 'tablet';
            const pageCss = path.join(encodeURI(`${knownFolders.currentApp().path}/assets/tablet.css`));
            let css = File.fromPath(pageCss).readTextSync(() => {});
            this.page.addCss(css);
        }
    }

    onImageTap(args: GestureEventData, payloadId: string) {
        if (this.state == State.OnQuestion) {
            this.score += parseInt(this.payload[payloadId]['SCORE']);
            this.scoreText = Math.floor((this.score / 60) * 100) + '%';
            this.animate(payloadId);
        }
    }

    onContinueTap(args: GestureEventData) {
        this.animate(this.labels[0].id);
    }

    private updateDialog(sourceId: string) {
        this.labels = new Array<LabelPayload>();
        let source = this.payload[sourceId];
        this.state = source['STATE'];
        for (var target of source['LEADS_TO'].split(',')) {
            const src = this.payload[target];
            if (src['STATE'] == State.OnDescription) {
                this.labels.push({
                    state: src['STATE'], score: src['SCORE'], text: this.normalizeGreek(src[this.language]), 'id': target
                });
            } else if (src['STATE'] == State.OnEnding) {
                if (target === 'E1' && this.score >= 0 && this.score <= 20) {
                    this.labels.push({
                        state: src['STATE'], score: src['SCORE'],
                        text: this.normalizeGreek(src[this.language]), 'id': target
                    });
                    this.updateAvatar(src);
                } else if (target === 'E2' && this.score >= 21 && this.score <= 30) {
                    this.labels.push({
                        state: src['STATE'], score: src['SCORE'],
                        text: this.normalizeGreek(src[this.language]), 'id': target
                    });
                    this.updateAvatar(src);
                } else if (target === 'E3' && this.score >= 31) {
                    this.labels.push({
                        state: src['STATE'], score: src['SCORE'],
                        text: this.normalizeGreek(src[this.language]), 'id': target
                    });
                    this.updateAvatar(src);
                }
            } else if (src['STATE'] == State.OnFinal) {
                this.data.storage['description'] = this.normalizeGreek(src[this.language]);
                this.data.storage['feedback'] = this.payload[src['LEADS_TO']][this.language];
                this.moveToFeedbackPage(src);
            } else {
                this.labels.push({
                    state: src['STATE'], score: src['SCORE'],
                    text: this.normalizeGreek(src[this.language]), 'id': target
                });
                this.updateAvatar(src);
            }
        }
        // this.updateCss(sourceId);
    }

    private changeContinueButtonVisibility() {
        if (this.state == State.OnQuestion) {
            const button = this.page.getViewById('button');
            button.set('visibility', 'collapse');
        }
        if (this.state == State.OnAnswer) {
            const button = this.page.getViewById('button');
            button.set('visibility', '');
        }
    }

    private updateAvatar(source: any) {
        if (source['STATE'] == State.OnQuestion || source['STATE'] == State.OnStatements ||
            source['STATE'] == State.OnEnding || source['STATE'] == State.OnFinal) {
            this.rightChar = encodeURI(`${knownFolders.currentApp().path}` + source['AVATAR']);
        }
    }

    private moveToFeedbackPage(source: any) {
        if (source['STATE'] == State.OnFinal) {
            this.data.storage['score'] = this.score;
            this.router.navigate([this.FEEDBACK_ROUTE]);
        }
    }

    private animate(payloadId: any) {
        let rightImage = <Image>this.page.getViewById('right');
        let leftImage = <Image>this.page.getViewById('left');
        var definitions = [];
        var payload = this.payload[payloadId];


        for (var target of payload['LEADS_TO'].split(',')) {
            const src = this.payload[target];
            if (src['STATE'] == State.OnDescription || src['STATE'] == State.OnFinal) {
                this.bubble = false;
                var nonBlur = {
                    target: rightImage,
                    opacity: 1,
                    duration: 1000
                };
                var blur = {
                    target: leftImage,
                    opacity: 1,
                    duration: 1000
                };
            } else if (src['STATE'] == State.OnQuestion) {
                this.bubble = true;
                var blur = {
                    target: rightImage,
                    opacity: 1,
                    duration: 1000
                };
                var nonBlur = {
                    target: leftImage,
                    opacity: 0.2,
                    duration: 1000
                };
            } else if (src['STATE'] == State.OnAnswer) {
                this.bubble = true;
                var nonBlur = {
                    target: rightImage,
                    opacity: 0.2,
                    duration: 1000
                };
                var blur = {
                    target: leftImage,
                    opacity: 1,
                    duration: 1000
                };
                break;
            } else if (src['STATE'] == State.OnStatements || src['STATE'] == State.OnEnding) {
                console.log(src['AVATAR_TALKING']);
                if (src['AVATAR_TALKING'] == Position.Left) {
                    this.bubble = true;
                    var blur = {
                        target: rightImage,
                        opacity: 0.2,
                        duration: 1000
                    };
                    var nonBlur = {
                        target: leftImage,
                        opacity: 1,
                        duration: 1000
                    };
                } else if (src['AVATAR_TALKING'] == Position.Right) {
                    this.bubble = true;
                    var nonBlur = {
                        target: rightImage,
                        opacity: 1,
                        duration: 1000
                    };
                    var blur = {
                        target: leftImage,
                        opacity: 0.2,
                        duration: 1000
                    };
                } else {
                    this.bubble = false;
                    var nonBlur = {
                        target: rightImage,
                        opacity: 1,
                        duration: 1000
                    };
                    var blur = {
                        target: leftImage,
                        opacity: 1,
                        duration: 1000
                    };
                }
            }
        }

        definitions.push(blur);
        definitions.push(nonBlur);

        var animationSet = new Animation(definitions);
        animationSet.play().then(() => {
            this.updateDialog(payloadId);
            this.isInDialog = this.bubble;
            this.changeContinueButtonVisibility();
            // this.updateCss(payloadId);
        }).catch((e) => {
            console.log(e.message);
        });

    }

}

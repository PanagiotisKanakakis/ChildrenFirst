import {AfterContentInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AppComponent} from '@src/app/app.component';
import {Enums, GestureEventData, HorizontalAlignment, Image, Page, StackLayout} from '@nativescript/core';
import {RouterExtensions} from '@nativescript/angular';
import {knownFolders, path} from 'tns-core-modules/file-system';
import {LabelPayload} from '@src/app/pages/dialogs/labelPayload';
import {Data} from '@src/app/domain/Data';
import {Animation} from '@nativescript/core/ui/animation';
import {style, transition, trigger, animate} from '@angular/animations';

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
                style({ opacity: '0' }),
                animate('.5s ease-out', style({ opacity: '1' })),
            ]),
        ]),
    ]
})
export class DialogsComponent extends AppComponent implements OnInit, AfterContentInit {

    public rightChar: string;
    public leftChar: string;
    public scoreText: string;
    private score: number;
    private background: string;
    private stackLayout: StackLayout;
    labels: LabelPayload[];
    @ViewChild('dialogsContent')
    gridContent: ElementRef;
    private state: State;
    private payload = {};
    private language;
    private FEEDBACK_ROUTE = '/feedback';
    private bubble: any;
    public next: any;

    constructor(public page: Page,
                public router: RouterExtensions,
                private data: Data) {
        super(page, router);
        this.language = this.data.storage.language;
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
        this.page.backgroundImage = encodeURI(this.background);
        this.page.className = 'dialog-background';
        this.stackLayout = <StackLayout> this.page.getViewById('dialogs-content');
        this.stackLayout.className = 'centerAlignment';
        this.next = encodeURI(`${knownFolders.currentApp().path}/assets/images/continue.png`);
    }

    ngAfterContentInit() {
        this.labels = new Array<LabelPayload>();
        let source = this.payload['D1'];
        this.labels.push({
            state: source['STATE'],
            score: source['SCORE'], text: source[this.language], 'id': 'D1'
        });
        this.bubble = false;
        this.state = State.OnDescription;
    }

    onImageTap(args: GestureEventData, payloadId: string) {
        if (this.state == State.OnQuestion) {
            this.score += parseInt(this.payload[payloadId]['SCORE']);
            this.scoreText = Math.floor((this.score / 45) * 100) + '%';
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
                    state: src['STATE'], score: src['SCORE'], text: src[this.language], 'id': target
                });
            } else if (src['STATE'] == State.OnEnding) {
                if (target === 'E1' && this.score >= 0 && this.score <= 20) {
                    this.labels.push({
                        state: src['STATE'], score: src['SCORE'],
                        text: src[this.language], 'id': target
                    });
                    this.updateAvatar(src);
                } else if (target === 'E2' && this.score >= 21 && this.score <= 30) {
                    this.labels.push({
                        state: src['STATE'], score: src['SCORE'],
                        text: src[this.language], 'id': target
                    });
                    this.updateAvatar(src);
                } else if (target === 'E3' && this.score >= 31) {
                    this.labels.push({
                        state: src['STATE'], score: src['SCORE'],
                        text: src[this.language], 'id': target
                    });
                    this.updateAvatar(src);
                }
            } else if (src['STATE'] == State.OnFinal) {
                this.data.storage['description'] = src[this.language];
                this.data.storage['feedback'] = this.payload[src['LEADS_TO']][this.language];
                this.moveToFeedbackPage(src);
            } else {
                this.labels.push({
                    state: src['STATE'], score: src['SCORE'],
                    text: src[this.language], 'id': target
                });
                this.updateAvatar(src);
            }
        }
        this.updateCss(sourceId);
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
            if (source['AVATAR_POSTITION'] == Position.Left) {
                this.leftChar = encodeURI(`${knownFolders.currentApp().path}` + source['AVATAR']);
            } else {
                this.rightChar = encodeURI(`${knownFolders.currentApp().path}` + source['AVATAR']);
            }
        }
    }

    private moveToFeedbackPage(source: any) {
        if (source['STATE'] == State.OnFinal) {
            this.data.storage['score'] = this.score;
            this.router.navigate([this.FEEDBACK_ROUTE]);
        }
    }

    private animate(payloadId: any) {
        let rightImage = <Image> this.page.getViewById('right');
        let leftImage = <Image> this.page.getViewById('left');
        var definitions = [];
        var payload = this.payload[payloadId];

        if (payload['STATE'] == State.OnQuestion) {
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
        } else if (payload['LEADS_TO'].includes('E') || payload['LEADS_TO'].includes('D')
            || payload['LEADS_TO'].includes('F')
            || payload['AVATAR_POSTITION'] === null) {
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
        } else if (payload['AVATAR_POSTITION'] != Position.Left){
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
        } else if (payload['AVATAR_POSTITION'] != Position.Right) {
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
        }
        definitions.push(blur);
        definitions.push(nonBlur);

        var animationSet = new Animation(definitions);
        animationSet.play().then(() => {
            this.updateDialog(payloadId);
            this.changeContinueButtonVisibility();
        }).catch((e) => {
            console.log(e.message);
        });
    }

    private updateCss(payloadId: any) {
        var payload = this.payload[payloadId];
        if (payload['STATE'] == State.OnQuestion) {
            this.bubble = true;
        } else if (payload['LEADS_TO'].includes('E') || payload['LEADS_TO'].includes('D')
            || payload['LEADS_TO'].includes('F')
            || payload['AVATAR_POSTITION'] === null) {
            this.bubble = false;
        } else if (payload['AVATAR_POSTITION'] != Position.Left){
            this.bubble = true;
        } else if (payload['AVATAR_POSTITION'] != Position.Right) {
            this.bubble = true;
        }
    }
}

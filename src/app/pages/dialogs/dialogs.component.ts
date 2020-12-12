import {AfterContentInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AppComponent} from '@src/app/app.component';
import {Enums, GestureEventData, Page, StackLayout} from '@nativescript/core';
import {ActivatedRoute} from '@angular/router';
import {RouterExtensions} from '@nativescript/angular';
import {File, knownFolders, path} from 'tns-core-modules/file-system';
import {ImagePayload} from '@src/app/pages/dialogs/imagePayload';
import {Data} from '@src/app/domain/Data';
import integer = Enums.KeyboardType.integer;

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

@Component({
    selector: 'app-dialogs',
    templateUrl: './dialogs.component.html',
    styleUrls: ['./dialogs.component.css']
})
export class DialogsComponent extends AppComponent implements OnInit, AfterContentInit {

    public rightChar: string;
    public leftChar: string;
    public scoreText: string;
    private currentQuestion;
    private score: number;
    private background: string;
    private stackLayout: StackLayout;
    images: ImagePayload[];
    @ViewChild('dialogsContent')
    gridContent: ElementRef;
    private state: State;
    private payload = {};
    private FEEDBACK_ROUTE = '/feedback';

    size = [this.random(), this.random(), this.random()];
    progress = [this.random(0, 100), this.random(0, 100), this.random(0, 100)];


    constructor(public page: Page,
                public router: RouterExtensions,
                private data: Data,
                private activatedroute: ActivatedRoute) {
        super(page, router);
        this.activatedroute.params.subscribe(data => {
            const filePath = encodeURI(path.join(`${knownFolders.currentApp().path}/assets/images/characters/` + data['id'] + '/dialog.json'));
            const text = File.fromPath(filePath).readTextSync(() => {
            });
            this.payload = JSON.parse(text).payload;
            this.background = JSON.parse(text).Background;
            this.rightChar = encodeURI(`${knownFolders.currentApp().path}` + JSON.parse(text).rightChar);
            this.leftChar = encodeURI(`${knownFolders.currentApp().path}` + JSON.parse(text).leftChar);
        });
        this.score = 0;
        this.scoreText = "0%";
    }

    ngOnInit(): void {
        this.page.backgroundImage = encodeURI(`${knownFolders.currentApp().path}` + this.background);
        this.page.className = 'dialog-background';
        this.stackLayout = <StackLayout> this.page.getViewById('dialogs-content');
        this.stackLayout.className = 'centerAlignment';
    }

    ngAfterContentInit() {
        this.images = new Array<ImagePayload>();
        let source = this.payload['D1'];
        const imageSource = encodeURI(path.join(`${knownFolders.currentApp().path}` + source['path']));
        this.images.push({state: source['state'], x: source['x'], y: source['y'], score: source['score'], src: imageSource, 'id': 'D1'});
        this.state = State.OnDescription;
    }

    onImageTap(args: GestureEventData, payloadId: string) {
        if (this.state == State.OnQuestion) {
            this.score += this.payload[payloadId].score;
            this.scoreText = Math.floor((this.score/45)*100) + "%";
            this.updateDialog(payloadId);
            this.changeContinueButtonVisibility();
        }
    }

    onContinueTap(args: GestureEventData) {
        this.updateDialog(this.images[0].id);
        this.changeContinueButtonVisibility();
    }

    private updateDialog(sourceId: string) {
        this.images = new Array<ImagePayload>();
        let source = this.payload[sourceId];
        this.state = source['state'];
        for (var target of source['leadsTo']) {
            const src = this.payload[target];
            if (src['state'] == State.OnDescription) {
                const imageSource = encodeURI(path.join(`${knownFolders.currentApp().path}` + src['path']));
                this.images.push({state: src['state'], x: src['x'], y: src['y'], score: src['score'], src: imageSource, 'id': target});
            } else if (src['state'] == State.OnEnding) {
                if(target === 'E1' && this.score >=0 && this.score <= 20){
                    const imageSource = encodeURI(path.join(`${knownFolders.currentApp().path}` + src['path']));
                    this.images.push({state: src['state'], x: src['x'], y: src['y'], score: src['score'], src: imageSource, 'id': target});
                    this.updateAvatar(src);
                }else if(target === 'E2' && this.score >=21 && this.score <= 30){
                    const imageSource = encodeURI(path.join(`${knownFolders.currentApp().path}` + src['path']));
                    this.images.push({state: src['state'], x: src['x'], y: src['y'], score: src['score'], src: imageSource, 'id': target});
                    this.updateAvatar(src);
                }else if(target === 'E3' && this.score >=31){
                    const imageSource = encodeURI(path.join(`${knownFolders.currentApp().path}` + src['path']));
                    this.images.push({state: src['state'], x: src['x'], y: src['y'], score: src['score'], src: imageSource, 'id': target});
                    this.updateAvatar(src);
                }
            }else if(src['state'] == State.OnFinal){
                this.moveToFeedbackPage(src);
            } else {
                const imageSource = encodeURI(path.join(`${knownFolders.currentApp().path}` + src['path']));
                this.images.push({state: src['state'], x: src['x'], y: src['y'], score: src['score'], src: imageSource, 'id': target});
                this.updateAvatar(src);
            }
        }
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
        if (source['state'] == State.OnQuestion || source['state'] == State.OnStatements ||
            source['state'] == State.OnEnding || source['state'] == State.OnFinal) {
            if (source['avatarPosition'] == Position.Left) {
                this.leftChar = encodeURI(`${knownFolders.currentApp().path}` + source['avatar']);
            } else {
                this.rightChar = encodeURI(`${knownFolders.currentApp().path}` + source['avatar']);
            }
        }
    }

    private moveToFeedbackPage(source: any) {
        if (source['state'] == State.OnFinal) {
            this.data.storage = {"avatar": this.leftChar,"score":this.score,"description":source['description'],"feedback":source['feedback']};
            this.router.navigate([this.FEEDBACK_ROUTE]);
        }
    }

    random(min = 50, max = 150) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

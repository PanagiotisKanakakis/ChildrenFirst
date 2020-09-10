import {AfterContentInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AppComponent} from '@src/app/app.component';
import {GestureEventData, Image, Page, StackLayout} from '@nativescript/core';
import {ActivatedRoute} from '@angular/router';
import {RouterExtensions} from '@nativescript/angular';
import {File, knownFolders, path} from 'tns-core-modules/file-system';
import {Answer} from '@src/app/pages/dialogs/answer';

@Component({
    selector: 'app-dialogs',
    templateUrl: './dialogs.component.html',
    styleUrls: ['./dialogs.component.css']
})
export class DialogsComponent extends AppComponent implements OnInit, AfterContentInit {

    private questionsPayload = {};
    private answersPayload = {};
    public rightChar: string;
    public leftChar: string;
    private payload = [];
    private currentQuestion;
    private score: number;
    private background: string;
    private stackLayout: StackLayout;

    answers: Answer[];
    @ViewChild('dialogsContent')
    gridContent: ElementRef;

    constructor(public page: Page,
                public router: RouterExtensions,
                private activatedroute: ActivatedRoute) {
        super(page, router);
        this.activatedroute.params.subscribe(data => {
            const filePath = encodeURI(path.join(`${knownFolders.currentApp().path}/assets/dialogs/` + data['id'] + '/dialog.json'));
            const text = File.fromPath(filePath).readTextSync(() => {
            });
            this.payload.push(JSON.parse(text).description);
            this.questionsPayload = JSON.parse(text).Questions;
            this.answersPayload = JSON.parse(text).Answers;
            this.background = JSON.parse(text).background;
            for (const value of JSON.parse(text).statements) {
                this.payload.push(value);
            }
            console.log(this.answersPayload);
            this.rightChar = encodeURI(`${knownFolders.currentApp().path}` + JSON.parse(text).rightChar);
            this.leftChar = encodeURI(`${knownFolders.currentApp().path}` + JSON.parse(text).leftChar);
        });
        this.score = 0;
    }

    ngOnInit(): void {
        this.page.backgroundImage = encodeURI(`${knownFolders.currentApp().path}` + this.background);
        this.page.className = 'dialog-background';
        this.stackLayout = <StackLayout> this.page.getViewById('dialogs-content');
        this.stackLayout.className = 'centerAlignment';
    }

    ngAfterContentInit() {
        const image = <Image> this.page.getViewById('image');
        const src = this.payload.shift();
        image.src = encodeURI(path.join(`${knownFolders.currentApp().path}` + src));
    }

    onTap(args: GestureEventData) {
        const image = <Image> this.page.getViewById('image');
        const src = this.payload.shift();
        if (src != undefined) {
            image.animate({
                opacity: 0,
                duration: 1000
            }).then(() => {
                image.src = encodeURI(path.join(`${knownFolders.currentApp().path}` + src));
                image.animate({
                    opacity: 1,
                    duration: 1000
                });
            });
        } else {
            this.currentQuestion = this.questionsPayload['Q1'];
            image.animate({
                opacity: 0,
                duration: 1000
            }).then(() => {
                this.changeContinueButton();
                image.src = encodeURI(path.join(`${knownFolders.currentApp().path}` + this.currentQuestion['path']));
                image.animate({
                    opacity: 1,
                    duration: 1000
                });
            });
        }
    }

    onTapQuestion(args: GestureEventData) {
        const image = <Image> this.page.getViewById('image');
        image.animate({
            opacity: 0,
            duration: 1000
        }).then(() => {
            const image = <Image> this.page.getViewById('image');
            image.set('visibility', 'collapse');
            this.answers = new Array<Answer>();
            for (var answerId of this.currentQuestion['leadsTo']) {
                const answer = this.answersPayload[answerId];
                const answerSource = encodeURI(path.join(`${knownFolders.currentApp().path}` + answer['path']));
                this.answers.push({x: answer['x'], y: answer['y'], score: answer['score'], src: answerSource, 'id': answerId});
            }
            const buttonQuestion = <Image> this.page.getViewById('buttonQuestion');
            buttonQuestion.set('visibility', 'collapse');
        });
    }

    answerTap(args: GestureEventData, answerId: number) {
        console.log(answerId);
        this.score += this.answersPayload[answerId].score;
        this.answers = [];
        const buttonQuestion = <Image> this.page.getViewById('buttonQuestion');
        buttonQuestion.set('visibility', '');
        const image = <Image> this.page.getViewById('image');
        console.log(this.answersPayload[answerId].leadsTo[0]);
        this.currentQuestion = this.questionsPayload[this.answersPayload[answerId].leadsTo[0]];
        image.src = encodeURI(path.join(`${knownFolders.currentApp().path}` + this.currentQuestion['path']));
        image.animate({
            opacity: 1,
            duration: 1000
        }).then(() => {
        });
    }

    private changeContinueButton() {
        const button = <Image> this.page.getViewById('button');
        button.set('visibility', 'collapse');
        const buttonQuestion = <Image> this.page.getViewById('buttonQuestion');
        buttonQuestion.set('visibility', '');
    }
}

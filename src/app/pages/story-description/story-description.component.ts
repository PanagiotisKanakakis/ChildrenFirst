import {Component, OnInit} from '@angular/core';
import {GestureEventData, Page} from '@nativescript/core';
import {RouterExtensions} from '@nativescript/angular';
import {Data} from '@src/app/domain/Data';
import {AppComponent} from '@src/app/app.component';
import {knownFolders} from 'tns-core-modules/file-system';

@Component({
    selector: 'app-story-description',
    templateUrl: './story-description.component.html',
    styleUrls: ['./story-description.component.css']
})
export class StoryDescriptionComponent extends AppComponent implements OnInit {

    public playerName: any;
    public characterSrc: any;
    public storyDescription: any;
    public next: any;
    public back: string;

    constructor(
        public page: Page,
        public router: RouterExtensions,
        private data: Data
    ) {
        super(page, router);
    }


    ngOnInit(): void {
        this.playerName = this.data.storage.name;
        this.characterSrc = this.data.storage.characterSrc;
        this.storyDescription = this.data.storage.storyDescription;
        this.next = encodeURI(`${knownFolders.currentApp().path}/assets/images/continue.png`);
        this.back = encodeURI(`${knownFolders.currentApp().path}/assets/images/back.png`);

    }

    onContinueTap(args: GestureEventData) {
        this.router.navigate(['/dialogs'], {replaceUrl: true});
    }

    onBackTap(args: GestureEventData) {
        this.router.navigate(['/characters'], {replaceUrl: true});
    }

}

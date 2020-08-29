import {AfterContentInit, Component, OnInit} from '@angular/core';
import {AppComponent} from '@src/app/app.component';
import {Builder, GridLayout, ItemSpec, Page} from '@nativescript/core';
import {ActivatedRoute} from '@angular/router';
import {RouterExtensions} from '@nativescript/angular';
import {File, knownFolders, path} from 'tns-core-modules/file-system';
import {GridUnitType} from '@nativescript/core/ui/layouts/grid-layout';

@Component({
    selector: 'app-dialogs',
    templateUrl: './dialogs.component.html',
    styleUrls: ['./dialogs.component.css']
})
export class DialogsComponent extends AppComponent implements OnInit, AfterContentInit {

    private dialog;
    public characterSrc: string;

    constructor(public page: Page,
                public router: RouterExtensions,
                private activatedroute: ActivatedRoute) {
        super(page, router);
        this.activatedroute.params.subscribe(data => {
            const setting = 'school';
            const filePath = encodeURI(path.join(`${knownFolders.currentApp().path}/assets/dialogs/` + data["id"] + '/' + setting + '/dialog.json'));
            const text = File.fromPath(filePath).readTextSync(() => {
            });
            this.dialog = JSON.parse(text);
        });
        this.characterSrc = encodeURI(`${knownFolders.currentApp().path}/assets/images/character-selection/circle-character.png`);
    }

    ngOnInit(): void {
    }

    ngAfterContentInit() {

    }

}

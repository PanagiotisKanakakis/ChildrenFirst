import {AfterContentInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Builder, ContentView, GestureEventData, GridLayout, ItemSpec, Page, SwipeGestureEventData} from '@nativescript/core';
import {Screen} from '@nativescript/core/platform';
import {File, knownFolders, path} from 'tns-core-modules/file-system';
import {GridUnitType} from '@nativescript/core/ui/layouts/grid-layout';
import {Animation} from '@nativescript/core/ui/animation';
import {AppComponent} from '@src/app/app.component';
import {RouterExtensions} from '@nativescript/angular';
import {Data} from '@src/app/domain/Data';

const xml2js = require('xml2js');
var sqlite = require('nativescript-sqlite');


@Component({
    selector: 'app-character-selection',
    templateUrl: './character-selection.component.html',
    styleUrls: ['./character-selection.component.css']
})
export class CharacterSelectionComponent extends AppComponent implements AfterContentInit {

    currentSlideNum: number = 0;
    private slideCount = 16;
    private screenWidth;
    private slidesView: GridLayout;
    private languageCode;
    @ViewChild('slideContent')
    slideElement: ElementRef;

    private slideView: ContentView;
    private REDIRECT_ROUTE = '/story-description';
    private characters: Array<any>;

    constructor(
        public page: Page,
        public router: RouterExtensions,
        private data: Data
    ) {
        super(page, router);
        this.screenWidth = Screen.mainScreen.widthDIPs;
        this.languageCode = this.data.storage.language;
        var character_column = 'CHARACTER_DESC_' + this.languageCode;
        var story_column = 'STORY_DESC_' + this.languageCode;
        new sqlite(encodeURI(path.join(`${knownFolders.currentApp().path}/assets/chf.db`))).then(db => {
            db.resultType(sqlite.RESULTSASOBJECT);
            db.all('SELECT * FROM stories').then(rows => {
                this.characters = [];
                for (var row in rows) {
                    this.characters.push({
                        'avatar': rows[row]['LC'],
                        'characterDESC': rows[row][character_column],
                        'storyDESC': rows[row][story_column],
                        'storyID': rows[row]['STORY_ID'],
                        'name': rows[row]['CHNAME']
                    });
                }
            });
        }, error => {
            console.log('Failed to connect to db!');
        });
    }


    ngAfterContentInit() {
        this.page.backgroundSpanUnderStatusBar = true;
        setTimeout(() => {
            this.slideView = this.slideElement.nativeElement;
            var row = new ItemSpec(1, GridUnitType.STAR);
            let gridLayout = new GridLayout();
            let i = 0;
            const slidePath = path.join(encodeURI(`${knownFolders.currentApp().path}/assets/slides/slide.html`));

            for (let counter in this.characters) {
                let res = File.fromPath(slidePath).readTextSync(() => {
                });
                let characterDESC = this.characters[counter]['characterDESC'];

                xml2js.parseString(res, {mergeAttrs: true}, (err, result) => {
                    if (err) {
                        throw err;
                    }
                    res = res.replace('chrname', this.characters[counter]['name']);
                    res = res.replace('character-description', characterDESC);
                    var imagePath = encodeURI(path.join(`${knownFolders.currentApp().path}` + this.characters[counter]['avatar']));
                    res = res.replace('characterSrc', imagePath);
                    var element = Builder.parse(res);
                    GridLayout.setColumn(element, 0);
                    if (i > 0) {
                        element.opacity = 0;
                    }
                    gridLayout.addChildAtCell(element, i, 0);
                    i++;
                });
            }
            gridLayout.addRow(row);
            this.slideView.content = (this.slidesView = gridLayout);
        }, 20);
    }

    onSwipe(args: SwipeGestureEventData) {
        let prevSlideNum = this.currentSlideNum;
        let count = this.slideCount;
        if (args.direction == 2) {
            this.currentSlideNum = (this.currentSlideNum + 1) % count;
        } else if (args.direction == 1) {
            this.currentSlideNum = (this.currentSlideNum - 1 + count) % count;
        } else {
            return;
        }
        const currSlide = this.slidesView.getChildAt(prevSlideNum);
        const nextSlide = this.slidesView.getChildAt(this.currentSlideNum);
        this.animate(currSlide, nextSlide, args.direction);
    }

    animate(currSlide, nextSlide, direction) {
        nextSlide.translateX = (direction == 2 ? this.screenWidth : -this.screenWidth);
        nextSlide.opacity = 1;
        var definitions = [];
        definitions.push({
            target: currSlide,
            translate: {x: (direction == 2 ? -this.screenWidth : this.screenWidth), y: 0},
            duration: 500
        });
        definitions.push({
            target: nextSlide,
            translate: {x: 0, y: 0},
            duration: 500
        });
        var animationSet = new Animation(definitions);
        animationSet.play().then(() => {
            console.log('Animation finished');
        }).catch((e) => {
            console.log(e.message);
        });
    }

    getSliderItemClass(item: number) {
        if (item == this.currentSlideNum) {
            return 'caro-item-dot caro-item-dot-selected';
        }
        return 'caro-item-dot';
    }

    onTap(args: GestureEventData) {
        this.data.storage = {
            'name': this.characters[this.currentSlideNum]['name'],
            'characterSrc': encodeURI(path.join(`${knownFolders.currentApp().path}` + this.characters[this.currentSlideNum]['avatar'])),
            'storyDescription': this.characters[this.currentSlideNum]['storyDESC'],
            'storyID': this.characters[this.currentSlideNum]['storyID'],
            'language': this.languageCode
        };
        this.router.navigate([this.REDIRECT_ROUTE], {replaceUrl: true});
    }
}

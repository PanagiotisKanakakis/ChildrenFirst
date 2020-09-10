import {AfterContentInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Builder, ContentView, GestureEventData, GridLayout, ItemSpec, Page, SwipeGestureEventData} from '@nativescript/core';
import {Screen} from '@nativescript/core/platform';
import {File, knownFolders, path} from 'tns-core-modules/file-system';
import {GridUnitType} from '@nativescript/core/ui/layouts/grid-layout';
import {Animation} from '@nativescript/core/ui/animation';
import {AppComponent} from '@src/app/app.component';
import {RouterExtensions} from '@nativescript/angular';
import {HttpClient} from '@angular/common/http';

const xml2js = require('xml2js');


@Component({
    selector: 'app-character-selection',
    templateUrl: './character-selection.component.html',
    styleUrls: ['./character-selection.component.css']
})
export class CharacterSelectionComponent extends AppComponent implements AfterContentInit {

    private slideFiles = ['slide1.html', 'slide2.html', 'slide3.html'];
    currentSlideNum: number = 0;
    private slideCount = 3;
    private screenWidth;
    private slidesView: GridLayout;

    @ViewChild('slideContent')
    slideElement: ElementRef;

    private slideView: ContentView;
    private REDIRECT_ROUTE = '/dialogs';

    private idToName = {};

    private nameToImagePath = {
        'Mimi': '/assets/images/characters/mimi.png',
        'Mary': '/assets/images/characters/character.png',
        'Helen': '/assets/images/characters/character.png'
    };

    constructor(
        public page: Page,
        public router: RouterExtensions,
        private http: HttpClient
    ) {
        super(page, router);
        this.screenWidth = Screen.mainScreen.widthDIPs;
    }


    ngAfterContentInit() {
        this.page.backgroundSpanUnderStatusBar = true;
        setTimeout(() => {
            this.slideView = this.slideElement.nativeElement;
            var row = new ItemSpec(1, GridUnitType.STAR);
            let gridLayout = new GridLayout();
            this.slideFiles.forEach((dataFile, i) => {
                const slidePath = path.join(encodeURI(`${knownFolders.currentApp().path}/assets/slides/`) + dataFile);
                var res = File.fromPath(slidePath).readTextSync(() => {
                });
                xml2js.parseString(res, {mergeAttrs: true}, (err, result) => {
                    if (err) {
                        throw err;
                    }
                    const json = JSON.stringify(result, null, 4);
                    var name = JSON.parse(json).GridLayout.GridLayout[0].Label[0].text[0];
                    this.idToName[i] = name;
                    console.log(i + '' + name);
                    var imagePath = encodeURI(path.join(`${knownFolders.currentApp().path}` + this.nameToImagePath[name]));
                    res = res.replace('characterSrc', imagePath);
                    var element = Builder.parse(res);
                    GridLayout.setColumn(element, 0);
                    if (i > 0) {
                        element.opacity = 0;
                    }
                    gridLayout.addChildAtCell(element, i, 0);
                });

            });
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
        console.log(this.idToName[prevSlideNum] + '->' + this.idToName[this.currentSlideNum]);
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
        var name = this.idToName[this.currentSlideNum];
        this.router.navigate([this.REDIRECT_ROUTE, name], {replaceUrl: true});
    }
}

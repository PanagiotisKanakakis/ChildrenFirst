import {AfterContentInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Builder, ContentView, GestureEventData, GridLayout, ItemSpec, Page, SwipeGestureEventData} from '@nativescript/core';
import {Screen} from '@nativescript/core/platform';
import {File, knownFolders, path} from 'tns-core-modules/file-system';
import {GridUnitType} from '@nativescript/core/ui/layouts/grid-layout';
import {Animation} from '@nativescript/core/ui/animation';
import {AppComponent} from '@src/app/app.component';
import {RouterExtensions} from '@nativescript/angular';

const xml2js = require('xml2js');


@Component({
    selector: 'app-character-selection',
    templateUrl: './character-selection.component.html',
    styleUrls: ['./character-selection.component.css']
})
export class CharacterSelectionComponent extends AppComponent implements AfterContentInit {

    private slideFiles = ['slide1.html', 'slide2.html', 'slide3.html'];
    currentSlideNum: number = 0;
    private slideCount = 16;
    private screenWidth;
    private slidesView: GridLayout;

    @ViewChild('slideContent')
    slideElement: ElementRef;

    private slideView: ContentView;
    private REDIRECT_ROUTE = '/dialogs';

    private idToName = {};

    private nameToImagePath = {
        'Mimi': {'avatar':'/assets/images/characters/MIMI/mimi_avatar.webp','story':'/assets/images/characters/MIMI/story.txt'},
        'Lisa': {'avatar':'/assets/images/characters/LISA/lisa_avatar.webp','story':'/assets/images/characters/LISA/story.txt'},
        'Selina': {'avatar':'/assets/images/characters/SELINA/selina_avatar.webp','story':'/assets/images/characters/SELINA/story.txt'},
        'Anna': {'avatar':'/assets/images/characters/ANNA/anna_avatar.webp','story':'/assets/images/characters/ANNA/story.txt'},
        'Christian': {'avatar':'/assets/images/characters/CHRISTIAN/christian_avatar.webp','story':'/assets/images/characters/CHRISTIAN/story.txt'},
        'Luca': {'avatar':'/assets/images/characters/LUCA/luca_avatar.webp','story':'/assets/images/characters/LUCA/story.txt'},
        'Georgia': {'avatar':'/assets/images/characters/GEORGIA/georgia_avatar.webp','story':'/assets/images/characters/GEORGIA/story.txt'},
        'Iman': {'avatar':'/assets/images/characters/IMAN/iman_avatar.webp','story':'/assets/images/characters/IMAN/story.txt'},
        'Maria': {'avatar':'/assets/images/characters/MARIA/maria_avatar.webp','story':'/assets/images/characters/MARIA/story.txt'},
        'Amelia': {'avatar':'/assets/images/characters/AMELIA/amelia_avatar.webp','story':'/assets/images/characters/AMELIA/story.txt'},
        'Eva': {'avatar':'/assets/images/characters/EVA/eva_avatar.webp','story':'/assets/images/characters/EVA/story.txt'},
        'Isabella': {'avatar':'/assets/images/characters/ISABELLA/isabella_avatar.webp','story':'/assets/images/characters/ISABELLA/story.txt'},
        'Christina': {'avatar':'/assets/images/characters/CHRISTINA/christina_avatar.webp','story':'/assets/images/characters/CHRISTINA/story.txt'},
        'Dora': {'avatar':'/assets/images/characters/DORA/dora_avatar.webp','story':'/assets/images/characters/DORA/story.txt'},
        'Peter': {'avatar':'/assets/images/characters/PETER/peter_avatar.webp','story':'/assets/images/characters/PETER/story.txt'},
        'Spyros': {'avatar':'/assets/images/characters/SPYROS/spyros_avatar.webp','story':'/assets/images/characters/SPYROS/story.txt'}
    };

    constructor(
        public page: Page,
        public router: RouterExtensions,
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
            let i = 0;
            for (let playerName in this.nameToImagePath) {
                const slidePath = path.join(encodeURI(`${knownFolders.currentApp().path}/assets/slides/slide.html`));
                const storyPath = path.join(encodeURI(`${knownFolders.currentApp().path}`+this.nameToImagePath[playerName]['story']));
                var res = File.fromPath(slidePath).readTextSync(() => {});
                var story = File.fromPath(storyPath).readTextSync(() => {});
                xml2js.parseString(res, {mergeAttrs: true}, (err, result) => {
                    if (err) {
                        throw err;
                    }
                    this.idToName[i] = playerName;
                    res = res.replace('chrname', playerName);
                    res = res.replace('story', story);
                    var imagePath = encodeURI(path.join(`${knownFolders.currentApp().path}` + this.nameToImagePath[playerName]['avatar']));
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
        var name = this.idToName[this.currentSlideNum];
        this.router.navigate([this.REDIRECT_ROUTE, name.toUpperCase()], {replaceUrl: true});
    }
}

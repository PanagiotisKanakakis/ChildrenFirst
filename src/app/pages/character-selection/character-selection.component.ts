import {AfterContentInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ContentView, GridLayout, ItemSpec, Page, SwipeGestureEventData} from '@nativescript/core';
import {Screen} from '@nativescript/core/platform';
import {File, knownFolders, path} from 'tns-core-modules/file-system';
import {GridUnitType} from '@nativescript/core/ui/layouts/grid-layout';
import {Router} from '@angular/router';
import {Animation} from '@nativescript/core/ui/animation';

@Component({
    selector: 'app-character-selection',
    templateUrl: './character-selection.component.html',
    styleUrls: ['./character-selection.component.css']
})
export class CharacterSelectionComponent implements OnInit, AfterContentInit {

    private slideFiles = ['slide1.xml', 'slide2.xml', 'slide3.xml'];
    private currentSlideNum: number = 0;
    private slideCount = 3;
    private screenWidth;
    private slidesView: GridLayout;

    @ViewChild('slideContent')
    slideElement: ElementRef;

    private slideView: ContentView;

    constructor(
        private page: Page,
        private nav: Router,
    ) {
        this.screenWidth = Screen.mainScreen.widthDIPs;
    }

    ngOnInit(): void {
    }

    ngAfterContentInit() {
        this.page.cssClasses.add('welcome-page-background');
        this.page.backgroundSpanUnderStatusBar = true;
        setTimeout(() => {
            this.slideView = this.slideElement.nativeElement;
            let files = this.loadSlides(this.slideFiles);
            files.then((files: any) => {
                var row = new ItemSpec(1, GridUnitType.STAR);
                let gridLayout = new GridLayout();
                files.forEach((file, i) => {
                    file.readText().then((res) => {
                        const element = new GridLayout();
                        element._context = res;
                        GridLayout.setColumn(element, 0);
                        if (i > 0) {
                            element.opacity = 0;
                        }
                        gridLayout.addChild(element);
                    });

                });
                gridLayout.addRow(row);
                this.slideView.content = (this.slidesView = gridLayout);
            });
        }, 1000);
    }

    private loadSlides(slideFiles) {
        let slides = [];
        return new Promise(function(resolve, reject) {
            slideFiles.forEach((dataFile, i) => {
                const slidePath = path.join(encodeURI(`${knownFolders.currentApp().path}/assets/slides/`) + dataFile);
                const file = File.fromPath(slidePath);
                slides.push(file);
                resolve(slides);
            });
        });
    }

    onSwipe(args: SwipeGestureEventData) {
        let prevSlideNum = this.currentSlideNum;
        let count = this.slideCount;
        if (args.direction == 2) {
            this.currentSlideNum = (this.currentSlideNum + 1) % count;
        } else if (args.direction == 1) {
            this.currentSlideNum = (this.currentSlideNum - 1 + count) % count;
        } else {
            // We are interested in left and right directions
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
            console.log("Animation finished");
        }).catch((e) => {
            console.log(e.message);
        });
    }

    itemSelected(item: number) {
        console.log(item);
    }

    skipIntro() {
        // this.nav.navigate(["/home"], { clearHistory: true });
        // this.nav.navigate(["/home"]);
    }

    getSliderItemClass(item: number) {
        if (item == this.currentSlideNum) {
            return 'caro-item-dot caro-item-dot-selected';
        }

        return 'caro-item-dot';
    }
}

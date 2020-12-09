import { Component, OnInit } from '@angular/core';
import {GestureEventData, Page} from '@nativescript/core';
import {RouterExtensions} from '@nativescript/angular';
import {Data} from '@src/app/domain/Data';
import {Screen} from '@nativescript/core/platform';
import {AppComponent} from '@src/app/app.component';

@Component({
  selector: 'app-story-description',
  templateUrl: './story-description.component.html',
  styleUrls: ['./story-description.component.css']
})
export class StoryDescriptionComponent extends AppComponent implements OnInit {

  public playerName:any;
  public characterSrc: any;
  public storyDescription: any;

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
  }

  onContinueTap(args: GestureEventData) {
    this.router.navigate(["/dialogs", this.playerName.toUpperCase()], {replaceUrl: true});
  }

}

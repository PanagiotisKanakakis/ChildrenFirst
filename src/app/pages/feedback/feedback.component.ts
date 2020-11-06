import { Component, OnInit } from '@angular/core';
import {GestureEventData, Page} from '@nativescript/core';
import {RouterExtensions} from '@nativescript/angular';
import {ActivatedRoute} from '@angular/router';
import {AppComponent} from '@src/app/app.component';
import {Data} from '@src/app/domain/Data';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent extends AppComponent implements OnInit {

  public characterSrc: string;
  public feedback: string;
  public description: string;
  public score: string;

  constructor(public page: Page,
              public router: RouterExtensions,
              private activatedroute: ActivatedRoute,
              private data: Data) {
    super(page, router);
    console.log(data);
  }

  ngOnInit(): void {
    this.characterSrc = this.data.storage.avatar;
    this.score = "YOUR SCORE: " + this.data.storage.score;
    this.description = this.data.storage.description;
    this.feedback = this.data.storage.feedback;
  }

  onTap(args: GestureEventData) {

  }

}

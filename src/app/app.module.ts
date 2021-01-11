import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from '@src/app/app-routing.module';
import {AppComponent} from '@src/app/app.component';
import {HomeComponent} from '@src/app/pages/home/home.component';
import {CharacterSelectionComponent} from '@src/app/pages/character-selection/character-selection.component';
import {DialogsComponent} from '@src/app/pages/dialogs/dialogs.component';
import {FeedbackComponent} from '@src/app/pages/feedback/feedback.component';
import {Data} from '@src/app/domain/Data';
import {InformationComponent} from '@src/app/pages/information/information.component';
import {StoryDescriptionComponent} from '@src/app/pages/story-description/story-description.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        CharacterSelectionComponent,
        DialogsComponent,
        FeedbackComponent,
        InformationComponent,
        StoryDescriptionComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
    ],
    providers: [Data],
    bootstrap: [AppComponent]
})
export class AppModule {
}


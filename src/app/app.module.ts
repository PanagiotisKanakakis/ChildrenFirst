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
import {CircularProgressBarComponent} from '@src/app/pages/circular-progress-bar/circular-progress-bar.component';
import {NativeScriptUISideDrawerModule} from 'nativescript-ui-sidedrawer/angular';
import {NativeScriptUIListViewModule} from 'nativescript-ui-listview/angular';
import {NativeScriptUICalendarModule} from 'nativescript-ui-calendar/angular';
import {NativeScriptUIChartModule} from 'nativescript-ui-chart/angular';
import {NativeScriptUIDataFormModule} from 'nativescript-ui-dataform/angular';
import {NativeScriptUIAutoCompleteTextViewModule} from 'nativescript-ui-autocomplete/angular';
import {NativeScriptUIGaugeModule} from 'nativescript-ui-gauge/angular';
import {NativeScriptCommonModule, NativeScriptHttpClientModule, NativeScriptModule} from '@nativescript/angular';


@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        CharacterSelectionComponent,
        DialogsComponent,
        FeedbackComponent,
        InformationComponent,
        StoryDescriptionComponent,
        CircularProgressBarComponent
    ],
    imports: [
        BrowserModule,
        NativeScriptUISideDrawerModule,
        NativeScriptUIListViewModule,
        NativeScriptUICalendarModule,
        NativeScriptUIChartModule,
        NativeScriptUIDataFormModule,
        NativeScriptUIAutoCompleteTextViewModule,
        NativeScriptUIGaugeModule,
        NativeScriptCommonModule,
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptHttpClientModule
    ],
    providers: [Data],
    bootstrap: [AppComponent]
})
export class AppModule {
}


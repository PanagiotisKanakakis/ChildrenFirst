import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {NativeScriptCommonModule, NativeScriptHttpClientModule, NativeScriptModule} from '@nativescript/angular';

import {AppRoutingModule} from '@src/app/app-routing.module';
import {AppComponent} from '@src/app/app.component';
import {HomeComponent} from '@src/app/pages/home/home.component';
import {CharacterSelectionComponent} from '@src/app/pages/character-selection/character-selection.component';
import {DialogsComponent} from '@src/app/pages/dialogs/dialogs.component';
import {FeedbackComponent} from '@src/app/pages/feedback/feedback.component';
import {Data} from '@src/app/domain/Data';
import {InformationComponent} from '@src/app/pages/information/information.component';
import { StoryDescriptionComponent } from '@src/app/pages/story-description/story-description.component';
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { NativeScriptUICalendarModule } from "nativescript-ui-calendar/angular";
import { NativeScriptUIChartModule } from 'nativescript-ui-chart/angular';
import { NativeScriptUIDataFormModule } from "nativescript-ui-dataform/angular";
import { NativeScriptUIAutoCompleteTextViewModule } from "nativescript-ui-autocomplete/angular";
import { NativeScriptUIGaugeModule } from 'nativescript-ui-gauge/angular';
import { CircularProgressBarComponent } from '@src/app/pages/circular-progress-bar/circular-progress-bar.component';

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
    providers: [CharacterSelectionComponent, Data],
    bootstrap: [AppComponent],
    schemas: [NO_ERRORS_SCHEMA]
})


export class AppModule {

}

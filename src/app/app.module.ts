import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from '@src/app/app-routing.module';
import {AppComponent} from '@src/app/app.component';
import {HomeComponent} from '@src/app/pages/home/home.component';
import {CharacterSelectionComponent} from '@src/app/pages/character-selection/character-selection.component';
import {NativeScriptMaterialButtonModule} from 'nativescript-material-button/angular';
import {CharacterInformationComponent} from '@src/app/pages/character-information/character-information.component';
import {DialogsComponent} from '@src/app/pages/dialogs/dialogs.component';
import {FeedbackComponent} from '@src/app/pages/feedback/feedback.component';
import {Data} from '@src/app/domain/Data';


@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        CharacterSelectionComponent,
        CharacterInformationComponent,
        DialogsComponent,
        FeedbackComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NativeScriptMaterialButtonModule
    ],
    providers: [Data],
    bootstrap: [AppComponent]
})
export class AppModule {
}

import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {NativeScriptCommonModule, NativeScriptHttpClientModule, NativeScriptModule, registerElement} from '@nativescript/angular';

import {AppRoutingModule} from '@src/app/app-routing.module';
import {AppComponent} from '@src/app/app.component';
import {HomeComponent} from '@src/app/pages/home/home.component';
import {CharacterSelectionComponent} from '@src/app/pages/character-selection/character-selection.component';
import {DialogsComponent} from '@src/app/pages/dialogs/dialogs.component';
import {FeedbackComponent} from '@src/app/pages/feedback/feedback.component';
import {Data} from '@src/app/domain/Data';
import {InformationComponent} from '@src/app/pages/information/information.component';
import {StoryDescriptionComponent} from '@src/app/pages/story-description/story-description.component';
import { FloatingActionButton } from '@nativescript-community/ui-material-floatingactionbutton';
registerElement('MDFloatingActionButton', () => FloatingActionButton);

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

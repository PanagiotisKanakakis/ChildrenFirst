import {Routes} from '@angular/router';

import {HomeComponent} from '@src/app/pages/home/home.component';
import {CharacterSelectionComponent} from '@src/app/pages/character-selection/character-selection.component';
import {DialogsComponent} from '@src/app/pages/dialogs/dialogs.component';
import {FeedbackComponent} from '@src/app/pages/feedback/feedback.component';
import {InformationComponent} from '@src/app/pages/information/information.component';
import {StoryDescriptionComponent} from '@src/app/pages/story-description/story-description.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
    },
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'information',
        component: InformationComponent,
    },
    {
        path: 'characters',
        component: CharacterSelectionComponent,
    },
    {
        path:'dialogs',
        component: DialogsComponent
    },
    {
        path:'story-description',
        component: StoryDescriptionComponent
    },
    {
        path:'feedback',
        component: FeedbackComponent
    }
];

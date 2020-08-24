import {Routes} from '@angular/router';

import {HomeComponent} from '@src/app/pages/home/home.component';
import {CharacterSelectionComponent} from '@src/app/pages/character-selection/character-selection.component';

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
        path: 'character-selection',
        component: CharacterSelectionComponent,
    }
];

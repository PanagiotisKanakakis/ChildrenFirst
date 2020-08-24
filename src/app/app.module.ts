import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from '@src/app/app-routing.module';
import { AppComponent } from '@src/app/app.component';
import { HomeComponent } from '@src/app/pages/home/home.component';
import { CharacterSelectionComponent } from '@src/app/pages/character-selection/character-selection.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CharacterSelectionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

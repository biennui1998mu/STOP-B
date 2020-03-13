import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialCompsModule } from './material-comps.module';
import { HomepageComponent } from './homepage/homepage.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { QnoteComponent } from './qnote/qnote.component';
import { MakeplanComponent } from './makeplan/makeplan.component';
import { ChatComponent } from './chat/chat.component';
import { ReadnoteComponent } from './readnote/readnote.component';
import { ReadplanComponent } from './readplan/readplan.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomepageComponent,
    SidenavComponent,
    QnoteComponent,
    MakeplanComponent,
    ChatComponent,
    ReadnoteComponent,
    ReadplanComponent
  ],
  imports: [
    MaterialCompsModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

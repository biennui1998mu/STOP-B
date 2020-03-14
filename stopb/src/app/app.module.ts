import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './core/login/login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { QnoteComponent } from './qnote/qnote.component';
import { MakeplanComponent } from './makeplan/makeplan.component';
import { ReadnoteComponent } from './readnote/readnote.component';
import { ReadplanComponent } from './readplan/readplan.component';
import { SharedComponentModule } from "./shared/components/shared-component.module";
import { CoreImportsModule } from './shared/modules/core-imports.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomepageComponent,
    QnoteComponent,
    MakeplanComponent,
    ReadnoteComponent,
    ReadplanComponent,
  ],
  imports: [
    CoreImportsModule,
    SharedComponentModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}

import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './core/login/login.component';
import { HomepageComponent } from './core/homepage/homepage.component';
import { QnoteComponent } from './core/qnote/qnote.component';
import { MakeplanComponent } from './core/makeplan/makeplan.component';
import { ReadnoteComponent } from './readnote/readnote.component';
import { ReadplanComponent } from './readplan/readplan.component';
import { SharedComponentModule } from "./shared/components/shared-component.module";
import { CoreImportsModule } from './shared/modules/core-imports.module';
import { SharedServicesModule } from './shared/services/shared-services.module';
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { AuthenticateGuard } from "./shared/guard/authenticate.guard";


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
    SharedServicesModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    AuthenticateGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}

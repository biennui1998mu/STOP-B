import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './core/login/login.component';
import { HomepageComponent } from './core/homepage/homepage.component';
import { SharedComponentModule } from "./shared/components/shared-component.module";
import { CoreImportsModule } from './shared/modules/core-imports.module';
import { SharedServicesModule } from './shared/services/shared-services.module';
import { HttpClientModule } from "@angular/common/http";
import { AuthenticateGuard } from "./shared/guard/authenticate.guard";
import { LayoutsModule } from './shared/layouts/layouts.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomepageComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LayoutsModule,
    SharedComponentModule,
    SharedServicesModule,
    CoreImportsModule,
    AppRoutingModule,
  ],
  providers: [
    AuthenticateGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}

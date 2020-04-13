import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './core/login/login.component';
import { HomepageComponent } from './core/homepage/homepage.component';
import { QnoteComponent } from './core/qnote/qnote.component';
import { CreateProjectComponent } from './core/create-project/create-project.component';
import { ReadnoteComponent } from './readNote/readnote.component';
import { ReadProjectComponent } from './readProject/readProject.component';
import { SharedComponentModule } from "./shared/components/shared-component.module";
import { CoreImportsModule } from './shared/modules/core-imports.module';
import { SharedServicesModule } from './shared/services/shared-services.module';
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { AuthenticateGuard } from "./shared/guard/authenticate.guard";
import { ManagerInputComponent } from './core/create-project/manager-input/manager-input.component';
import { MemberInputComponent } from './core/create-project/member-input/member-input.component';
import { TaskInputComponent } from './core/create-project/task-input/task-input.component';
import { LayoutsModule } from './shared/layouts/layouts.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomepageComponent,
    QnoteComponent,
    CreateProjectComponent,
    ReadnoteComponent,
    ReadProjectComponent,
    ManagerInputComponent,
    MemberInputComponent,
    TaskInputComponent,
  ],
  imports: [
    CoreImportsModule,
    LayoutsModule,
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

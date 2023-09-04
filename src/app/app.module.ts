import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EvaluationComponent } from './evaluation/evaluation.component';
import { SamsungApiService } from './services/samsung-api.service';

@NgModule({
  declarations: [
    AppComponent,
    EvaluationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    NgbDatepickerModule
  ],
  providers: [
    SamsungApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

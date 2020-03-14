import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialCompsModule } from './material-comps.module';
import { RouterModule } from '@angular/router';

const modules = [
  MaterialCompsModule,
  BrowserModule,
  ReactiveFormsModule,
  FormsModule,
  HttpClientModule,
  BrowserAnimationsModule,
  RouterModule,
];

@NgModule({
  imports: [
    CommonModule,
    ...modules,
  ],
  exports: [
    ...modules,
  ],
})
export class CoreImportsModule {
}

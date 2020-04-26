import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CategoriesModule } from './pages/categories/categories.module';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataBase } from './in-memory-database';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CategoriesModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDataBase),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

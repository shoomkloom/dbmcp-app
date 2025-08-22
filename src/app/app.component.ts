// src/app/app.component.ts
import { Component } from '@angular/core';
import { MainPageComponent } from './main-page/main-page.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true, // This component is now standalone
  imports: [MainPageComponent] // Imports the new standalone MainPageComponent
})
export class AppComponent {
  title = 'DBMCP';
}
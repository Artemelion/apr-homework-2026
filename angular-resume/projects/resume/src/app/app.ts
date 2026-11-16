import { Component } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Profile } from './profile/profile';
import { Experience } from './experience/experience';
import { Skills } from './skills/skills';
import { Links } from './links/links';

@Component({
  selector: 'app-root',
  imports: [NgClass, NgStyle, FormsModule, Profile, Experience, Skills, Links],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  darkTheme = false;
  fontSize = 16;
  visitorName = '';
  likes = 0;

  toggleTheme() {
    this.darkTheme = !this.darkTheme;
  }

  like() {
    this.likes++;
  }
}

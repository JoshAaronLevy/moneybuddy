import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class IntroService {
  private readonly KEY = 'viewedIntro';

  hasViewedIntro(): boolean {
    return localStorage.getItem(this.KEY) === 'true';
  }

  setViewedIntro(): void {
    localStorage.setItem(this.KEY, 'true');
  }
}

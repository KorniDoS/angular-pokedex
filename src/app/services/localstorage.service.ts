import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  public getItem(item: string) {
    if (!localStorage.getItem(item)) {
      return null;
    }

    return JSON.parse(localStorage.getItem(item)!);
  }

  public setItem(item: string, value: any) {
    localStorage.setItem(item, typeof value !== 'object' ? value : JSON.stringify(value));
  }

  public removeItem(item: string) {
    localStorage.removeItem(item);
  }

  public clear() {
    localStorage.clear();
  }
}

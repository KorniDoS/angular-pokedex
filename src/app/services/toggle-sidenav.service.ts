import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToggleSidenavService {
  public readonly toggled = new BehaviorSubject<boolean>(false);
}

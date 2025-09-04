import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { EventBusData } from '../interfaces/event-bus.interface';

@Injectable({
  providedIn: 'root',
})
export class EventBusService {
  private _data = new Subject<EventBusData>();

  public getData(type: string): Observable<EventBusData> {
    return this._data.asObservable().pipe(filter((data: EventBusData) => data.type == type));
  }

  public sendData(data: EventBusData): void {
    this._data.next(data);
  }
}

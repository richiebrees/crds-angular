import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { Event } from './event';
declare var moment: any;

@Injectable()
export class StreamspotService {

  private url    = 'https://api.streamspot.com/broadcaster';
  private apiKey = '82437b4d-4e38-42e2-83b6-148fcfaf36fb';
  private id     = 'crossr4915';

  constructor(private http: Http) { }

  getEvents() {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'x-API-Key': this.apiKey
    });
    // let url = `${this.url}/${this.id}/events`;
    let url = `http://localhost:8080/app/streaming/events.json`;
    return this.http.get(url, {headers: headers})
      .map(response => response.json().data.events)
      .map((events: Array<Event>) => {
        return events
          .filter((event:Event) => {
            // get upcoming or currently broadcasting events
            return moment().isBefore(moment(event.start)) 
                  || (moment().isAfter(moment(event.start)) && moment().isBefore(moment(event.end)))
          })
          .map((event:Event) => {
            event.start     = moment(event.start);
            event.end       = moment(event.end);
            event.dayOfYear = event.start.dayOfYear();
            event.time      = event.start.format('LT [EST]');
            return event;
          })
      })
  }
}

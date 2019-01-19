import * as moment from 'moment';
import { Controller } from 'stimulus';

export default class EventsController extends Controller {
  /**
   * Event elements
   */
  public timeTargets: HTMLElement[];
  public nameTargets: HTMLElement[];

  static get targets() {
    return ['time', 'name'];
  }

  public connect() {
    this.load();
    setInterval(_ => this.load(), 60000);
  }

  public load() {
    fetch('/live-api/event-info')
      .then(response => response.json())
      .then(newEventInfo => {
        if (JSON.stringify(newEventInfo) !== this.data.get('eventInfo')) {
          this.data.set('eventInfo', JSON.stringify(newEventInfo));
          this.updateEvents(newEventInfo.currentEvents, 0, 'No current events');
          this.updateEvents(newEventInfo.nextEvents, 1, 'No events coming up');
        }
      });
  }

  public updateEvents(events, index, placeholder) {
    if (events.length > 0) {
      this.timeTargets[index].setAttribute('datetime', moment(events[0].time).toISOString());
      this.timeTargets[index].innerText = `${moment(events[0].time).format('HH:mm')}`;
      this.nameTargets[index].childNodes.forEach(node => {
        this.nameTargets[index].removeChild(node);
      });
      events.forEach(event => {
        const element = document.createElement('h4');
        element.innerText = event.name;
        this.nameTargets[index].appendChild(element);
      });
    } else {
      this.nameTargets[index].childNodes.forEach(node => {
        this.nameTargets[index].removeChild(node);
      });
      const element = document.createElement('h4');
      element.innerHTML = placeholder;
      this.nameTargets[index].appendChild(element);
    }
  }
}

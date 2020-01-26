import {
  Component,
  OnDestroy
} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {
  Attraction,
  AttractionService,
  Outing,
  OutingService
} from 'cr-lib';
import {
  ReplaySubject,
  Subject
} from 'rxjs';

/**
 * Orients players having accepted an invite by presenting an overview of the Outing.
 */
@Component({
  selector: 'page-outing',
  templateUrl: 'outing.page.html',
})
export class OutingPage implements OnDestroy {

  outing: Outing = new Outing();
  startingAttractionSubject: Subject<Attraction>;

  constructor(
    private titleService: Title,
    private outingService: OutingService,
    private attractionService: AttractionService,
    private router: Router,
  ) {
    this.startingAttractionSubject = new ReplaySubject<Attraction>(1);
  }

  ionViewDidEnter() {
    this.outingService.getSessionOuting().subscribe(
      /* Generally, the Outing has been cached. */
      (response) => {
        console.log('Receiving Outing from Service');
        this.outing = response;

        /* With the outing, we can load the starting location. */
        this.startingAttractionSubject.next(
          this.attractionService.getAttraction(
            this.outing.startingLocationId
          )
        );

      }
    );
  }

  public addToCalendar() {
    window.console.log('TODO: Download .ics file');
  }

  public showTeam() {
    this.router.navigate(['team']);
  }

  ngOnDestroy(): void {
  }

}

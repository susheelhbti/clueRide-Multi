import {
  Component,
  OnInit
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {
  Attraction,
  CourseAttractionService,
  LocLink
} from 'cr-lib';
import {Subscription} from 'rxjs';

/**
 * AttractionPage presents an Attraction to a Seeker.
 *
 * It uses the ActivatedRoute to pickup the query params that
 * tell us what Attraction to present.
 *
 * It uses the CourseAttractionService to retrieve the data
 * that we expose for the view.
 */
@Component({
  selector: 'app-attraction',
  templateUrl: './attraction.page.html',
  styleUrls: ['./attraction.page.scss'],
})
export class AttractionPage implements OnInit {

  public attraction: Attraction;

  private subscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private courseAttractionService: CourseAttractionService,
  ) {
    console.log('AttractionPage is constructing');
  }

  ngOnInit() {
    this.subscription = this.activatedRoute.queryParams.subscribe(
      (params) => {
        const attractionId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'), 10);
        console.log('AttractionPage.ngOnInit; attractionId = ', attractionId);
        this.attraction = this.courseAttractionService.getAttraction(
          attractionId
        );
      });
  }

  openAttractionLink(locLink: LocLink) {
    /* TODO: Invoke the Badge API (SVR-51) here. */
    window.open(
      locLink.link,
      '_system',
      'location=yes'
    );
    return false;
  }

}

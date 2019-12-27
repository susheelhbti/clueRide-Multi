import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {AlertController} from '@ionic/angular';
import {
  Attraction,
  ImageService,
  LocationService
} from 'cr-lib';
import {Subscription} from 'rxjs';
import {MapDataService} from '../../map/data/map-data.service';
import {ActiveAttractionService} from '../active-attraction.service';

@Component({
  selector: 'app-images',
  templateUrl: './images.page.html',
  styleUrls: ['./images.page.scss'],
})
export class ImagesPage implements OnInit, OnDestroy {

  /* Expose instance to be edited. */
  public attraction: Attraction;
  public attractionId: number;
  public hasMultipleImages = false;

  private subscription: Subscription;

  constructor(
    private activeAttractionService: ActiveAttractionService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
    private imageService: ImageService,
    private locationService: LocationService,
    private mapDataService: MapDataService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.subscription = this.activatedRoute.queryParams.subscribe(
      (params) => {
        const attractionId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'), 10);
        this.attraction = this.mapDataService.getAttractionById(attractionId);
        console.log('Active Attraction', this.attraction.name);
        this.activeAttractionService.setActiveAttractionId(attractionId);

        // TODO: SVR-50 Move to the server
        if (!this.attraction.mainLink) {
          this.attraction.mainLink = {link: '', id: null};
        }
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ionViewWillEnter() {
    this.imageService.hasMultipleImages(this.attraction.id)
      .subscribe(
        (hasMultipleImages) => {this.hasMultipleImages = hasMultipleImages; }
      );
  }

  // TODO: CI-51 Long Press response
  showImageActions() {
    console.log('Show Image Actions');
    const alert = this.alertController.create({
      header: 'Unlink this Image?',
      message: 'Do you want to unset the Featured Image? (Image can be re-featured later)',
      buttons: [
        {
          text: 'Keep Featured Image',
          handler: () => {
            console.log('Keep');
          }
        },
        {
          text: 'Unset Featured Image',
          handler: () => {
            console.log('Removing Featured Image');
            this.locationService.removeFeaturedImage(this.attraction.id).subscribe(
              (attraction) => {
                // TODO: Just noticed that this will overwrite any other changes
                this.attraction = attraction;
              }
            );
          }
        }
      ]
    });

  }

  /**
   * Invoked when the user is ready to persist changes.
   */
  save() {
    console.log('Saving');
    this.locationService.update(this.attraction).subscribe(
      (updatedAttraction: Attraction) => {
        this.mapDataService.updateAttraction(updatedAttraction);
      }
    );
    this.router.navigate(['home']);
  }

  /** Opens the Page that performs Camera operations passing the the attraction and the "Camera" flag. */
  captureImage() {
    console.log('Opening Camera');
    // TODO: CI-42 Image Capture Page
    // this.navCtrl.push(ImageCapturePage, {
    //   attraction: this.attraction,
    //   mode: 'camera'
    // });
  }

  /** Opens the Page that performs Gallery upload operations passing the the attraction and the "Gallery" flag. */
  imageFromGallery() {
    console.log('Opening Gallery');
    // TODO: CI-42 Image Capture Page
    // this.navCtrl.push(ImageCapturePage, {
    //   attraction: this.attraction,
    //   mode: 'gallery'
    // });
  }

  showOtherImages() {
    // TODO: CI-41 Images Page; dependent on CI-50
    // this.navCtrl.push(
    //   ImagesPage,
    //   {attraction: this.attraction}
    // );
  }

}

import { TextFieldModule } from '@angular/cdk/text-field';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    QueryList,
    ViewChild,
    ViewChildren,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
    MatBottomSheet,
    MatBottomSheetModule,
    MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MapComponent } from '../map/page.component';
import { Router } from '@angular/router';
declare const longdo: any; // Assuming longdo is a global variable or imported separately
import { FuseCardComponent } from '@fuse/components/card';
import { PageService } from '../page.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'step-two-map-recommend',
    templateUrl: './page.component.html',
    styleUrls: ['./page.component.scss'],
    standalone: true,
    imports: [
        CdkStepperModule,
        NgStepperModule,
        MatStepperModule,
        MatTabsModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        TextFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
        MatProgressBarModule,
        MatBottomSheetModule,
        FuseCardComponent,
        CommonModule,
    ],
})
export class StepTwoMapRecommendComponent implements OnInit {
    dataForm: FormGroup;
    map: any; // Assuming you have a reference to the map object
    items: any;
    item: any;
    item2: any;
    itemData: any;
    marker: any; // Holds the marker instance
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _bottomSheet: MatBottomSheet,
        private _service: PageService,
        private _router: Router,
        private _changeDetectorRef: ChangeDetectorRef
    ) {}

    openBottomSheet(): void {
        this._bottomSheet.open(MapComponent);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.item2 = localStorage.getItem('mylocation')
            ? JSON.parse(localStorage.getItem('mylocation'))
            : [];

        this.itemData = localStorage.getItem('data')
            ? JSON.parse(localStorage.getItem('data')).data
            : [];

        if (this.item2) {
            if (this.item2.lat && this.item2.lon) {
                const data = {
                    lat: this.item2.lat,
                    lon: this.item2.lon,
                    brand:this.itemData.brand,
                };

                this._service
                    .get_service_centers_recommend(data)
                    .subscribe((resp: any) => {
                        try {
                            this.items = resp.data;
                            this.item = this.items[0];
                            if (this.item) {
                                // Initialize the map
                                const resolution = 156543.03392;
                                const distance = 0.005;
                                const zoomLevel = Math.round(
                                    Math.log2(
                                        (40075016.686 *
                                            Math.cos(
                                                (this.item.lat * Math.PI) / 180
                                            )) /
                                            (resolution * distance)
                                    )
                                );

                                // Initialize the map
                                this.map = new longdo.Map({
                                    placeholder: document.getElementById('map'), // Assuming you have an element with id 'map' in your template
                                    zoom: zoomLevel, // Start with a zoom level that provides detail for approximately 500 meters
                                    animate: true,
                                    // other map options
                                });

                                // Add a marker to the map
                                // const marker = new longdo.Marker({
                                //     lon: this.item.lat,
                                //     lat: this.item.lon,
                                // });

                                this.marker = new longdo.Marker(
                                    {
                                        lon: this.item.lon
                                            ? this.item.lon
                                            : this.item.lon,
                                        lat: this.item.lat
                                            ? this.item.lat
                                            : this.item.lat,
                                    },
                                    {
                                        title: 'Marker',
                                        icon: {
                                            url: 'https://asha-tech.co.th/pin.png',
                                        },
                                    }
                                );

                                this.map.Overlays.add(this.marker);
                                this.focusOnMarker();

                                // Set the zoom level again after initializing the map
                                this.map.zoom(16); // Adjust the zoom level as needed

                                // Save the last view (including zoom level)
                                // this.map.view();

                                this._changeDetectorRef.markForCheck();
                            }
                            // console.log("test",this.items);
                            // if (resp.data) {
                            //     const obj = {
                            //         data: resp.data,
                            //     };

                            // localStorage.setItem('data', JSON.stringify(obj));
                            // this._router.navigate(['screens/reg-kg/list']);
                            // } else {
                            //     // this.disableError = true;
                            // }
                            // this._changeDetectorRef.markForCheck();
                        } catch (error) {
                            // this.disableError = true;
                            console.log(error);
                        }
                    });
            } else {
                const data = {
                    lat: this.item2.road_lat,
                    lon: this.item2.road_lon,
                    brand:this.itemData.brand,
                };
       
                this._service
                    .get_service_centers_recommend(data)
                    .subscribe((resp: any) => {
                        try {
                            this.items = resp.data;
                            this.item = this.items[0];
                            if (this.item) {
                                // Initialize the map
                                const resolution = 156543.03392;
                                const distance = 0.005;
                                const zoomLevel = Math.round(
                                    Math.log2(
                                        (40075016.686 *
                                            Math.cos(
                                                (this.item.lat * Math.PI) / 180
                                            )) /
                                            (resolution * distance)
                                    )
                                );

                                // Initialize the map
                                this.map = new longdo.Map({
                                    placeholder: document.getElementById('map'), // Assuming you have an element with id 'map' in your template
                                    zoom: zoomLevel, // Start with a zoom level that provides detail for approximately 500 meters
                                    animate: true,
                                    // other map options
                                });

                                // Add a marker to the map
                                // const marker = new longdo.Marker({
                                //     lon: this.item.lat,
                                //     lat: this.item.lon,
                                // });

                                this.marker = new longdo.Marker(
                                    {
                                        lon: this.item.lon
                                            ? this.item.lon
                                            : this.item.lon,
                                        lat: this.item.lat
                                            ? this.item.lat
                                            : this.item.lat,
                                    },
                                    {
                                        title: 'Marker',
                                        icon: {
                                            url: 'https://asha-tech.co.th/pin.png',
                                        },
                                    }
                                );

                                this.map.Overlays.add(this.marker);
                                this.focusOnMarker();

                                // Set the zoom level again after initializing the map
                                this.map.zoom(16); // Adjust the zoom level as needed

                                // Save the last view (including zoom level)
                                // this.map.view();

                                this._changeDetectorRef.markForCheck();
                            }
                            // console.log("test",this.items);
                            // if (resp.data) {
                            //     const obj = {
                            //         data: resp.data,
                            //     };

                            // localStorage.setItem('data', JSON.stringify(obj));
                            // this._router.navigate(['screens/reg-kg/list']);
                            // } else {
                            //     // this.disableError = true;
                            // }
                            // this._changeDetectorRef.markForCheck();
                        } catch (error) {
                            // this.disableError = true;
                            console.log(error);
                        }
                    });
            }
        }
    }

    focusOnMarker(): void {
        this.map.location(this.marker.location(), true);
    }

    selectServiceCenter(item) {
        localStorage.setItem('myServiceCenter', JSON.stringify(item));

        this._router.navigate(['screens/services/step-three']);
    }

    goToServicesCenter() {
        this._router.navigate(['screens/services/step-two-service-centers']);
    }

    openMap(item: any): void {
        window.open(
            'https://www.google.com/maps/search/?api=1&query=' +
                item.lat +
                ',' +
                item.lon
        );
    }
}

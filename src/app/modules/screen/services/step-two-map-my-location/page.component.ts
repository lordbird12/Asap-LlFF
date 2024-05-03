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
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
export class StepTwoMapMyLocationComponent implements OnInit {
    dataForm: FormGroup;
    map: any; // Assuming you have a reference to the map object
    items: any;
    item: any;
    data: any;
    private apiKey = 'ca1a48a17e613c75c68d82fe7f71893b'; // Replace with your Google Maps API key
    private baseUrl = 'https://api.longdo.com/map/services/address';

    marker: any; // Holds the marker instance

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _bottomSheet: MatBottomSheet,
        private _service: PageService,
        private _router: Router,
        private _changeDetectorRef: ChangeDetectorRef,
        private http: HttpClient
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
        this.data = localStorage.getItem('Location')
            ? JSON.parse(localStorage.getItem('Location'))
            : [];

        if (this.data) {
            const data = {
                lat: this.data.lat,
                lon: this.data.lon,
            };

            this._service.get_loations(data).subscribe((resp: any) => {
                try {
                    this.item = resp;
                    this._changeDetectorRef.markForCheck();

                    if (this.item) {
                        const resolution = 156543.03392;
                        const distance = 50;
                        const zoomLevel = Math.round(
                            Math.log2(
                                (40075016.686 *
                                    Math.cos((this.data.lat * Math.PI) / 180)) /
                                    (resolution * distance)
                            )
                        );

                        // Initialize the map
                        this.map = new longdo.Map({
                            placeholder: document.getElementById('map'), // Assuming you have an element with id 'map' in your template
                            zoom: zoomLevel,
                            animate: true,
                            // other map options
                        });

                        this.marker = new longdo.Marker(
                            {
                                lon: this.data.lon
                                    ? this.data.lon
                                    : this.data.lon,
                                lat: this.data.lat
                                    ? this.data.lat
                                    : this.data.lat,
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
                } catch (error) {
                    // this.disableError = true;
                    console.log(error);
                }
            });
        }
    }

    focusOnMarker(): void {
        this.map.location(this.marker.location(), true);
    }

    // selectServiceCenter(item){
    //     localStorage.setItem('myServiceCenter', JSON.stringify(item));

    //     this._router.navigate(['screens/services/step-three']);
    // }

    submit() {
        this._router.navigate(['screens/services/step-two-map-recommend']);
    }

    editDate(): void {
        this._router.navigate(['screens/search/main']);
    }
}

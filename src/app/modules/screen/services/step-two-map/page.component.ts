import { TextFieldModule } from '@angular/cdk/text-field';
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
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

@Component({
    selector: 'step-two-map',
    templateUrl: './page.component.html',
    styleUrls: ['./page.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
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
    ],
})
export class StepTwoMapComponent implements OnInit {
    dataForm: FormGroup;
    map: any; // Assuming you have a reference to the map object
    item: any;
    marker: any; // Holds the marker instance
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _bottomSheet: MatBottomSheet,
        private _router: Router
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
        this.item = localStorage.getItem('mylocation')
            ? JSON.parse(localStorage.getItem('mylocation'))
            : [];

        if (this.item) {
            // Initialize the map
            const resolution = 156543.03392;
            const distance = 50;
            const zoomLevel = Math.round(
                Math.log2(
                    (40075016.686 * Math.cos((this.item.lat * Math.PI) / 180)) /
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

            // Add a marker to the map
            // const marker = new longdo.Marker({
            //     lon: this.item.lat,
            //     lat: this.item.lon,
            // });

            this.marker = new longdo.Marker(
                {
                    lon: this.item.lon ? this.item.lon : this.item.road_lon,
                    lat: this.item.lat ? this.item.lat : this.item.road_lat,
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
        }
    }

    goToServicesCenter() {
        this._router.navigate(['screens/services/step-two-service-centers']);
    }

    focusOnMarker(): void {
        this.map.location(this.marker.location(), true);
    }
}

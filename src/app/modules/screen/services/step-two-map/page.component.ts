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
declare const longdo: any; // Assuming longdo is a global variable or imported separately

@Component({
    selector: 'step-two-map',
    templateUrl: './page.component.html',
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
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _bottomSheet: MatBottomSheet
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
            this.map = new longdo.Map({
                placeholder: document.getElementById('map'), // Assuming you have an element with id 'map' in your template
                zoom: 14,
                // other map options
            });

            // Add a marker to the map
            // const marker = new longdo.Marker({
            //     lon: this.item.lat,
            //     lat: this.item.lon,
            // });

            var marker = new longdo.Marker(
                { lon: this.item.lon, lat: this.item.lat },
                {
                    title: 'Marker',
                    icon: {
                        url: 'https://asha-tech.co.th/pin.png',
                    },

                }
            );

            this.map.Overlays.add(marker);
        }
    }
}

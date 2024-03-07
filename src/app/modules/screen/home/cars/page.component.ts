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
import { FuseCardComponent } from '@fuse/components/card';
import { Router } from '@angular/router';
import { PageService } from '../page.service';
import { CommonModule, NgClass } from '@angular/common';

@Component({
    selector: 'step-two-map',
    templateUrl: './page.component.html',
    encapsulation: ViewEncapsulation.None,
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
        NgClass,
        CommonModule
    ],
})
export class CarsComponent implements OnInit {
    @ViewChildren(FuseCardComponent, { read: ElementRef })
    private _fuseCards: QueryList<ElementRef>;
    dataForm: FormGroup;
    map: any; // Assuming you have a reference to the map object
    items: any;
    item: any;
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _bottomSheet: MatBottomSheet,
        private _service: PageService,
        private _router: Router,
        private _changeDetectorRef: ChangeDetectorRef,
    ) {}

    openBottomSheet(): void {
        // this._bottomSheet.open(MapComponent);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.item = localStorage.getItem('MyCars')
            ? JSON.parse(localStorage.getItem('MyCars'))
            : [];

       
    }

    selectServiceCenter(item){
        localStorage.setItem('myServiceCenter', JSON.stringify(item));

        this._router.navigate(['screens/services/step-three']);
    }
}

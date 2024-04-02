import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
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
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { PageService } from '../page.service';
import { Router } from '@angular/router';

@Component({
    selector: 'main-profile',
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
        CommonModule,
        NgClass,
    ],
})
export class MainComponent implements OnInit {
    dataForm: FormGroup;
    disableError: boolean = false;
    profile: any;
    myBooking: any;
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _bottomSheet: MatBottomSheet,
        private _fuseConfirmationService: FuseConfirmationService,
        private _service: PageService,
        private _router: Router,
        private _changeDetectorRef: ChangeDetectorRef
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.profile = localStorage.getItem('profile')
            ? JSON.parse(localStorage.getItem('profile'))
            : [];

        this.myBooking = localStorage.getItem('MyBooking')
            ? JSON.parse(localStorage.getItem('MyBooking'))
            : [];

        // Create the form
        this.dataForm = this._formBuilder.group({
            name: [null, [Validators.required]],
            phone: [null, [Validators.required]],
        });
    }

    goToEdit() {
        this._router.navigate(['screens/profile/edit']);
    }

    goToCars() {
        this._router.navigate(['screens/services/cars']);
    }

    onChange(event: any) {
        if (event.target.value) {
            this.disableError = false;
        }
    }
}

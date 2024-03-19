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
import { StepFourOtpComponent } from '../step-four-otp/page.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { PageService } from '../page.service';
import { Router } from '@angular/router';

@Component({
    selector: 'step-four',
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
        NgClass
    ],
})
export class StepFourComponent implements OnInit {
    dataForm: FormGroup;
    disableError: boolean = false;
    profile: any;
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _bottomSheet: MatBottomSheet,
        private _fuseConfirmationService: FuseConfirmationService,
        private _service: PageService,
        private _router: Router,
        private _changeDetectorRef: ChangeDetectorRef,
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.dataForm = this._formBuilder.group({
            name: [null, [Validators.required]],
            phone: [null, [Validators.required]],
        });
    }

    submit() {
        const confirmation = this._fuseConfirmationService.open({
            title: 'ยืนยันข้อมูลติดต่อ',
            message: 'คุณต้องการยืนยันข้อมูลติดต่อใช่หรือไม่ ?',
            icon: {
                show: false,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'accent',
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'ตกลง',
                    color: 'primary',
                },
                cancel: {
                    show: false,
                    label: 'ยกเลิก',
                },
            },
            dismissible: true,
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                localStorage.setItem(
                    'contact',
                    JSON.stringify(this.dataForm.value)
                );

                this.profile = localStorage.getItem('profile')
                    ? JSON.parse(localStorage.getItem('profile'))
                    : [];

                const data = {
                    tel: this.dataForm.value.phone,
                    user_id: this.profile.user_id,
                };

                this._service.otp(data).subscribe({
                    next: (resp: any) => {
                        localStorage.setItem('otp', JSON.stringify(resp));
                        this._bottomSheet.open(StepFourOtpComponent);
                    },

                    error: (err: any) => {
                        this.disableError = true;
                        this._changeDetectorRef.markForCheck();
                        alert(1);
                        // this._fuseConfirmationService.open({
                        //     title: 'เกิดข้อผิดพลาด',
                        //     message: err.error.message,
                        //     icon: {
                        //         show: true,
                        //         name: 'heroicons_outline:exclamation-triangle',
                        //         color: 'accent',
                        //     },
                        //     actions: {
                        //         confirm: {
                        //             show: true,
                        //             label: 'ปิด',
                        //             color: 'primary',
                        //         },
                        //         cancel: {
                        //             show: false,
                        //             label: 'ยกเลิก',
                        //         },
                        //     },
                        //     dismissible: true,
                        // });
                        // console.log(err.error.message);
                    },
                });
            }
        });
    }

    onChange(event: any) {
        if (event.target.value) {
            this.disableError = false;
        }
    }
}

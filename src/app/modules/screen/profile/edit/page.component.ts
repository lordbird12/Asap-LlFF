import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
    ElementRef,
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../snackbar/page.component';

@Component({
    selector: 'edit-profile',
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
export class EditComponent implements OnInit {
    dataForm: FormGroup;
    disableError: boolean = false;
    profile: any;
    myBooking: any;
    imageUrl: string = ''; // Initial image URL
    imageUrlBase: string = ''; // Initial image URL
    @ViewChild('fileInput') fileInput!: ElementRef;

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
        private _snackBar: MatSnackBar
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

        this.profile = localStorage.getItem('profile')
            ? JSON.parse(localStorage.getItem('profile'))
            : [];

        if (this.profile) {
            // this.imageUrl = this.profile.pictureUrl;

            // this._service
            //     .getById(this.profile.userId)
            //     .subscribe((resp: any) => {
            //         const item = resp;
            //         this.dataForm.patchValue({
            //             name: item.name,
            //             phone: item.phone,
            //         });
            //         this.imageUrl = item.picture
            //             ? item.picture
            //             : item.pictureUrl;
            //     });

            this._service
                .getProfile(this.profile.userId)
                .subscribe((resp: any) => {
                    if (resp.length > 0) {
                        localStorage.setItem('MyBooking', JSON.stringify(resp));

                        this.myBooking = localStorage.getItem('MyBooking')
                            ? JSON.parse(localStorage.getItem('MyBooking'))
                            : [];

                        const item = resp;
                        this.dataForm.patchValue({
                            name: this.myBooking[0].profile.name,
                            phone: this.myBooking[0].profile.phone,
                        });

                 
                        this.imageUrl = this.profile
                            ? this.profile.pictureUrl
                            : item.pictureUrl;
                    }
                });
        }
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
                const data = {
                    phone: this.dataForm.value.phone,
                    name: this.dataForm.value.name,
                    user_id: this.profile.userId,
                    image: this.imageUrlBase,
                };

                this._service.create(data).subscribe({
                    next: (resp: any) => {
                        this._snackBar.openFromComponent(SnackBarComponent, {
                            duration: 3000,
                            verticalPosition: 'top',
                        });

                        this._service
                        .getProfile(this.profile.userId)
                        .subscribe((resp: any) => {
                            if (resp.length > 0) {
                                localStorage.setItem('MyBooking', JSON.stringify(resp));
        
                                this.myBooking = localStorage.getItem('MyBooking')
                                    ? JSON.parse(localStorage.getItem('MyBooking'))
                                    : [];
        
                                const item = resp;
                                this.dataForm.patchValue({
                                    name: this.myBooking[0].profile.name,
                                    phone: this.myBooking[0].profile.phone,
                                });
        
                         
                                this.imageUrl = this.profile
                                    ? this.profile.pictureUrl
                                    : item.pictureUrl;
                            }
                        });
                    },

                    error: (err: any) => {
                        this.disableError = true;
                        this._changeDetectorRef.markForCheck();

                        this._fuseConfirmationService.open({
                            title: 'เกิดข้อผิดพลาด',
                            message: err.error.message,
                            icon: {
                                show: true,
                                name: 'heroicons_outline:exclamation-triangle',
                                color: 'accent',
                            },
                            actions: {
                                confirm: {
                                    show: true,
                                    label: 'ปิด',
                                    color: 'primary',
                                },
                                cancel: {
                                    show: false,
                                    label: 'ยกเลิก',
                                },
                            },
                            dismissible: true,
                        });
                        // console.log(err.error.message);
                    },
                });
            }
        });
    }

    uploadImage() {
        // Trigger click event on file input when Upload Image button is clicked
        if (this.fileInput) {
            this.fileInput.nativeElement.click();
        }
    }

    onFileSelected(event: any) {
        const file: File = event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            // Update the image source when a new image is selected
            this.imageUrl = reader.result as string;
            this.imageUrlBase = reader.result as string;
            this._changeDetectorRef.markForCheck();
        };

        reader.readAsDataURL(file);
    }
}

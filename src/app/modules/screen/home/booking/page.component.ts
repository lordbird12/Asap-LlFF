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
import { PageService } from '../page.service';
import { CommonModule, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import {
    MatBottomSheet,
    MatBottomSheetModule,
    MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { FuseCardComponent } from '@fuse/components/card';
import { StatusComponent } from '../../booking-detail/status/page.component';
import { ToastService } from 'app/toast.service';
import {
    MatSnackBar,
    MatSnackBarConfig,
    MatSnackBarHorizontalPosition,
} from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../booking-detail/snackbar/page.component';
import { StarsComponent } from '../stars/page.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'home-list',
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
        CommonModule,
        NgClass,
        MatBottomSheetModule,
        FuseCardComponent,
        MatTooltipModule,
    ],
})
export class PageBookingComponent implements OnInit, AfterViewInit {
    @ViewChildren(FuseCardComponent, { read: ElementRef })
    private _fuseCards: QueryList<ElementRef>;
    yearlyBilling: boolean = true;
    dataForm: FormGroup;
    items_check: any[] = [];
    items: any;
    service_remark: string;
    service_input: boolean;
    activeBtn: any;
    bookings: any;
    profile: any;
    activeBtn1: boolean = true;
    activeBtn2: boolean = true;
    toasts = [];
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _service: PageService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _bottomSheet: MatBottomSheet,
        private toastService: ToastService,
        private _snackBar: MatSnackBar
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

        if (this.profile) {
            this._service
                .getProfile(this.profile.userId)
                .subscribe((resp: any) => {
                    if (resp.length > 0) {
                        localStorage.setItem('MyBooking', JSON.stringify(resp));
                    }
                });

            this.bookings = localStorage.getItem('MyBooking')
                ? JSON.parse(localStorage.getItem('MyBooking'))
                : [];

            this.bookings.forEach((element) => {
                if (
                    element?.status != 'รายการจองสิ้นสุดแล้ว' &&
                    element?.status != 'รายการจองถูกยกเลิก'
                ) {
                    this.activeBtn1 = false;
                }

                if (
                    element.status == 'รายการจองสิ้นสุดแล้ว' ||
                    element.status == 'รายการจองถูกยกเลิก'
                ) {
                    this.activeBtn2 = false;
                }
            });
        }
    }

    ngAfterViewInit(): void {
        this._changeDetectorRef.detectChanges();
    }

    tapSelect(number: any): void {
        if (number == 1) {
            this.yearlyBilling == true;
        }
        if (number == 2) {
            this.yearlyBilling == false;
        }

        this._changeDetectorRef.detectChanges();
    }

    viewDetail(booking: any): void {
        this._router.navigate(['screens/booking-detail/' + booking.id]);
    }

    openStatus(booking: any): void {
        const bottomSheetRef = this._bottomSheet.open(StatusComponent, {
            data: {
                id: booking.id,
            },
        });

        bottomSheetRef.afterDismissed().subscribe((data) => {
            if (data) {
                this._snackBar.openFromComponent(SnackBarComponent, {
                    duration: 3000,
                    verticalPosition: 'top',
                });

                this.profile = localStorage.getItem('profile')
                    ? JSON.parse(localStorage.getItem('profile'))
                    : [];

                this._service
                    .getProfile(this.profile.userId)
                    .subscribe((resp: any) => {
                        if (resp.length > 0) {
                            localStorage.setItem(
                                'MyBooking',
                                JSON.stringify(resp)
                            );
                            this._changeDetectorRef.markForCheck();
                        }
                    });
            }

            // this.openSnackBar(
            //     'ยกเลิกการจองสำเร็จ',
            //     'ปิด',
            //     'custom-snackbar',
            //     'end'
            // );
        });
    }

    removeToast(id: string) {
        this.toastService.removeToast(id);
    }

    openSnackBar(
        message: string,
        action: string,
        panelClass: string,
        position: MatSnackBarHorizontalPosition
    ): void {
        const config: MatSnackBarConfig = {
            duration: 333000, // Duration in milliseconds
            horizontalPosition: position,
            verticalPosition: 'top', // Vertical position (top or bottom)
            panelClass: [panelClass], // Array of additional CSS classes
            data: { message: message, icon: 'done' },
        };

        this._snackBar.open(message, action, config);
    }

    openCars(): void {
        this._router.navigate(['screens/services/cars']);
    }

    openEva(): void {
        const bottomSheetRef = this._bottomSheet.open(StarsComponent);

        bottomSheetRef.afterDismissed().subscribe((data) => {
            if (data) {
                this._snackBar.openFromComponent(SnackBarComponent, {
                    duration: 3000,
                    verticalPosition: 'top',
                });

                this.profile = localStorage.getItem('profile')
                    ? JSON.parse(localStorage.getItem('profile'))
                    : [];

                this._service
                    .getProfile(this.profile.userId)
                    .subscribe((resp: any) => {
                        if (resp.length > 0) {
                            localStorage.setItem(
                                'MyBooking',
                                JSON.stringify(resp)
                            );
                            this._changeDetectorRef.markForCheck();
                        }
                    });
            }
        });
    }

    openMap(booking: any): void {
        window.open(
            'https://www.google.com/maps/search/?api=1&query=' +
                booking.service_center.lat +
                ',' +
                booking.service_center.lon
        );
    }

    convertDateFormat(inputDateString: string): string {
        // Split the date string into year, month, and day
        const [year, month, day] = inputDateString.split('-');

        // Create a Date object with the provided year, month (subtracting 1 as months are 0-indexed), and day
        const dateObject: Date = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day)
        );

        // Format the date to 'dd Mon yyyy'
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        };
        const formattedDate: string = dateObject.toLocaleDateString(
            'en-US',
            options
        );

        return formattedDate;
    }

    onImageError(event: Event) {
        const target = event.target as HTMLImageElement;
        target.src = "https://asha-tech.co.th/asap/public/images/not_car.jpg"; // Set your default image path here
    }
}

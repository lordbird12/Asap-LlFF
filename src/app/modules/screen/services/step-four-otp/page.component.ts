import { NgClass, NgFor, NgSwitch, NgSwitchCase } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { FuseCardComponent } from '@fuse/components/card';
import { MatDividerModule } from '@angular/material/divider';
import {
    MatFormFieldControl,
    MatFormFieldModule,
} from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { PageService } from '../page.service';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector: 'otp',
    templateUrl: './page.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        NgClass,
        MatIconModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        NgFor,
        NgClass,
        NgSwitch,
        NgSwitchCase,
        MatMenuModule,
        FuseCardComponent,
        MatDividerModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        ReactiveFormsModule,
    ],
})
export class StepFourOtpComponent implements OnInit, OnDestroy {
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [];
    selectedPanel: string = 'main';
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    phone: string = '';
    // otp: string[] = new Array(6).fill('');
    otpForm: FormGroup;
    dataForm: FormGroup;
    otp: any;
    /**
     * Constructor
     */

    @ViewChild('otpInput1') otpInput1: ElementRef;
    @ViewChild('otpInput2') otpInput2: ElementRef;
    @ViewChild('otpInput3') otpInput3: ElementRef;
    @ViewChild('otpInput4') otpInput4: ElementRef;
    @ViewChild('otpInput5') otpInput5: ElementRef;
    @ViewChild('otpInput6') otpInput6: ElementRef;
    constructor(
        private _bottomSheetRef: MatBottomSheetRef<StepFourOtpComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _service: PageService,
        private _router: Router,
        private _fuseConfirmationService: FuseConfirmationService
    ) {
        this.dataForm = this.formBuilder.group({
            tel: [null, [Validators.required]],
            otp_code: [null, [Validators.required]],
            otp_ref: [null, [Validators.required]],
            token_otp: [null, [Validators.required]],
        });

        this.otpForm = this.formBuilder.group({
            otp1: ['', [Validators.required, Validators.pattern(/^\d$/)]],
            otp2: ['', [Validators.required, Validators.pattern(/^\d$/)]],
            otp3: ['', [Validators.required, Validators.pattern(/^\d$/)]],
            otp4: ['', [Validators.required, Validators.pattern(/^\d$/)]],
            otp5: ['', [Validators.required, Validators.pattern(/^\d$/)]],
            otp6: ['', [Validators.required, Validators.pattern(/^\d$/)]],
            // Add more fields as needed
        });
    }

    // เมื่อผู้ใช้ป้อนค่าในช่อง 1
    onFirstDigitInput(event) {
        // ให้ focus ที่ช่องที่ 2
        if (event.inputType === 'deleteContentBackward') {
            // ให้ focus ที่ช่องก่อนหน้า (ไม่ให้ focus ที่ช่องแรกถ้าอยู่ที่ช่องแรกแล้ว)
            this.otpInput1.nativeElement.focus();
        } else {
            // ให้ focus ที่ช่องที่ 2
            this.otpInput2.nativeElement.focus();
        }
    }

    // เมื่อผู้ใช้ป้อนค่าในช่อง 2 (และสามารถทำในลำดับต่อไปได้)
    onSelect2(event) {
        if (event.inputType === 'deleteContentBackward') {
            // ให้ focus ที่ช่องก่อนหน้า (ไม่ให้ focus ที่ช่องแรกถ้าอยู่ที่ช่องแรกแล้ว)
            this.otpInput1.nativeElement.focus();
        } else {
            // ให้ focus ที่ช่องที่ 2
            this.otpInput3.nativeElement.focus();
        }
        // ตัวอย่าง: ให้ focus ที่ช่องที่ 3
    }
    onSelect3(event) {
        // ตัวอย่าง: ให้ focus ที่ช่องที่ 3

        if (event.inputType === 'deleteContentBackward') {
            // ให้ focus ที่ช่องก่อนหน้า (ไม่ให้ focus ที่ช่องแรกถ้าอยู่ที่ช่องแรกแล้ว)
            this.otpInput2.nativeElement.focus();
        } else {
            // ให้ focus ที่ช่องที่ 2
            this.otpInput4.nativeElement.focus();
        }
    }
    onSelect4(event) {
        // ตัวอย่าง: ให้ focus ที่ช่องที่ 3
        this.otpInput5.nativeElement.focus();

        if (event.inputType === 'deleteContentBackward') {
            // ให้ focus ที่ช่องก่อนหน้า (ไม่ให้ focus ที่ช่องแรกถ้าอยู่ที่ช่องแรกแล้ว)
            this.otpInput3.nativeElement.focus();
        } else {
            // ให้ focus ที่ช่องที่ 2
            this.otpInput5.nativeElement.focus();
        }
    }
    onSelect5(event) {
        // ตัวอย่าง: ให้ focus ที่ช่องที่ 3
        if (event.inputType === 'deleteContentBackward') {
            // ให้ focus ที่ช่องก่อนหน้า (ไม่ให้ focus ที่ช่องแรกถ้าอยู่ที่ช่องแรกแล้ว)
            this.otpInput4.nativeElement.focus();
        } else {
            // ให้ focus ที่ช่องที่ 2
            this.otpInput6.nativeElement.focus();
        }
    }

    submit(event) {
        this.otp = localStorage.getItem('otp')
            ? JSON.parse(localStorage.getItem('otp'))
            : [];

        const data = {
            otp_ref: this.otp.otp.otp_ref,
            token_otp: this.otp.otp.token,
            tel: this.otp.otp.tel,
            otp_code:
                this.otpForm.value.otp1 +
                this.otpForm.value.otp2 +
                this.otpForm.value.otp3 +
                this.otpForm.value.otp4 +
                this.otpForm.value.otp5 +
                this.otpForm.value.otp6,
        };

        // this.dataForm.patchValue({
        //     otp_ref: this.otp.otp.otp_ref,
        //     token_otp: this.otp.otp.token,
        //     tel: this.otp.otp.tel,
        //     otp_code:
        //         this.otpForm.value.otp1 +
        //         this.otpForm.value.otp2 +
        //         this.otpForm.value.otp3 +
        //         this.otpForm.value.otp4 +
        //         this.otpForm.value.otp5 +
        //         this.otpForm.value.otp6,
        // });
        const confirmation = this._fuseConfirmationService.open({
            title: 'ยืนยัน OTP',
            message: 'คุณต้องการยืนยัน OTPใช่หรือไม่ ?',
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
                this._service.confirm_otp(data).subscribe({
                    next: (resp: any) => {
                        this._bottomSheetRef.dismiss();
                        this._router.navigate(['screens/booking/confirm']);
                    },

                    error: (err: any) => {
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

        // return;
        // if (event.inputType === 'deleteContentBackward') {
        //     // ให้ focus ที่ช่องก่อนหน้า (ไม่ให้ focus ที่ช่องแรกถ้าอยู่ที่ช่องแรกแล้ว)
        //     this.otpInput5.nativeElement.focus();
        // } else {
        //     // ให้ focus ที่ช่องที่ 2
        //     this.closeBottomSheet(event);
        // }
    }

    closeBottomSheet(event: MouseEvent): void {
        this._bottomSheetRef.dismiss();
        event.preventDefault();
    }

    ngAfterViewInit() {
        // ให้ focus ที่ช่องแรกทันที
        this.otpInput1.nativeElement.focus();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Setup available panels
        this.panels = [
            {
                id: 'home-main',
                icon: 'heroicons_outline:user-circle',
                title: 'Account',
                description:
                    'Manage your public profile and private information',
            },
            {
                id: 'home-list',
                icon: 'heroicons_outline:lock-closed',
                title: 'Security',
                description:
                    'Manage your password and 2-step verification preferences',
            },
        ];

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Set the drawerMode and drawerOpened
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                } else {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Navigate to the panel
     *
     * @param panel
     */
    goToPanel(): void {
        if (this.selectedPanel == '') {
            this.selectedPanel = 'main';
        } else if (this.selectedPanel == 'main') {
            this.selectedPanel = 'list';
        }

        console.log(this.selectedPanel);
        // this.selectedPanel = panel;

        // Close the drawer on 'over' mode
        if (this.drawerMode === 'over') {
            this.drawer.close();
        }
    }

    /**
     * Get the details of the panel
     *
     * @param id
     */
    getPanelInfo(id: string): any {
        return this.panels.find((panel) => panel.id === id);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}

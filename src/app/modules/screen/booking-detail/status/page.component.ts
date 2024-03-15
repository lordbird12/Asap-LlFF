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
import {
    MatBottomSheet,
    MatBottomSheetModule,
    MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { NgxStarsComponent, NgxStarsModule } from 'ngx-stars';
import { Router } from '@angular/router';
import { AnalyticsMockApi } from 'app/mock-api/dashboards/analytics/api';
import { PageService } from '../page.service';
import { CancelDialogComponent } from '../cancel/page.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from 'app/toast.service';
import { SnackBarComponent } from '../snackbar/page.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CancelComponent } from '../../home/cancel/page.component';

@Component({
    selector: 'start',
    templateUrl: './page.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./page.component.scss'],
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
        NgxStarsModule,
        MatBottomSheetModule,
    ],
})
export class StatusComponent implements OnInit, OnDestroy {
    @ViewChild(NgxStarsComponent)
    starsComponent: NgxStarsComponent;
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [];
    selectedPanel: string = 'main';
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    phone: string = '085-036-0033';
    // otp: string[] = new Array(6).fill('');
    otpForm: FormGroup;
    toasts = [];
    /**
     * Constructor
     */
    constructor(
        private _bottomSheetRef: MatBottomSheetRef<StatusComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _router: Router,
        private _service: PageService,
        private _bottomSheet: MatBottomSheet,
        private _fuseConfirmationService: FuseConfirmationService,
        private dialog: MatDialog,
        private toastService: ToastService,
        private _snackBar: MatSnackBar
    ) {}
    ngAfterViewInit() {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {}

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

    selectMap() {
        this._bottomSheetRef.dismiss();
        this._router.navigate(['screens/search/main']);
    }

    // openCancel(): void {
    //     this._bottomSheetRef.dismiss();

    //     this._bottomSheet.open(CancelDialogComponent, {
    //         panelClass: 'my-component-bottom-sheet',
    //     });
    // }

    // openCancel() {
    //     const dialogRef = this.dialog.open(CancelDialogComponent, {
    //         width: '500px', // กำหนดความกว้างของ Dialog
    //         data: {
    //             data: 1,
    //         },
    //     });
    //     dialogRef.afterClosed().subscribe((result) => {
    //         if (result) {
    //             this._bottomSheet.dismiss(result);
    //             // if (result) {
    //             //     this.toastService.toastsSubject.subscribe((toasts) => {
    //             //         this.toasts = toasts;
    //             //     });
    //             // }
    //         }
    //     });
    // }

    openCancel(): void {
        const bottomSheetRef = this._bottomSheet.open(CancelComponent);

        bottomSheetRef.afterDismissed().subscribe((data) => {
            if (data) {
                this._snackBar.openFromComponent(CancelComponent, {
                    duration: 3000,
                    verticalPosition: 'top',
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

    openPostpon():void{
        this._bottomSheetRef.dismiss();
        this._router.navigate(['screens/postpon/date']);
    }
}

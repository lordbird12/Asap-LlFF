import { NgClass, NgFor, NgSwitch, NgSwitchCase } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router';
import {
    MatBottomSheet,
    MatBottomSheetModule,
    MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { PageService } from '../page.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { StatusComponent } from '../status/page.component';
import { CancelComponent } from '../../home/cancel/page.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../snackbar/page.component';

@Component({
    selector: 'services',
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
        MatBottomSheetModule,
    ],
})
export class DetailCancelComponent implements OnInit, OnDestroy {
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [];
    selectedPanel: string = 'main';
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    item: any;
    id: any;
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _bottomSheet: MatBottomSheet,
        private _service: PageService,
        private _router: Router,
        private _fuseConfirmationService: FuseConfirmationService,
        public activatedRoute: ActivatedRoute,
        private _snackBar: MatSnackBar,
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.id = this.activatedRoute.snapshot.paramMap.get('id');

        if (this.id) {
            this._service.getById(this.id).subscribe((resp: any) => {
                this.item = resp.data;
                this._changeDetectorRef.markForCheck();
            });

            const bottomSheetRef = this._bottomSheet.open(CancelComponent,{
                data:{
                    id:this.id
                }
            });

            bottomSheetRef.afterDismissed().subscribe((data) => {
                if (data) {
                    this._snackBar.openFromComponent(SnackBarComponent, {
                        duration: 3000,
                        verticalPosition: 'top',
                        data: {
                            id: this.id,
                        },
                    });
                }
            });
        }


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

    submit(): void {}

    openMap(): void {
        window.open(
            'https://www.google.com/maps/search/?api=1&query=' +
                this.item.service_center.lat +
                ',' +
                this.item.service_center.lon
        );
    }

    openLine(): void {
        window.open('https://lin.ee/ElR0GHv');
    }

    openStatus(): void {
        this._bottomSheet.open(StatusComponent);
    }
}

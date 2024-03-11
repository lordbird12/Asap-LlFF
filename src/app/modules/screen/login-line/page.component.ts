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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PageService } from './page.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { getCookie, setCookie } from 'typescript-cookie';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import liff from '@line/liff';

@Component({
    selector: 'page',
    templateUrl: './page.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./page.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatSidenavModule,
        MatCheckboxModule,
        MatButtonModule,
        MatIconModule,
        NgFor,
        NgClass,
        NgSwitch,
        NgSwitchCase,
        MatOptionModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
    ],
})
export class PageComponent implements OnInit, OnDestroy {
    title = 'angular-line-login';
    idToken = '';
    displayName = '';
    pictureUrl = '';
    statusMessage = '';
    userId = '';
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    param: any;
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private route: ActivatedRoute,
        private _service: PageService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            // Access and use query parameters here
            this.param = params;

            this.initLine();
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
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    initLine(): void {
        liff.init(
            { liffId: '2003760286-Mk9gQ2gG' },
            () => {
                if (liff.isLoggedIn()) {
                    this.runApp();
                } else {
                    liff.login();
                }
            },
            (err) => console.error(err)
        );
    }

    runApp(): void {
        const idToken = liff.getIDToken();
        this.idToken = idToken;
        liff.getProfile()
            .then((profile) => {
                localStorage.setItem('profile', JSON.stringify(profile));
                if (this.param['liff.state']) {
                    const id = this.param['liff.state'].replace(
                        '?template_id=',
                        ''
                    );

                    if (id != '') {
                        this._service
                            .getProfile(profile.userId)
                            .subscribe((resp: any) => {
                                if (resp.length > 0) {
                                    localStorage.setItem(
                                        'MyBooking',
                                        JSON.stringify(resp)
                                    );
                                    this._router.navigate([
                                        'screens/postpon/finish',
                                    ]);
                                } else {
                                    this._router.navigate(['screens/policy']);
                                }
                            });
                    } else {
                        this._service
                            .getProfile(profile.userId)
                            .subscribe((resp: any) => {
                                if (resp.length > 0) {
                                    localStorage.setItem(
                                        'MyBooking',
                                        JSON.stringify(resp)
                                    );
                                    this._router.navigate([
                                        'screens/home/booking',
                                    ]);
                                } else {
                                    this._router.navigate(['screens/policy']);
                                }
                            });
                    }
                } else {
                    this._service
                        .getProfile(profile.userId)
                        .subscribe((resp: any) => {
                            if (resp.length > 0) {
                                localStorage.setItem(
                                    'MyBooking',
                                    JSON.stringify(resp)
                                );
                                this._router.navigate(['screens/home/booking']);
                            } else {
                                this._router.navigate(['screens/policy']);
                            }
                        });
                }
            })
            .catch((err) => console.error(err));
    }

    logout(): void {
        liff.logout();
        window.location.reload();
    }

    Submit(): void {}
}

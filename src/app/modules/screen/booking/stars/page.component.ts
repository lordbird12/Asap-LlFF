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
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { NgxStarsComponent, NgxStarsModule } from 'ngx-stars';

@Component({
  selector: 'start',
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
    NgxStarsModule
  ],
})
export class StarsComponent implements OnInit, OnDestroy {
  @ViewChild(NgxStarsComponent)
  starsComponent: NgxStarsComponent;
  @ViewChild('drawer') drawer: MatDrawer;
  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;
  panels: any[] = [];
  selectedPanel: string = 'main';
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  formFieldHelpers: string[] = ['fuse-mat-dense'];
  phone: string = '085-036-0033'
  // otp: string[] = new Array(6).fill('');
  otpForm: FormGroup;
  /**
   * Constructor
   */
  constructor(
    private _bottomSheetRef: MatBottomSheetRef<StarsComponent>,
    private _changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private _fuseMediaWatcherService: FuseMediaWatcherService,

  ) {

  }
  ngAfterViewInit() {

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
      }
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
    if (this.selectedPanel == "") {
      this.selectedPanel = "main";
    } else if (this.selectedPanel == "main") {
      this.selectedPanel = "list";
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

  ratingDisplay: number = 0;

  onRatingSet(rating: number): void {
    console.log(rating)

    this.ratingDisplay = rating;
  }

  closeBottomSheet(): void {
    this._bottomSheetRef.dismiss();
  }
}

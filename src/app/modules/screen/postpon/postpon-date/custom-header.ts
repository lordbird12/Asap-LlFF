import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    LOCALE_ID,
} from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MatDateFormats,
} from '@angular/material/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';

export const MY_FORMATS = {
    parse: {
        dateInput: 'DD',
    },
    display: {
        dateInput: 'DD',
        monthYearLabel: 'LLL yyyy',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: 'app-custom-calendar-header',
    standalone: true,
    template: `
        <div class="example-header">
            <!-- <mat-icon
                class="icon-size-5"
                svgIcon="heroicons_outline:map-pin"
                (click)="previousClicked('year')"
            ></mat-icon> -->
            <mat-icon
                class="icon-size-5"
                svgIcon="heroicons_outline:chevron-left"
                (click)="previousClicked('month')"
            ></mat-icon>

            <span class="example-header-label text-xl font-bold">{{ periodLabel }}</span>
            <!-- <mat-icon
                class="icon-size-5"
                svgIcon="heroicons_outline:map-pin"
                (click)="nextClicked('year')"
            ></mat-icon> -->
            <mat-icon
                class="icon-size-5"
                svgIcon="heroicons_outline:chevron-right"
                (click)="nextClicked('month')"
            ></mat-icon>
        </div>
    `,
    styles: [
        `
            .mat-calendar-body-label {
                display: none !important;
            }

            .custom-calendar .mat-calendar-previous-button,
            .custom-calendar .mat-calendar-next-button {
                display: none; /* Optional: Hide previous and next buttons */
            }

            .custom-calendar .mat-calendar-table {
                width: 100%;
            }

            .custom-calendar .mat-calendar-body-label {
                display: none; /* Hide month labels */
            }

            .custom-calendar .mat-calendar-body-cell {
                font-size: 12px; /* Optional: Adjust font size */
            }

            .custom-calendar .mat-calendar-body-cell.in-other-month {
                color: #888; /* Customize the color of the days in the last month */
            }
        `,
    ],
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
    ],
    providers: [
        {
            provide: MAT_DATE_FORMATS,
            useValue: {
                display: {
                    monthYearLabel: 'MMM yyyy',
                    dateInput: 'MMM DD, YYYY',
                    monthColumnHeader: 'short',
                    yearColumnHeader: 'short',
                },
            },
        },
    ],
})
export class CustomCalendarHeaderComponent {
    monthAndYear: string = '';
    private _destroyed = new Subject<void>();
    constructor(
        private _calendar: MatCalendar<any>,
        private _dateAdapter: DateAdapter<any>,
        @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats,
        cdr: ChangeDetectorRef
    ) {
        _calendar.stateChanges
            .pipe(takeUntil(this._destroyed))
            .subscribe(() => cdr.markForCheck());
    }

    navigateToPreviousMonth() {
        // this.matCalendar.activeDate = this.matCalendar._dateAdapter.addCalendarMonths(this.matCalendar.activeDate, -1);
        this.updateMonthAndYear();
    }

    navigateToNextMonth() {
        // this.matCalendar.activeDate = this.matCalendar._dateAdapter.addCalendarMonths(this.matCalendar.activeDate, 1);
        this.updateMonthAndYear();
    }

    private updateMonthAndYear() {
        // this.monthAndYear = this.matCalendar._dateAdapter.format(this.matCalendar.activeDate, 'MMMM y', this.matCalendar.locale);
    }

    get periodLabel() {
        return this._dateAdapter
            .format(
                this._calendar.activeDate,
                this._dateFormats.display.monthYearLabel
            )
            .toLocaleUpperCase();
    }

    previousClicked(mode: 'month' | 'year') {
        this._calendar.activeDate =
            mode === 'month'
                ? this._dateAdapter.addCalendarMonths(
                      this._calendar.activeDate,
                      -1
                  )
                : this._dateAdapter.addCalendarYears(
                      this._calendar.activeDate,
                      -1
                  );
    }

    nextClicked(mode: 'month' | 'year') {
        this._calendar.activeDate =
            mode === 'month'
                ? this._dateAdapter.addCalendarMonths(
                      this._calendar.activeDate,
                      1
                  )
                : this._dateAdapter.addCalendarYears(
                      this._calendar.activeDate,
                      1
                  );
    }
}

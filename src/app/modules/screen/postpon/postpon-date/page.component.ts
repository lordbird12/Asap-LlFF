import { TextFieldModule } from '@angular/cdk/text-field';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
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
    MatCalendarCellCssClasses,
    MatDatepickerModule,
} from '@angular/material/datepicker';
import { CustomCalendarHeaderComponent } from './custom-header';
import moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';

export const MY_FORMATS = {
    parse: {
        dateInput: 'YYYY-MM-DD',
    },
    display: {
        dateInput: 'YYYY-MM-DD',
        monthYearLabel: 'YYYY-MM-DD',
        dateA11yLabel: 'YYYY-MM-DD',
        monthYearA11yLabel: 'YYYY-MM-DD',
    },
};

@Component({
    selector: 'postpon-date',
    templateUrl: './page.component.html',
    styles: [
        `
            .disabled-date {
                pointer-events: none; /* Disable click events */
                opacity: 0.5;
            }
            .mat-calendar-body-selected {
                background-color: #ff595a !important;
            }
            .mat-calendar-body-today:not(.mat-calendar-body-selected):not(
                    .mat-calendar-body-comparison-identical
                ) {
                border: unset !important;
                color: #ff595a !important;
            }
            .mat-calendar {
                background: white;
                padding: 5px;
                border-radius: 10px;
            }
            .mat-calendar-body-label {
                visibility: hidden !important;
            }

            .mat-calendar-label {
                display: none !important;
            }
            .example-header {
                display: flex;
                align-items: center;
                padding: 0.5em;
            }

            .example-header-label {
                flex: 1;
                // height: 1em;
                font-weight: 500;
                text-align: center;
            }

            .example-double-arrow .mat-icon {
                margin: -22%;
            }
        `,
    ],
    encapsulation: ViewEncapsulation.None,
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
        MatDatepickerModule,
    ],
    providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
})
export class PostponDateComponent implements OnInit {
    addForm: UntypedFormGroup;
    selected: Date | null;
    id: any;

    dateClass = (date: Date): MatCalendarCellCssClasses => {
        const today = new Date();

        const daysDifference = Math.floor((date.valueOf() - today.valueOf()) / (1000 * 60 * 60 * 24));


        // const daysDifference = Math.floor(
        //     (date.getTime() - today.getTime()) /
        //         (1000 * 60 * 60 * 24)
        // );

        if(daysDifference < 0 || daysDifference >= 90){
            return 'disabled-date';
        }else{
            return '';
        }
    };

    customHeader = CustomCalendarHeaderComponent;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _changeDetectorRef: ChangeDetectorRef,
        private _activatedRoute: ActivatedRoute
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.id = this._activatedRoute.snapshot.paramMap.get('id');
    }

    onSelect(event) {
        var date = event.c.year + '-' + event.c.month + '-' + event.c.day;
        this._router.navigate(['screens/postpon/time/' + date + '/' + this.id]);
    }

    private getDateString(date: Date): string {
        return date.toISOString().slice(0, 10);
    }
}

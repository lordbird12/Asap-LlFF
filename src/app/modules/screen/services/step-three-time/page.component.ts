import { TextFieldModule } from '@angular/cdk/text-field';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
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
import { ActivatedRoute, Router } from '@angular/router';
import {
    MatBottomSheet,
    MatBottomSheetModule,
    MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MapComponent } from '../map/page.component';

@Component({
    selector: 'step-main',
    templateUrl: './page.component.html',
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
        CommonModule,
        NgClass,
        MatBottomSheetModule,
    ],
})
export class StepThreeTimeComponent implements OnInit {
    addForm: UntypedFormGroup;
    items: any[] = [];
    items_check: any[] = [];
    item: any;
    service_remark: string;
    service_input: boolean;
    activeBtn: any;
    num: any;
    date: any;
    time: any;
    date_format: any;
    hours: string[] = [];
    selectedHour: string;
    minutes: number[] = [];
    selectedMinute: number;
    months: any = [
        '',
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _service: PageService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _bottomSheet: MatBottomSheet,
        private _activatedRoute: ActivatedRoute
    ) {
        this.generateHours();
        this.generateMinutes();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.date = this._activatedRoute.snapshot.paramMap.get('date');

        if (this.date) {
            this.date_format = this.date.split('-');
        }

        this.service_input = false;
        this.item = localStorage.getItem('data')
            ? JSON.parse(localStorage.getItem('data')).data
            : [];

        this._service.getServices().subscribe((resp: any) => {
            try {
                this.items = resp.data;
                for (let index = 0; index < this.items.length; index++) {
                    const obj = {
                        check: false,
                        image: this.items[index].image,
                        name: this.items[index].name,
                        remark: this.items[index].remark,
                        type: this.items[index].type,
                    };

                    // 👇 Push object to array

                    this.items_check.push(obj);
                }
                this.num = this.items_check.length;
                // console.log(this.items_check);
                this._changeDetectorRef.markForCheck();
            } catch (error) {
                console.log(error);
            }
        });
    }

    generateHours() {
        for (let i = 8; i <= 16; i++) {
            for (let j = 0; j < 60; j += 15) {
                const hourString = `${i < 10 ? '0' + i : i}:${
                    j === 0 ? '00' : j
                }`;
                this.hours.push(hourString);
            }
        }
    }

    generateMinutes() {
        for (let i = 15; i <= 45; i += 15) {
          this.minutes.push(i);
        }
      }
      
    submit() {
        if (this.time) {
            this._router.navigate(['screens/services/step-four']);
        }
        // localStorage.setItem('services', JSON.stringify(this.items_check));
        // this._bottomSheet.open(MapComponent);
    }

    addService(index) {
        if (this.items_check[index].check) {
            this.items_check[index].check = false;
            this.service_remark = '';

            if (this.items_check[index].type == 'Input') {
                this.service_input = false;
            }
        } else {
            this.items_check[index].check = true;
            this.service_remark = this.items_check[index].remark;

            if (this.items_check[index].type == 'Input') {
                this.service_input = true;
            }
        }
        this.num = this.items_check.length;

        this.items_check.forEach((element) => {
            if (element.check == false) {
                this.num--;
            }

            if (this.num <= 0) {
                this.activeBtn = false;
            } else {
                this.activeBtn = true;
            }
        });
    }

    addTime(time) {
        this.time = time;
        const data = {
            date: this.date,
            time: time,
        };
        localStorage.setItem('sevice_date_time', JSON.stringify(data));
    }

    editDate() {
        this._router.navigate(['screens/services/step-three']);
    }
}

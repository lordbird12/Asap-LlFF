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
import { ConfirmComponent } from '../confirm/page.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../snackbar/page.component';

@Component({
    selector: 'postpon-time',
    templateUrl: './page.component.html',
    encapsulation: ViewEncapsulation.None,
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
    ],
})
export class PostponTimeComponent implements OnInit {
    addForm: UntypedFormGroup;
    items: any[] = [];
    items_check: any[] = [];
    item: any;
    service_remark: string;
    service_input: boolean;
    activeBtn: any;
    num: any;
    id: any;
    date: any;
    time: any;
    date_format: any;
    months: any = [
        '',
        'jan',
        'feb',
        'mar',
        'apr',
        'may',
        'jun',
        'jul',
        'aug',
        'sep',
        'oct',
        'nov',
        'dec',
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
        private _activatedRoute: ActivatedRoute,
        private _snackBar: MatSnackBar,
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.id = this._activatedRoute.snapshot.paramMap.get('id');
        this.date = this._activatedRoute.snapshot.paramMap.get('date');

        if (this.date) {
            this.date_format = this.date.split('-');
        }

        this.service_input = false;
        this.item = localStorage.getItem('change_date_time')
            ? JSON.parse(localStorage.getItem('change_date_time')).data
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

    submit() {
        this._router.navigate(['screens/services/step-four']);
        // localStorage.setItem('services', JSON.stringify(this.items_check));
        // this._bottomSheet.open(MapComponent);
    }

    openConfirm(): void {
        const bottomSheetRef = this._bottomSheet.open(ConfirmComponent, {
            data: {
                id: this.id,
                date: this.date,
                time: this.time,
            },
        });

        bottomSheetRef.afterDismissed().subscribe((data) => {
            if (data) {
                this._snackBar.openFromComponent(SnackBarComponent, {
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
            id: this.id,
            date: this.date,
            time: time,
        };
        localStorage.setItem('change_date_time', JSON.stringify(data));
    }

    editDate() {
        this._router.navigate(['screens/services/step-three']);
    }
}

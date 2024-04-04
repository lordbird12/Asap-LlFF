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
import {
    MatBottomSheet,
    MatBottomSheetModule,
    MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { FuseCardComponent } from '@fuse/components/card';
import { Router } from '@angular/router';
import { PageService } from '../page.service';
import { CommonModule, NgClass } from '@angular/common';

@Component({
    selector: 'cars',
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
        MatBottomSheetModule,
        FuseCardComponent,
        NgClass,
        CommonModule,
    ],
})
export class CarsComponent implements OnInit {
    @ViewChildren(FuseCardComponent, { read: ElementRef })
    private _fuseCards: QueryList<ElementRef>;
    dataForm: FormGroup;
    map: any; // Assuming you have a reference to the map object
    items: any;
    profile: any;
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _bottomSheet: MatBottomSheet,
        private _service: PageService,
        private _router: Router,
        private _changeDetectorRef: ChangeDetectorRef
    ) {}

    openBottomSheet(): void {
        // this._bottomSheet.open(MapComponent);
    }

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

        this._service
            .get_my_cars(this.profile.userId)
            .subscribe((resp: any) => {
                this.items = resp;
                this._changeDetectorRef.markForCheck();
            });
    }
    

    booking(item:any): void {
        const data = {
            license: item.license,
            id_token: this.profile.idToken,
            display_name: this.profile.displayName,
            picture_url: this.profile.pictureUrl,
            user_id: this.profile.userId,
        };

        this._service.reg_license(data).subscribe((resp: any) => {
            try {
                // this.item = resp.data;
                if (resp.data) {
                    const obj = {
                        data: resp.data,
                    };

                    localStorage.setItem('data', JSON.stringify(obj));
                    this._router.navigate(['screens/reg-kg/list']);
                }
                this._changeDetectorRef.markForCheck();
            } catch (error) {
                console.log(error);
            }
        });
    }

    submit():void{
        this._router.navigate(['screens/reg-license-plate/list']);
    }
}

import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';
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
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { PageService } from '../page.service';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector: 'list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        FormsModule,
        MatFormFieldModule,
        NgClass,
        MatInputModule,
        TextFieldModule,
        ReactiveFormsModule,
        MatButtonToggleModule,
        MatButtonModule,
        MatSelectModule,
        MatOptionModule,
        MatChipsModule,
        MatDatepickerModule,
        MatPaginatorModule,
        MatTableModule,
    ],
})
export class ListComponent implements OnInit, AfterViewInit {
    dataForm: FormGroup;
    disableBtn: boolean = true;
    licensePlate: string = '';
    isLoading: boolean = false;
    disableError: boolean = false;
    profile: any;
    placeholder: string = ''; // No placeholder initially
    dataRow: any[] = [];

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    constructor(
        private dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: PageService,
        private _router: Router,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService
    ) {}

    ngOnInit() {
        this.dataForm = this._formBuilder.group({
            license: ['', [Validators.required]],
        });
    }

    ngAfterViewInit(): void {
        this._changeDetectorRef.detectChanges();
    }

    onChange(event: any) {
        if (event.target.value) {
            this.disableBtn = false;
        } else {
            this.disableBtn = true;
        }

        event.target.value = event.target.value
            .replace(/[^ก-ฮ0-9]/g, '')
            .toUpperCase();
        event.target.value = event.target.value.replace(
            /([ก-ฮ]{2})([0-9]{4})/,
            '$1-$2'
        );

        this.dataForm.patchValue({
            license: event.target.value.slice(0, 8),
        });

        const obj = {
            license: this.dataForm.value.license,
        };

        this.disableError = false;
        this._changeDetectorRef.markForCheck();
    }

    formatLicensePlate(): void {
        // Implement the logic to format the license plate as per your requirements
        // For example, you can add dashes or other separators
        // Here's a simple example:
        this.licensePlate = this.licensePlate
            .replace(/[^A-Za-z0-9]/g, '')
            .toUpperCase();
        this.licensePlate = this.licensePlate.replace(
            /([A-Z0-9]{3})([A-Z0-9]{3})/,
            '$1-$2'
        );
    }

    submit() {
        this.profile = localStorage.getItem('profile')
            ? JSON.parse(localStorage.getItem('profile'))
            : [];

        if (this.profile) {
            const data = {
                license: this.dataForm.value.license,
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
                    } else {
                        this.disableError = true;
                    }
                    this._changeDetectorRef.markForCheck();
                } catch (error) {
                    this.disableError = true;
                    console.log(error);
                }
            });
        } else {
            this._router.navigate(['screens/authen']);
        }
    }

}

import {
    HttpClient,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpHeaders,
    HttpInterceptor,
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
    BehaviorSubject,
    filter,
    map,
    Observable,
    of,
    Subject,
    switchMap,
    take,
    tap,
    throwError,
} from 'rxjs';
import { environment } from 'environments/environment.development';
import { Form } from '@angular/forms';
import { DataTablesResponse } from 'app/shared/datatable.types';
const token = localStorage.getItem('accessToken') || null;

@Injectable({ providedIn: 'root' })
export class PageService {
    // Private
    private _data: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private positionSubject = new Subject<any>();

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    httpOptionsFormdata = {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    };

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    create(data: FormData): Observable<any> {
        return this._httpClient
            .post<any>(environment.baseURL + '/api/permission', data)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    otp(data: any): Observable<any> {
        return this._httpClient
            .post<any>(environment.baseURL + '/api/confirm_otp', data)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    confirm_otp(data: any): Observable<any> {
        return this._httpClient
            .post<any>(environment.baseURL + '/api/verify_otp', data)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    booking(data: any): Observable<any> {
        return this._httpClient
            .post<any>(environment.baseURL + '/api/booking', data)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    update(data: any, id: any): Observable<any> {
        return this._httpClient
            .put<any>(environment.baseURL + '/api/permission/' + id, data)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    delete(id: any): Observable<any> {
        return this._httpClient.delete<any>(
            environment.baseURL + '/api/permission/' + id,
            { headers: this.httpOptionsFormdata.headers }
        );
    }

    getAllMenu(): Observable<any> {
        return this._httpClient.get(environment.baseURL + '/api/get_menu').pipe(
            switchMap((response: any) => {
                return of(response.data);
            })
        );
    }

    getServices(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_services')
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    getPermission(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_permission')
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    /**
     * Get products
     *
     *
     * @param page
     * @param perPage
     * @param sortBy
     * @param order
     * @param search
     */

    getPage(dataTablesParameters: any): Observable<DataTablesResponse> {
        return this._httpClient
            .post(
                environment.baseURL + '/api/permission_page',
                dataTablesParameters,
                this.httpOptionsFormdata
            )
            .pipe(
                switchMap((response: any) => {
                    return of(response.data);
                })
            );
    }

    getById(id: any): Observable<any> {
        return this._httpClient
            .get<any>(
                environment.baseURL + '/api/get_car_by_license_plate/' + id
            )
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    getPosition(): Observable<any> {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => this.positionSubject.next(position),
                (error) => this.positionSubject.error(error)
            );
        } else {
            this.positionSubject.error(
                'Geolocation is not supported by this browser.'
            );
        }

        return this.positionSubject.asObservable();
    }

    get_loations(data: any): Observable<any> {
        return this._httpClient
            .get<any>(
                'https://api.longdo.com/map/services/address?lon=' +
                    data.lon +
                    '&lat=' +
                    data.lat +
                    '&noelevation=1&key=ca1a48a17e613c75c68d82fe7f71893b'
            )
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    get_service_centers(data: any): Observable<any> {
        return this._httpClient
            .post<any>(
                environment.baseURL + '/api/get_service_center_by_lat_lng',
                data
            )
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    get_service_centers_recommend(data: any): Observable<any> {
        return this._httpClient
            .post<any>(
                environment.baseURL +
                    '/api/get_service_center_by_lat_lng_recommend',
                data
            )
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    get_my_loations(data: any): Observable<any> {
        return this._httpClient
            .get<any>(
                'https://api.longdo.com/map/services/address?lon=' +
                    data.lon +
                    '&lat=' +
                    data.lat +
                    '&noelevation=1&key=ca1a48a17e613c75c68d82fe7f71893b'
            )
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    get_my_cars(userId: any): Observable<any> {
        return this._httpClient
            .post(environment.baseURL + '/api/get_my_cars', {
                user_id: userId,
            })
            .pipe(
                switchMap((response: any) => {
                    return of(response.data);
                })
            );
    }

    reg_license(data: any): Observable<any> {
        return this._httpClient
            .post<any>(
                environment.baseURL + '/api/get_car_by_license_plate',
                data
            )
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { catchError, Subscription, tap, throwError } from 'rxjs';

import { CurrencyDTO, DocumentDTO } from '../models/samsung-models';
import { SamsungApiService } from '../services/samsung-api.service';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss']
})
export class EvaluationComponent implements OnInit, OnDestroy {

  alertType: string = '';
  error: boolean = false;
  errorMessage: string = '';

  documentNumber: string = '';
  currency: string = '';
  documentDateFrom: NgbDateStruct | null;
  documentDateTo: NgbDateStruct | null;

  currencies: Array<CurrencyDTO> = [];
  documents: Array<DocumentDTO> = [];

  $currencySubscription: Subscription;
  $searchSubscription: Subscription;

  constructor(private samsungApiService: SamsungApiService) { }

  ngOnInit(): void {
    this.$currencySubscription = this.samsungApiService.listCurrencies().pipe(
      tap(response => this.currencies = response),
      catchError(error => {
        this.alertType = 'danger';
        this.error = true;
        this.errorMessage = 'An error occurred while trying to retrieve currencies';

        return throwError(() => error);
      })).subscribe();
  }

  ngOnDestroy(): void {
    this.$currencySubscription.unsubscribe();
    this.$searchSubscription.unsubscribe();
  }

  search(): void {
    this._clearError();
    let dateFrom: string = '';
    let dateTo: string = '';

    if (!!this.documentDateFrom) {
      const month: string = this.documentDateFrom.month.toString().length === 1 ? `0${this.documentDateFrom.month}` : this.documentDateFrom.month.toString();
      const day: string = this.documentDateFrom.day.toString().length === 1 ? `0${this.documentDateFrom.day}` : this.documentDateFrom.day.toString();
      dateFrom = `${this.documentDateFrom.year}-${month}-${day}`;
    }

    if (!!this.documentDateTo) {
      const month: string = this.documentDateTo.month.toString().length === 1 ? `0${this.documentDateTo.month}` : this.documentDateTo.month.toString();
      const day: string = this.documentDateTo.day.toString().length === 1 ? `0${this.documentDateTo.day}` : this.documentDateTo.day.toString();
      dateTo = `${this.documentDateTo.year}-${month}-${day}`;
    }

    this.$searchSubscription = this.samsungApiService.listDocuments(this.documentNumber, this.currency, dateFrom, dateTo).pipe(
      tap(response => {
        this.documents = response;
        if (this.documents.length === 0) {
          this.alertType = 'warning';
          this.error = true;
          this.errorMessage = 'No documents found';
        }
      }),
      catchError(error => {
        this.alertType = 'danger';
        this.error = true;
        this.errorMessage = 'An error occurred while trying to search for the documents';

        return throwError(() => error);
      })).subscribe();
  }

  clean(): void {
    this._clearError();
    this.documents = [];
    this.documentNumber = '';
    this.currency = '';
    this.documentDateFrom = null;
    this.documentDateTo = null;
  }

  private _clearError(): void {
    this.error = false;
    this.errorMessage = '';
    this.alertType = '';
  }

}

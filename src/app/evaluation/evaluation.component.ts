import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { catchError, Subscription, tap, throwError } from 'rxjs';

import { CurrencyDTO, DocumentDTO, QuotationDTO } from '../models/samsung-models';
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

  dateFrom: string = '';
  dateTo: string = '';

  currencies: Array<CurrencyDTO> = [];
  documents: Array<DocumentDTO> = [];
  quotations: Array<QuotationDTO> = [];

  $currencySubscription: Subscription;
  $quotationsSubscription: Subscription;
  $searchSubscription: Subscription;

  constructor(private samsungApiService: SamsungApiService) { }

  ngOnInit(): void {
    this._listCurrencies();
    this._listQuotations();
  }

  ngOnDestroy(): void {
    this.$currencySubscription.unsubscribe();
    this.$searchSubscription.unsubscribe();
    this.$quotationsSubscription.unsubscribe();
  }

  search(): void {
    this._clearError();
    this._patchDates();
    this.$searchSubscription = this.samsungApiService.listDocuments(this.documentNumber, this.currency, this.dateFrom, this.dateTo).pipe(
      tap(response => {
        this.documents = response;
        if (this.documents.length === 0) {
          this.alertType = 'warning';
          this.error = true;
          this.errorMessage = 'No documents found';
        } else this._convertCurrencies();
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
    this.dateFrom = '';
    this.dateTo = '';
  }

  private _listCurrencies(): void {
    this.$currencySubscription = this.samsungApiService.listCurrencies().pipe(
      tap(response => this.currencies = response),
      catchError(error => {
        this.alertType = 'danger';
        this.error = true;
        this.errorMessage = 'An error occurred while trying to retrieve currencies';

        return throwError(() => error);
      })).subscribe();
  }

  private _listQuotations(): void {
    this.$quotationsSubscription = this.samsungApiService.listQuotations().pipe(
      tap(response => this.quotations = response),
      catchError(error => {
        this.alertType = 'danger';
        this.error = true;
        this.errorMessage = 'The service was unable to list currencies quotations. Please, try again.';

        return throwError(() => error);
      })).subscribe();
  }

  private _convertCurrencies(): void {
    this.documents.forEach(document => {
      const currency: CurrencyDTO | undefined = this.currencies.find(currency => currency.currencyCode === document.currencyCode);
      document.currencyDesc = currency?.currencyDesc;
      const convertedQuotations: Array<QuotationDTO> = this.quotations.filter(quotation => quotation.fromCurrencyCode === document.currencyCode &&
      quotation.dataHoraCotacao === document.documentDate);

      if (convertedQuotations.length === 0) {
        document.valueBRL = 0;
        document.valuePEN = 0;
        document.valueUSD = 0;
      }
      convertedQuotations.forEach(convertedQuotation => {
        switch (convertedQuotation.toCurrencyCode) {
          case 'USD':
            document.valueUSD = parseFloat(convertedQuotation.cotacao) * document.documentValue;
            break;
          case 'PEN':
            document.valuePEN = parseFloat(convertedQuotation.cotacao) * document.documentValue;
            break;
          case 'BRL':
            document.valueBRL = parseFloat(convertedQuotation.cotacao) * document.documentValue;
            break;
        }

        if (!document.valueUSD) document.valueUSD = document.documentValue;
        if (!document.valuePEN) document.valuePEN = document.documentValue;
        if (!document.valueBRL) document.valueBRL = document.documentValue;
      });
    });
  }

  private _patchDates(): void {
    if (!!this.documentDateFrom) {
      const month: string = this.documentDateFrom.month.toString().length === 1 ? `0${this.documentDateFrom.month}` : this.documentDateFrom.month.toString();
      const day: string = this.documentDateFrom.day.toString().length === 1 ? `0${this.documentDateFrom.day}` : this.documentDateFrom.day.toString();
      this.dateFrom = `${this.documentDateFrom.year}-${month}-${day}`;
    }

    if (!!this.documentDateTo) {
      const month: string = this.documentDateTo.month.toString().length === 1 ? `0${this.documentDateTo.month}` : this.documentDateTo.month.toString();
      const day: string = this.documentDateTo.day.toString().length === 1 ? `0${this.documentDateTo.day}` : this.documentDateTo.day.toString();
      this.dateTo = `${this.documentDateTo.year}-${month}-${day}`;
    }
  }

  private _clearError(): void {
    this.error = false;
    this.errorMessage = '';
    this.alertType = '';
  }

}

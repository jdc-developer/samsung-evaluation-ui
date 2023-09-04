import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { CurrencyDTO, DocumentDTO, QuotationDTO } from '../models/samsung-models';

@Injectable({
  providedIn: 'root'
})
export class SamsungApiService {

  constructor(private http: HttpClient) { }

  listCurrencies(): Observable<Array<CurrencyDTO>> {
    return this.http.get<Array<CurrencyDTO>>(`${environment.api}/api/v1/samsung/list-currencies`);
  }

  listQuotations(): Observable<Array<QuotationDTO>> {
    return this.http.get<Array<QuotationDTO>>(`${environment.api}/api/v1/samsung/list-quotations`);
  }

  listDocuments(documentNumber: string, currencyCode: string, documentDateFrom: string, documentDateTo: string): Observable<Array<DocumentDTO>> {
    return this.http.get<Array<DocumentDTO>>(`${environment.api}/api/v1/samsung/list-documents?documentNumber=${documentNumber}&currencyCode=${currencyCode}&documentDateFrom=${documentDateFrom}&documentDateTo=${documentDateTo}`);
  }

}

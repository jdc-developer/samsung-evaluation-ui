export interface CurrencyDTO {
    currencyId: number;
    currencyCode: string;
    currencyDesc: string;
}

export interface QuotationDTO {
    fromCurrencyCode: string;
    toCurrencyCode: string;
    cotacao: string;
    dataHoraCotacao: string;
}

export interface DocumentDTO {
    documentId: number;
    documentNumber: string;
    notaFiscal: string;
    documentDate: string;
    documentValue: number;
    currencyCode: string;
}
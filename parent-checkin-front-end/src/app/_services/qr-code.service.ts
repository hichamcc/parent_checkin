import { Injectable } from '@angular/core';
import * as QRCode from 'qrcode';

@Injectable({
  providedIn: 'root'
})
export class QrCodeService {

  constructor() { }

  generateQrCode(data: string): Promise<string> {
    const options = { width: 500, height: 500 };

    return QRCode.toDataURL(data , options);
  }

}

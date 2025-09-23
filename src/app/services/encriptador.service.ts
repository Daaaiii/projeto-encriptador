import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root',
})
export class EncriptadorService {
  constructor() {}

  encrypt(
    chaveHex: string,
    textoClaro: string,
    modo: 'cbc' | 'ctr'
  ): { textoCifrado: string; iv: string } {
    const chave = CryptoJS.enc.Hex.parse(chaveHex);
    const iv = CryptoJS.lib.WordArray.random(16);

    let encryptOptions: any = {
      mode: modo === 'cbc' ? CryptoJS.mode.CBC : CryptoJS.mode.CTR,
      iv: iv
    };

    if (modo === 'cbc') {
      encryptOptions.padding = CryptoJS.pad.Pkcs7;
    }

    const textoCifradoBytes = CryptoJS.AES.encrypt(textoClaro, chave, encryptOptions);

    return {
      textoCifrado: textoCifradoBytes.ciphertext.toString(CryptoJS.enc.Hex),
      iv: CryptoJS.enc.Hex.stringify(iv),
    };
  }

  decrypt(chaveHex: string, textoCifradoHex: string, ivHex: string, modo: 'cbc' | 'ctr'): string {
    const chave = CryptoJS.enc.Hex.parse(chaveHex);
    const textoCifrado = CryptoJS.enc.Hex.parse(textoCifradoHex);
    const iv = CryptoJS.enc.Hex.parse(ivHex);

    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: textoCifrado
    });

    let decryptOptions: any = {
      mode: modo === 'cbc' ? CryptoJS.mode.CBC : CryptoJS.mode.CTR,
      iv: iv
    };

    if (modo === 'cbc') {
      decryptOptions.padding = CryptoJS.pad.Pkcs7;
    }

    const textoDecifradoBytes = CryptoJS.AES.decrypt(
      cipherParams,
      chave,
      decryptOptions
    );

    return textoDecifradoBytes.toString(CryptoJS.enc.Utf8);
  }

  decryptCBC(chaveHex: string, textoCifradoHex: string, ivHex: string): string {
    return this.decrypt(chaveHex, textoCifradoHex, ivHex, 'cbc');
  }

  decryptCTR(chaveHex: string, textoCifradoHex: string, ivHex: string): string {
    return this.decrypt(chaveHex, textoCifradoHex, ivHex, 'ctr');
  }
}

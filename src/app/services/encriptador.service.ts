import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
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

    let mode;
    if (modo === 'cbc') {
      mode = CryptoJS.mode.CBC;
    } else {
      mode = CryptoJS.mode.CTR;
    }

    const textoCifradoBytes = CryptoJS.AES.encrypt(textoClaro, chave, {
      mode: mode,
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
    });

    return {
      textoCifrado: textoCifradoBytes.ciphertext.toString(CryptoJS.enc.Hex),
      iv: CryptoJS.enc.Hex.stringify(iv),
    };
  }

  decryptCBC(chaveHex: string, textoCifradoHex: string, ivHex: string): string {
    const chave = CryptoJS.enc.Hex.parse(chaveHex);
    const textoCifrado = CryptoJS.enc.Hex.parse(textoCifradoHex);
    const iv = CryptoJS.enc.Hex.parse(ivHex);

    const textoDecifradoBytes = CryptoJS.AES.decrypt(
      { ciphertext: textoCifrado } as any,
      chave,
      {
        mode: CryptoJS.mode.CBC,
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    return textoDecifradoBytes.toString(CryptoJS.enc.Utf8);
  }

  decryptCTR(chaveHex: string, textoCifradoHex: string, ivHex: string): string {
    const chave = CryptoJS.enc.Hex.parse(chaveHex);
    const textoCifrado = CryptoJS.enc.Hex.parse(textoCifradoHex);
    const iv = CryptoJS.enc.Hex.parse(ivHex);

    const textoDecifradoBytes = CryptoJS.AES.decrypt(
      { ciphertext: textoCifrado } as any,
      chave,
      {
        mode: CryptoJS.mode.CTR,
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    return textoDecifradoBytes.toString(CryptoJS.enc.Utf8);
  }
}

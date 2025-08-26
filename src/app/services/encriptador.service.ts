import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncriptadorService {

  constructor() { }

  /**
   * Decifra um texto cifrado usando AES-CBC.
   * @param chaveHex A chave em formato hexadecimal.
   * @param textoCifradoHex O texto cifrado em formato hexadecimal.
   * @param ivHex O vetor de inicialização em formato hexadecimal.
   * @returns O texto claro em formato UTF-8.
   */
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
        padding: CryptoJS.pad.Pkcs7
      }
    );

    return textoDecifradoBytes.toString(CryptoJS.enc.Utf8);
  }

  /**
   * Cifra um texto usando AES-CTR com uma chave e IV aleatório.
   * @param chaveHex A chave em formato hexadecimal.
   * @param textoClaro O texto claro a ser cifrado.
   * @returns Um objeto com o texto cifrado, o IV usado e um valor aleatório.
   */
  encryptCTR(chaveHex: string, textoClaro: string): { ivHex: string, textoCifradoHex: string, randomHex: string } {
    const chave = CryptoJS.enc.Hex.parse(chaveHex);
    const iv = CryptoJS.lib.WordArray.random(16); // IV aleatório de 16 bytes
  
    const textoCifradoBytes = CryptoJS.AES.encrypt(
      textoClaro,
      chave,
      {
        mode: CryptoJS.mode.CTR,
        iv: iv,
        padding: CryptoJS.pad.Pkcs7
      }
    );
  
    return {
      ivHex: CryptoJS.enc.Hex.stringify(iv),
      textoCifradoHex: textoCifradoBytes.ciphertext.toString(CryptoJS.enc.Hex),
      randomHex: CryptoJS.enc.Hex.stringify(CryptoJS.lib.WordArray.random(16)) // Random adicional de 16 bytes  
    };
  }
}

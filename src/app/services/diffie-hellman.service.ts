// src/app/services/diffie-hellman.service.ts
import { Injectable } from '@angular/core';
import BigNumber from 'bignumber.js';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class DiffieHellmanService {

  // Valores fornecidos na tarefa
  p = new BigNumber('1041607122029938459843911326429539139964006065005940226363139');
  g = new BigNumber('10');
  A = new BigNumber('105008283869277434967871522668292359874644989537271965222162');

  // Para este exemplo, usaremos um valor fixo.
  b = new BigNumber('1398746532104567891234567890123456789012345678901');

  getBSecret(): string {
    return this.b.toString();
  }

  calculateB(): string {
    // B = g ^ b mod p
    console.log(this.b);
    console.log(this.p);
    console.log(this.g)
    console.log(this.g.pow(this.b));
    const B = this.g.exponentiatedBy(this.b, this.p);
    console.log(B);
    return B.toString();
  }

  calculateV(): string {
    // v = A ^ b mod p
    const v = this.A.exponentiatedBy(this.b, this.p);
    return v.toString();
  }

  calculateK(v: string): string {
    // K = primeiros 128 bits do SHA256 de v
    const hash = CryptoJS.SHA256(v).toString(CryptoJS.enc.Hex);
    return hash.substring(0, 32); // 32 caracteres hexadecimais = 128 bits
  }
}

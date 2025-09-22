import { Injectable } from '@angular/core';

export interface DiffieHellmanValues {
  p: string;
  g: string;
  A: string;
  b: string;
}

export interface DiffieHellmanResults {
  B: string;
  v: string;
  sha256_full: string;
  k: string;
}

@Injectable({
  providedIn: 'root',
})
export class DiffieHellmanService {
  constructor() {}

  /**
   * Exponenciação modular eficiente usando BigInt
   */
  private modPow(base: bigint, exp: bigint, mod: bigint): bigint {
    let result = 1n;
    base = base % mod;

    while (exp > 0n) {
      if (exp % 2n === 1n) {
        result = (result * base) % mod;
      }
      exp = exp >> 1n;
      base = (base * base) % mod;
    }

    return result;
  }

  /**
   * Calcular SHA256 de uma string
   */
  private async sha256(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Executar todos os cálculos do protocolo Diffie-Hellman
   */
  async calculateDiffieHellman(
    values: DiffieHellmanValues
  ): Promise<DiffieHellmanResults> {
    const p = BigInt(values.p);
    const g = BigInt(values.g);
    const A = BigInt(values.A);
    const b = BigInt(values.b);

    // Tarefa 2.1: Calcular B = g^b mod p
    const B = this.modPow(g, b, p);

    // Tarefa 2.2: Calcular v = A^b mod p
    const v = this.modPow(A, b, p);

    // Tarefa 2.3: Gerar chave k usando SHA256
    const sha256_full = await this.sha256(v.toString());
    const k = sha256_full.substring(0, 32); // Primeiros 128 bits

    return {
      B: B.toString(),
      v: v.toString(),
      sha256_full,
      k,
    };
  }

  /**
   * Validar se os valores de entrada são válidos
   */
  validateInputs(values: DiffieHellmanValues): string[] {
    const errors: string[] = [];

    try {
      const p = BigInt(values.p);
      const g = BigInt(values.g);
      const A = BigInt(values.A);
      const b = BigInt(values.b);

      if (b.toString().length < 40) {
        errors.push('O valor b deve ter pelo menos 40 dígitos');
      }

      if (b >= p) {
        errors.push('O valor b deve ser menor que p');
      }

      if (g <= 1n) {
        errors.push('O gerador g deve ser maior que 1');
      }

      if (A >= p) {
        errors.push('O valor A deve ser menor que p');
      }
    } catch (error) {
      errors.push('Valores de entrada inválidos: ' + error);
    }

    return errors;
  }

  /**
   * Gerar um valor b aleatório com o número especificado de dígitos
   */
  generateRandomB(digits: number = 49): string {
    if (digits < 40) {
      throw new Error('O valor b deve ter pelo menos 40 dígitos');
    }

    let b = '';
    // Primeiro dígito não pode ser 0
    b += Math.floor(Math.random() * 9) + 1;

    // Restante dos dígitos
    for (let i = 1; i < digits; i++) {
      b += Math.floor(Math.random() * 10);
    }

    return b;
  }

  /**
   * Formatar números grandes para exibição
   */
  formatNumber(num: string, maxLength: number = 50): string {
    if (num.length <= maxLength) return num;
    const start = num.substring(0, Math.floor(maxLength / 2));
    const end = num.substring(num.length - Math.floor(maxLength / 2));
    return `${start}...${end}`;
  }

  /**
   * Exportar resultados como JSON
   */
  exportResults(
    values: DiffieHellmanValues,
    results: DiffieHellmanResults
  ): string {
    const data = {
      protocolo: 'Diffie-Hellman',
      timestamp: new Date().toISOString(),
      valores_entrada: {
        ...values,
        b_digits: values.b.length,
      },
      resultados: results,
      tarefas: {
        '2.1': {
          descricao: 'Cálculo de B = g^b mod p',
          formula: `B = ${values.g}^${this.formatNumber(
            values.b
          )} mod ${this.formatNumber(values.p)}`,
          resultado: results.B,
        },
        '2.2': {
          descricao: 'Cálculo de v = A^b mod p',
          formula: `v = ${this.formatNumber(values.A)}^${this.formatNumber(
            values.b
          )} mod ${this.formatNumber(values.p)}`,
          resultado: results.v,
        },
        '2.3': {
          descricao: 'Geração da chave k usando SHA256',
          processo: `SHA256(${this.formatNumber(
            results.v
          )}) -> primeiros 128 bits`,
          resultado: results.k,
        },
      },
    };

    return JSON.stringify(data, null, 2);
  }
}

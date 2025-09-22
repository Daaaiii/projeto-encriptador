import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DiffieHellmanResults,
  DiffieHellmanService,
  DiffieHellmanValues,
} from '../../services/diffie-hellman.service';

@Component({
  selector: 'app-diffie-hellman',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './diffie-hellman.component.html',
  styleUrls: ['./diffie-hellman.component.css'],
})
export class DiffieHellmanComponent implements OnInit {
  values: DiffieHellmanValues = {
    p: '1041607122029938459843911326429539139964006065005940226363139',
    g: '10',
    A: '105008283869277434967871522668292359874644989537271965222162',
    b: '1398746532104567891234567890123456789012345678901',
  };

  results: DiffieHellmanResults | null = null;
  loading = false;
  error = '';

  constructor(private dhService: DiffieHellmanService) {}

  ngOnInit() {
    this.calculateDiffieHellman();
  }

  // Função para exponenciação modular usando BigInt
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

  // Função SHA256
  private async sha256(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  private async calculateDiffieHellman() {
    this.loading = true;
    this.error = '';

    try {
      // Simular delay para mostrar loading
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const p = BigInt(this.values.p);
      const g = BigInt(this.values.g);
      const A = BigInt(this.values.A);
      const b = BigInt(this.values.b);

      // Tarefa 2.1: Calcular B = g^b mod p
      const B = this.modPow(g, b, p);

      // Tarefa 2.2: Calcular v = A^b mod p
      const v = this.modPow(A, b, p);

      // Tarefa 2.3: Gerar chave k usando SHA256
      const sha256_full = await this.sha256(v.toString());
      const k = sha256_full.substring(0, 32);

      this.results = {
        B: B.toString(),
        v: v.toString(),
        sha256_full,
        k,
      };
    } catch (error: any) {
      this.error = 'Erro durante o cálculo: ' + error.message;
    } finally {
      this.loading = false;
    }
  }

  formatNumber(num: string, maxLength: number = 50): string {
    if (num.length <= maxLength) return num;
    return num.substring(0, maxLength);
  }

  exportResults() {
    if (!this.results) return;

    const data = {
      protocolo: 'Diffie-Hellman',
      timestamp: new Date().toISOString(),
      valores_entrada: this.values,
      resultados: this.results,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diffie-hellman-resultados.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  async copyToClipboard() {
    if (!this.results) return;

    try {
      await navigator.clipboard.writeText(this.results.k);
      alert('✅ Chave k copiada para a área de transferência!');
    } catch (err) {
      console.error('Erro ao copiar:', err);
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = this.results.k;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('✅ Chave k copiada para a área de transferência!');
    }
  }

  recalculate() {
    this.results = null;
    this.calculateDiffieHellman();
  }
}

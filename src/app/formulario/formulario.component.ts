import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EncriptadorService } from '../services/encriptador.service';

@Component({
  selector: 'app-formulario',
  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.css',
})
export class FormularioComponent {
  // Variáveis unificadas para entrada de dados
  chave = '240B31B44A27BEC5062B3A74C63271A4';
  textoCifradoInput = 'EF794476D605765572683CE849FBD4555CE8EC1382019662E277F31B8035E285787C1DA9D2CC5B3441F5CB900C41BA70902A932209C3966B83FB4387ABBC95E0';
  textoClaroInput = '';
  ivInput = 'C4AB0DF3D808D72AAADBC68206483B18'; // Variável para controlar o modo selecionado

  modoSelecionado: 'cbc' | 'ctr' = 'cbc'; // Variáveis para o resultado

  resultadoCripto: { textoCifrado: string; iv: string } | null = null;
  resultadoDecripto: string | null = null;

  constructor(private readonly encriptadorService: EncriptadorService) {}

  onCriptografar(): void {
    // Usa a chave e o texto do input, gera um IV aleatório no serviço
    this.resultadoCripto = this.encriptadorService.encrypt(
      this.chave,
      this.textoClaroInput,
      this.modoSelecionado
    );
  }

  onDescriptografar(): void {
    if (this.modoSelecionado === 'cbc') {
      // Decripta usando os campos do formulário
      this.resultadoDecripto = this.encriptadorService.decryptCBC(
        this.chave,
        this.textoCifradoInput,
        this.ivInput
      );
    } else if (this.modoSelecionado === 'ctr') {
      // Decripta usando os campos do formulário
      this.resultadoDecripto = this.encriptadorService.decryptCTR(
        this.chave,
        this.textoCifradoInput,
        this.ivInput
      );
    }
  }

  // Função para mudar a chave padrão baseada no modo
  onChangeMode(): void {
    if (this.modoSelecionado === 'ctr') {
      this.chave = '33A18467DB4AF474B051523A73DDA955';
      this.textoClaroInput = '';
      this.ivInput = ''; // O IV é gerado na criptografia CTR
      this.resultadoCripto = null;
      this.resultadoDecripto = null;
    } else {
      this.chave = '240B31B44A27BEC5062B3A74C63271A4';
      this.textoCifradoInput =
        'EF794476D605765572683CE849FBD4555CE8EC1382019662E277F31B8035E285787C1DA9D2CC5B3441F5CB900C41BA70902A932209C3966B83FB4387ABBC95E0';
      this.ivInput = 'C4AB0DF3D808D72AAADBC68206483B18';
      this.resultadoCripto = null;
      this.resultadoDecripto = null;
    }
  }

  async copyToClipboard(key: string) {
    if (!key) return;

    try {
      await navigator.clipboard.writeText(key);
      alert('✅ Chave k copiada para a área de transferência!');
    } catch (err) {
      alert('❌ Falha ao copiar a chave k: ' + err);
    }
  }
}

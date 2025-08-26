import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Component } from '@angular/core';
import { EncriptadorService } from '../services/encriptador.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formulario',
  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.css',
})
export class FormularioComponent {
  // Variáveis para a Tarefa 1.1 (CBC)
  chaveCBC = '240B31B44A27BEC5062B3A74C63271A4';
  textoCifradoCBC =
    'EF794476D605765572683CE849FBD4555CE8EC1382019662E277F31B8035E285787C1DA9D2CC5B3441F5CB900C41BA70902A932209C3966B83FB4387ABBC95E0';
  ivCBC = 'C4AB0DF3D808D72AAADBC68206483B18';
  textoClaroCBC: string | null = null;

  // Variáveis para a Tarefa 1.2 (CTR)
  chaveCTR = '33A18467DB4AF474B051523A73DDA955';
  textoClaroCTR = 'Seu Nome Completo';
  resultadoCTR: { ivHex: string; randomHex: string; textoCifradoHex: string } | null = null;

  constructor(private encriptadorService: EncriptadorService) {}

  onDecryptCBC(): void {
    try {
      this.textoClaroCBC = this.encriptadorService.decryptCBC(
        this.chaveCBC,
        this.textoCifradoCBC,
        this.ivCBC
      );
    } catch (error) {
      this.textoClaroCBC = 'Erro ao decifrar. Verifique os dados.';
    }
  }

  onEncryptCTR(): void {
    this.resultadoCTR = this.encriptadorService.encryptCTR(
      this.chaveCTR,
      this.textoClaroCTR
    );
  }
}

// src/app/components/diffie-hellman/diffie-hellman.component.ts
import { Component, OnInit } from '@angular/core';
import { DiffieHellmanService } from '../../services/diffie-hellman.service';

@Component({
  selector: 'app-diffie-hellman',
  templateUrl: './diffie-hellman.component.html',
  styleUrls: ['./diffie-hellman.component.css']
})
export class DiffieHellmanComponent implements OnInit {

  bValue: string = '0';
  BValue: string = '0';
  vValue: string = '0';
  kValue: string = '0';

  constructor(private dhService: DiffieHellmanService) { }

  ngOnInit(): void {
    // Tarefa 2.1
    this.bValue = this.dhService.getBSecret();
    this.BValue = this.dhService.calculateB();

    // Tarefa 2.2
    this.vValue = this.dhService.calculateV();

    // Tarefa 2.3
    this.kValue = this.dhService.calculateK(this.vValue);
  }
}

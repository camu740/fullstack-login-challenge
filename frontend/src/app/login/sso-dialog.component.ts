import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sso-dialog',
  templateUrl: './sso-dialog.component.html',
  styleUrls: ['./sso-dialog.component.scss']
})
export class SsoDialogComponent {
  certificates = [
    { 
      id: 1, 
      name: 'USUARIO PERSONAL (DNIe)', 
      issuer: 'AC FNMT Usuarios', 
      serial: 'A293B847CDE51029F348B02' 
    }
  ];
  selectedId: number | null = null;

  constructor(public dialogRef: MatDialogRef<SsoDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSelect(): void {
    const selected = this.certificates.find(c => c.id === this.selectedId);
    this.dialogRef.close(selected);
  }
}

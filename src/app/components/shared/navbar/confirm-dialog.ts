import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export type ConfirmDialogData = {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
};

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>

    <div mat-dialog-content style="padding-top: 8px;">
      {{ data.message }}
    </div>

    <div mat-dialog-actions align="end" style="padding-top: 12px;">
      <button mat-button [mat-dialog-close]="false">
        {{ data.cancelText ?? 'Ακύρωση' }}
      </button>
      <button mat-raised-button color="primary" [mat-dialog-close]="true">
        {{ data.confirmText ?? 'ΟΚ' }}
      </button>
    </div>
  `,
})
export class ConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData) {}
}

import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './careers.html',
  styleUrls: ['./careers.css']
})
export class Careers {
  selectedFile: File | null = null;
  fileName: string = 'Seu currículo';
  fileSize: string = '';
  sending = false;
  messageText = '';
  messageType: 'success' | 'error' | '' = '';
  apiUrl = 'https://www.karvan.com.br/api/sendmail'; 

  constructor(private http: HttpClient) { }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.fileName = this.selectedFile.name;
      this.fileSize = this.formatFileSize(this.selectedFile.size);
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.fileName = 'Seu currículo';
    this.fileSize = '';
    const fileInput = document.getElementById('resume-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  submitForm(): void {
    if (this.sending) return;
    this.sending = true;
    this.messageText = '';
    this.messageType = '';

    const formElement = document.querySelector('form.careers-form') as HTMLFormElement;
    const formData = new FormData(formElement);
    if (this.selectedFile) {
      formData.append('arquivo', this.selectedFile, this.selectedFile.name);
    }

    this.http.post(this.apiUrl, formData, { responseType: 'text' }).subscribe({
      next: (res) => {
        this.messageText = 'Currículo enviado com sucesso!';
        this.messageType = 'success';
        formElement.reset();
        this.removeFile();
        setTimeout(() => {
          this.messageText = '';
          this.messageType = '';
        }, 5000);
        this.sending = false;
      },
      error: (err) => {
        this.messageText = 'Erro ao enviar o currículo. Tente novamente.';
        this.messageType = 'error';
        setTimeout(() => {
          this.messageText = '';
          this.messageType = '';
        }, 5000);
        this.sending = false;
      }
    });
  }
}

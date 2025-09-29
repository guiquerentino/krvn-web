import { Component } from '@angular/core';
import { HttpClient, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './careers.html',
  styleUrls: ['./careers.css']
})
export class Careers {
  selectedFile: File | null = null;
  fileName: string = 'Seu currículo';
  fileSize: string = '';
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
    if (fileInput) {
      fileInput.value = '';
    }
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  submitForm(): void {
    const formElement = document.querySelector('form.careers-form') as HTMLFormElement;
    const formData = new FormData(formElement);

    if (this.selectedFile) {
      formData.append('arquivo', this.selectedFile, this.selectedFile.name);
    }

    this.http.post(this.apiUrl, formData, { responseType: 'text' }).subscribe({
      next: (res) => alert(res),
      error: (err) => alert('Erro ao enviar: ' + err.error)
    });
  }
}

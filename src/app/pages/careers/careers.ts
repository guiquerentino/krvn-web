import { Component } from '@angular/core';

@Component({
  selector: 'app-careers',
  imports: [],
  templateUrl: './careers.html',
  styleUrl: './careers.css'
})
export class Careers {
  selectedFile: File | null = null;
  fileName: string = 'Seu currículo';
  fileSize: string = '';

  constructor() { }

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

}

import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { I18n } from '../i18n';

interface Certificate {
  name: string;
  issuer: string;
}

// образование и сертификаты
@Component({
  selector: 'app-education',
  imports: [NgClass],
  templateUrl: './education.html',
  styleUrl: './education.css',
})
export class Education {
  i18n = inject(I18n);

  years = '2024 - 2028';

  // первые три - самые главные, остальные открываются по стрелочке
  certificates: Certificate[] = [
    { name: 'Microsoft Certified: Azure Fundamentals (AZ-900)', issuer: 'Microsoft' },
    { name: 'Microsoft Certified: Azure AI Fundamentals (AI-900)', issuer: 'Microsoft' },
    { name: 'IT Essentials', issuer: 'Cisco Networking Academy' },
    { name: 'Networking Basics', issuer: 'Cisco Networking Academy' },
    { name: 'Introduction to Cybersecurity', issuer: 'Cisco Networking Academy' },
    { name: 'NDG Linux Unhatched', issuer: 'Cisco Networking Academy' },
    { name: 'Python Essentials 1', issuer: 'Cisco Networking Academy, OpenEDG' },
    { name: 'Introduction to Modern AI', issuer: 'Cisco Networking Academy' },
    { name: 'Google AI Essentials', issuer: 'Google, Coursera' },
    { name: 'Elements of AI', issuer: 'University of Helsinki' },
  ];

  showAll = false;

  get visible() {
    return this.showAll ? this.certificates : this.certificates.slice(0, 3);
  }
}

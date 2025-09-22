// empresas.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Aside } from '../../components/aside/aside';

interface Certificado {
  id: number;
  nombre: string;
  archivo: string;
  fechaSubida: string;
  fechaVencimiento?: string;
  tipo: 'ambiental' | 'calidad' | 'seguridad' | 'otro';
  estado: 'vigente' | 'vencido' | 'por-vencer';
  tamano: string;
}

interface Empresa {
  id: number;
  nombre: string;
  nit: string;
  email: string;
  telefono: string;
  direccion: string;
  fechaRegistro: string;
  estado: 'activa' | 'inactiva' | 'pendiente';
  certificados: Certificado[];
  representanteLegal: string;
  sector: string;
}

@Component({
  selector: 'app-empresas',
  standalone: true,
  imports: [CommonModule, FormsModule, Aside],
  templateUrl: './bussiness.html',
})
export class Bussiness implements OnInit {
  empresas: Empresa[] = [
    {
      id: 1,
      nombre: 'EcoPlast S.A.S',
      nit: '900123456-7',
      email: 'contacto@ecoplast.com',
      telefono: '+57 300 111 2222',
      direccion: 'Carrera 50 #85-23, Barranquilla',
      fechaRegistro: '2025-08-15',
      estado: 'activa',
      representanteLegal: 'Carlos Mendoza',
      sector: 'Manufactura',
      certificados: [
        {
          id: 1,
          nombre: 'Certificado ISO 14001',
          archivo: 'iso14001_ecoplast.pdf',
          fechaSubida: '2025-09-01',
          fechaVencimiento: '2026-09-01',
          tipo: 'ambiental',
          estado: 'vigente',
          tamano: '2.3 MB',
        },
        {
          id: 2,
          nombre: 'Licencia Ambiental',
          archivo: 'licencia_ambiental.pdf',
          fechaSubida: '2025-08-20',
          fechaVencimiento: '2027-08-20',
          tipo: 'ambiental',
          estado: 'vigente',
          tamano: '1.8 MB',
        },
      ],
    },
    {
      id: 2,
      nombre: 'Recicla Atlántico Ltda',
      nit: '800987654-3',
      email: 'info@reciclaatlantico.com',
      telefono: '+57 301 333 4444',
      direccion: 'Calle 76 #42-15, Barranquilla',
      fechaRegistro: '2025-07-22',
      estado: 'activa',
      representanteLegal: 'María García',
      sector: 'Reciclaje',
      certificados: [
        {
          id: 3,
          nombre: 'Certificado de Calidad',
          archivo: 'certificado_calidad.pdf',
          fechaSubida: '2025-08-10',
          fechaVencimiento: '2025-10-10',
          tipo: 'calidad',
          estado: 'por-vencer',
          tamano: '1.2 MB',
        },
      ],
    },
  ];

  selectedFile: File | null = null;
  isUploadModalOpen: boolean = false;
  selectedEmpresa: Empresa | null = null;
  uploadForm = {
    nombre: '',
    tipo: 'ambiental',
    fechaVencimiento: '',
  };

  constructor() {}

  ngOnInit(): void {}

  getEstadoEmpresaColor(estado: string): string {
    switch (estado) {
      case 'activa':
        return 'bg-green-100 text-green-800';
      case 'inactiva':
        return 'bg-red-100 text-red-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getEstadoCertificadoColor(estado: string): string {
    switch (estado) {
      case 'vigente':
        return 'bg-green-100 text-green-800';
      case 'vencido':
        return 'bg-red-100 text-red-800';
      case 'por-vencer':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getTipoIcon(tipo: string): string {
    switch (tipo) {
      case 'ambiental':
        return 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z';
      case 'calidad':
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'seguridad':
        return 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z';
      default:
        return 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';
    }
  }

  openUploadModal(empresa: Empresa): void {
    this.selectedEmpresa = empresa;
    this.isUploadModalOpen = true;
    this.resetUploadForm();
  }

  closeUploadModal(): void {
    this.isUploadModalOpen = false;
    this.selectedEmpresa = null;
    this.resetUploadForm();
  }

  resetUploadForm(): void {
    this.uploadForm = {
      nombre: '',
      tipo: 'ambiental',
      fechaVencimiento: '',
    };
    this.selectedFile = null;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  uploadCertificado(): void {
    if (this.selectedFile && this.selectedEmpresa && this.uploadForm.nombre) {
      const newCertificado: Certificado = {
        id: Date.now(),
        nombre: this.uploadForm.nombre,
        archivo: this.selectedFile.name,
        fechaSubida: new Date().toISOString().split('T')[0],
        fechaVencimiento: this.uploadForm.fechaVencimiento || undefined,
        tipo: this.uploadForm.tipo as any,
        estado: 'vigente',
        tamano: (this.selectedFile.size / (1024 * 1024)).toFixed(1) + ' MB',
      };

      this.selectedEmpresa.certificados.push(newCertificado);
      this.closeUploadModal();
      console.log('Certificado subido:', newCertificado);
    }
  }

  downloadCertificado(certificado: Certificado): void {
    console.log('Descargar certificado:', certificado);
    // Aquí implementarías la lógica de descarga
  }

  deleteCertificado(empresa: Empresa, certificadoId: number): void {
    const index = empresa.certificados.findIndex((c) => c.id === certificadoId);
    if (index > -1) {
      empresa.certificados.splice(index, 1);
      console.log('Certificado eliminado');
    }
  }

  verDetalleEmpresa(empresa: Empresa): void {
    console.log('Ver detalle empresa:', empresa);
  }
}

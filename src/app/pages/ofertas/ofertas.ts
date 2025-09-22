import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Aside } from '../../components/aside/aside';
import { OfertasService, Oferta, CreateOfertaRequest } from '../../services/ofertas.js';

@Component({
  selector: 'app-ofertas',
  templateUrl: './ofertas.html',
  imports: [CommonModule, ReactiveFormsModule, Aside],
})
export class Ofertas implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private ofertasService = inject(OfertasService);

  ofertas: Oferta[] = [];

  filteredOfertas: Oferta[] = [];
  ofertaForm: FormGroup;
  filterForm: FormGroup;
  isModalOpen = false;
  isEditing = false;
  currentOfertaId: number | null = null;
  isLoading = false;
  error: string | null = null;

  categories = [
    'comidas',
    'entretenimiento',
    'transporte',
    'tecnologia',
    'educacion',
    'salud',
    'deportes',
    'belleza',
  ];

  constructor(private fb: FormBuilder) {
    this.ofertaForm = this.createForm();
    this.filterForm = this.createFilterForm();
  }

  ngOnInit(): void {
    this.loadOfertas();
    this.setupFormValidation();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-ZÀ-ÿ0-9\s'"\-.,!?()]+$/),
        ],
      ],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      cost: [
        0,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(10000),
          Validators.pattern(/^\d+$/),
        ],
      ],
      category: ['', Validators.required],
    });
  }

  private createFilterForm(): FormGroup {
    return this.fb.group({
      searchTerm: [''],
      selectedCategory: [''],
    });
  }

  private setupFormValidation(): void {
    // Validación en tiempo real para el costo
    this.ofertaForm
      .get('cost')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value && (isNaN(value) || value < 0)) {
          this.ofertaForm.get('cost')?.setErrors({ invalidNumber: true });
        }
      });

    // Subscribe to filter form changes
    this.filterForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.applyFilters();
    });
  }

  /**
   * Carga todas las ofertas desde el servicio
   */
  loadOfertas(): void {
    this.isLoading = true;
    this.error = null;

    this.ofertasService
      .getOfertas()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (ofertas) => {
          this.ofertas = ofertas;
          this.filteredOfertas = [...ofertas];
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading ofertas:', error);
          this.error = 'Error al cargar las ofertas';
          this.isLoading = false;
          // Fallback data for development
          this.ofertas = [
            {
              id_offer: 1,
              name: "Tarjeta McDonald's",
              description: "Una tarjeta de McDonald's que te permite comprar un Big Mac",
              cost: 300,
              category: 'comidas',
              disponible: true,
              createdAt: '2024-01-15T00:00:00.000Z',
              updatedAt: '2024-01-15T00:00:00.000Z',
            },
          ];
          this.filteredOfertas = [...this.ofertas];
        },
      });
  }

  // Filtros y búsqueda
  onSearchChange(): void {
    this.applyFilters();
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    const searchTerm = this.filterForm.get('searchTerm')?.value || '';
    const selectedCategory = this.filterForm.get('selectedCategory')?.value || '';

    this.filteredOfertas = this.ofertas.filter((oferta) => {
      const matchesSearch =
        !searchTerm ||
        oferta.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        oferta.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = !selectedCategory || oferta.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }

  clearFilters(): void {
    this.filterForm.patchValue({
      searchTerm: '',
      selectedCategory: '',
    });
    this.filteredOfertas = [...this.ofertas];
  }

  // Modal operations
  openModal(oferta?: Oferta): void {
    this.isModalOpen = true;
    this.isEditing = !!oferta;

    if (oferta) {
      this.currentOfertaId = oferta.id_offer || null;
      this.ofertaForm.patchValue({
        name: oferta.name,
        description: oferta.description,
        cost: oferta.cost,
        category: oferta.category,
      });
    } else {
      this.currentOfertaId = null;
      this.ofertaForm.reset();
      this.ofertaForm.patchValue({ cost: 0 });
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.isEditing = false;
    this.currentOfertaId = null;
    this.ofertaForm.reset();
  }

  // CRUD operations
  onSubmit(): void {
    if (this.ofertaForm.valid) {
      this.isLoading = true;
      const formValue = this.ofertaForm.value;

      if (this.isEditing && this.currentOfertaId) {
      } else {
        this.createOferta(formValue);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createOferta(ofertaData: CreateOfertaRequest): void {
    this.ofertasService
      .createOferta(ofertaData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newOferta) => {
          this.ofertas.unshift(newOferta);
          this.applyFilters();
          this.isLoading = false;
          this.closeModal();
          console.log('Oferta creada:', newOferta);
        },
        error: (error) => {
          console.error('Error creating oferta:', error);
          this.error = 'Error al crear la oferta';
          this.isLoading = false;
        },
      });
  }

  deleteOferta(id: number): void {
    console.log(id);
    if (confirm('¿Estás seguro de que quieres eliminar esta oferta?')) {
      this.ofertasService
        .deleteOferta(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            const index = this.ofertas.findIndex((o) => o.id_offer === id);
            if (index !== -1) {
              this.ofertas.splice(index, 1);
              this.applyFilters();
            }
            console.log('Oferta eliminada:', id);
          },
          error: (error) => {
            console.error('Error deleting oferta:', error);
            this.error = 'Error al eliminar la oferta';
          },
        });
    }
  }

  toggleOfertaDisponibilidad(oferta: Oferta): void {
    const updatedDisponibilidad = !oferta.disponible;
    this.ofertasService
      .toggleDisponibilidad(oferta.id_offer, updatedDisponibilidad)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedOferta) => {
          const index = this.ofertas.findIndex((o) => o.id_offer === oferta.id_offer);
          if (index !== -1) {
            this.ofertas[index] = updatedOferta;
            this.applyFilters();
          }
        },
        error: (error) => {
          console.error('Error toggling disponibilidad:', error);
          this.error = 'Error al cambiar disponibilidad';
        },
      });
  }

  // Utility methods
  private getNextId(): number {
    const maxId = Math.max(...this.ofertas.map((o) => o.id_offer || 0), 0);
    return maxId + 1;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.ofertaForm.controls).forEach((key) => {
      const control = this.ofertaForm.get(key);
      if (control) {
        control.markAsTouched();
        control.markAsDirty();
      }
    });
  }

  // Form validation helpers
  isFieldInvalid(fieldName: string): boolean {
    const field = this.ofertaForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.ofertaForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      const errors = field.errors;

      if (errors['required']) return `${this.getFieldLabel(fieldName)} es requerido`;
      if (errors['minlength'])
        return `${this.getFieldLabel(fieldName)} debe tener al menos ${
          errors['minlength'].requiredLength
        } caracteres`;
      if (errors['maxlength'])
        return `${this.getFieldLabel(fieldName)} no puede exceder ${
          errors['maxlength'].requiredLength
        } caracteres`;
      if (errors['min'])
        return `${this.getFieldLabel(fieldName)} debe ser mayor a ${errors['min'].min}`;
      if (errors['max'])
        return `${this.getFieldLabel(fieldName)} no puede ser mayor a ${errors['max'].max}`;
      if (errors['pattern'])
        return `${this.getFieldLabel(fieldName)} contiene caracteres no válidos`;
      if (errors['invalidNumber'])
        return `${this.getFieldLabel(fieldName)} debe ser un número válido`;
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Nombre',
      description: 'Descripción',
      cost: 'Costo en puntos',
      category: 'Categoría',
    };
    return labels[fieldName] || fieldName;
  }

  // Format helpers
  formatCurrency(cost: number): string {
    return `${cost} puntos`;
  }

  formatCategory(category: string): string {
    return category.charAt(0).toUpperCase() + category.slice(1);
  }

  getDisponibilidadBadgeClass(disponible: boolean): string {
    return disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }

  getDisponibilidadText(disponible: boolean): string {
    return disponible ? 'Disponible' : 'No Disponible';
  }

  trackByOferta(index: number, oferta: Oferta): number {
    return oferta.id_offer || index;
  }

  hasActiveFilters(): boolean {
    const searchTerm = this.filterForm.get('searchTerm')?.value || '';
    const selectedCategory = this.filterForm.get('selectedCategory')?.value || '';
    return !!(searchTerm || selectedCategory);
  }
}

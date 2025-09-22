// add-points.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';

import { Aside } from '../../components/aside/aside';
import { PointsService } from '../../services/points';
import { UserService } from '../../services/user';

// Import interfaces from services
import {
  MaterialDetail,
  MaterialType,
  PointsRecord,
  CreatePointsRequest,
  UpdatePointsRequest,
} from '../../services/points';
import { User } from '../../services/user';

@Component({
  selector: 'app-add-points',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Aside],
  templateUrl: './add-points.html',
})
export class AddPoints implements OnInit {
  private fb = inject(FormBuilder);
  private pointsService = inject(PointsService);
  private userService = inject(UserService);

  // Form
  pointsForm!: FormGroup;

  // Data
  users: any[] = [];
  materialTypes: any[] = [
    { name: 'plasticos', label: 'Plásticos', pointsPerKg: 10 },
    { name: 'papel', label: 'Papel', pointsPerKg: 5 },
    { name: 'metales', label: 'Metales', pointsPerKg: 15 },
    { name: 'vidrio', label: 'Vidrio', pointsPerKg: 8 },
    { name: 'carton', label: 'Cartón', pointsPerKg: 6 },
  ];

  // State
  isLoading = false;
  editingRecord: PointsRecord | null = null;

  ngOnInit() {
    this.initForm();
    this.loadUsers();
  }

  initForm() {
    this.pointsForm = this.fb.group({
      userId: ['', [Validators.required]],
      details: this.fb.array([this.createMaterialGroup()]),
    });
  }

  createMaterialGroup(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      unit: ['kg', [Validators.required]],
      quantity: [0, [Validators.required, Validators.min(0.1)]],
      totalValue: [0, [Validators.required, Validators.min(1)]],
    });
  }

  get materialsArray(): FormArray {
    return this.pointsForm.get('details') as FormArray;
  }

  addMaterial() {
    this.materialsArray.push(this.createMaterialGroup());
  }

  removeMaterial(index: number) {
    if (this.materialsArray.length > 1) {
      this.materialsArray.removeAt(index);
    }
  }

  calculatePoints(materialIndex: number) {
    const material = this.materialsArray.at(materialIndex);
    const materialName = material.get('name')?.value;
    const quantity = material.get('quantity')?.value || 0;

    const materialType = this.materialTypes.find((m) => m.name === materialName);
    if (materialType && quantity > 0) {
      const points = Math.round(quantity * materialType.pointsPerKg);
      material.get('totalValue')?.setValue(points);
    }
  }

  getTotalPoints(): number {
    return this.materialsArray.controls.reduce((total, control) => {
      return total + (control.get('totalValue')?.value || 0);
    }, 0);
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        console.log(users);
        this.users = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      },
    });
  }

  async onSubmit() {
    if (this.pointsForm.valid) {
      this.isLoading = true;

      try {
        const formData = this.pointsForm.value;

        if (this.editingRecord) {
          const updateData: UpdatePointsRequest = {
            id: this.editingRecord.id,
            userId: parseInt(formData.userId, 10), // Convert to integer
            details: formData.details,
          };
          await this.pointsService.updatePointsRecord(updateData).toPromise();
        } else {
          const createData: CreatePointsRequest = {
            userId: parseInt(formData.userId, 10), // Convert to integer
            details: formData.details,
          };
          await this.pointsService.createPointsRecord(createData).toPromise();
        }

        this.resetForm();
        // Optionally show success message or navigate
      } catch (error) {
        console.error('Error saving points:', error);
        // Handle error
      } finally {
        this.isLoading = false;
      }
    }
  }

  resetForm() {
    this.pointsForm.reset();
    this.editingRecord = null;

    // Reset form array to have only one material
    while (this.materialsArray.length > 1) {
      this.materialsArray.removeAt(1);
    }

    // Reset the first material group
    this.materialsArray.at(0).reset();
    this.materialsArray.at(0).get('unit')?.setValue('kg');
  }

  editRecord(record: PointsRecord) {
    this.editingRecord = record;

    // Clear existing materials
    while (this.materialsArray.length > 0) {
      this.materialsArray.removeAt(0);
    }

    // Add materials from record
    record.details.forEach((detail) => {
      const materialGroup = this.createMaterialGroup();
      materialGroup.patchValue(detail);
      this.materialsArray.push(materialGroup);
    });

    // Set user
    this.pointsForm.get('userId')?.setValue(record.userId);
  }

  // Helper method to get material type info
  getMaterialType(materialName: string): MaterialType | undefined {
    return this.materialTypes.find((m) => m.name === materialName);
  }

  // Method to handle material selection change
  onMaterialChange(index: number) {
    setTimeout(() => {
      this.calculatePoints(index);
    }, 100);
  }

  // Method to handle quantity change
  onQuantityChange(index: number) {
    this.calculatePoints(index);
  }
}

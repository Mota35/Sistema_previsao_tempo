import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FavoritesService } from '../../../../core/services/favorites.service';
import { ExportService } from '../../../../core/services/export.service';
import { CidadeFavorita } from '../../../../core/models/models';

@Component({
  selector: 'app-favorites-list',
  templateUrl: './favorites-list.component.html',
  styleUrls: ['./favorites-list.component.scss'],
})
export class FavoritesListComponent implements OnInit {
  favorites: CidadeFavorita[] = [];
  loading    = false;
  error      = '';
  successMsg = '';
  showForm   = false;
  editId: number | null = null;

  form: FormGroup;

  constructor(
    private favSvc: FavoritesService,
    private exportSvc: ExportService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      nome_cidade: ['', Validators.required],
      pais:        ['', [Validators.required, Validators.maxLength(5)]],
    });
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.favSvc.getAll().subscribe({
      next:  (r) => { this.favorites = r.data ?? []; this.loading = false; },
      error: ()  => this.loading = false,
    });
  }

  openAdd(): void { this.editId = null; this.form.reset(); this.showForm = true; }

  openEdit(fav: CidadeFavorita): void {
    this.editId = fav.id;
    this.form.patchValue({ nome_cidade: fav.nome_cidade, pais: fav.pais });
    this.showForm = true;
  }

  save(): void {
    if (this.form.invalid) return;
    const { nome_cidade, pais } = this.form.value;

    const action = this.editId
      ? this.favSvc.update(this.editId, nome_cidade, pais)
      : this.favSvc.add(nome_cidade, pais);

    action.subscribe({
      next: () => {
        this.successMsg = this.editId ? 'Cidade actualizada!' : 'Cidade adicionada!';
        this.showForm = false;
        this.load();
      },
      error: (e) => this.error = e.error?.message ?? 'Erro.',
    });
  }

  remove(id: number): void {
    if (!confirm('Remover esta cidade dos favoritos?')) return;
    this.favSvc.remove(id).subscribe({
      next: () => { this.successMsg = 'Cidade removida.'; this.load(); },
      error: (e) => this.error = e.error?.message,
    });
  }

  exportCSV(): void { this.exportSvc.exportFavoritasCSV(this.favorites); }
  exportPDF(): void { this.exportSvc.exportFavoritasPDF(this.favorites, ''); }
}

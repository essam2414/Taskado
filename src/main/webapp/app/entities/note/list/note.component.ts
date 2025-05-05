import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { INote, NewNote } from '../note.model';
import { NoteService } from '../service/note.service';
import SharedModule from 'app/shared/shared.module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NoteDeleteDialogComponent } from '../delete/note-delete-dialog.component';

@Component({
  standalone: true,
  selector: 'jhi-note',
  templateUrl: './note.component.html',
  imports: [RouterModule, SharedModule, FormsModule],
})
export class NoteComponent implements OnInit {
  notes: INote[] = [];
  filteredNotes: INote[] = [];
  newNoteTitle = '';
  searchQuery = '';

  private noteService = inject(NoteService);
  private router = inject(Router);
  private modalService = inject(NgbModal);

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.noteService.query().subscribe(res => {
      this.notes = res.body ?? [];
      this.filteredNotes = [...this.notes];
    });
  }

  addNote(): void {
    if (!this.newNoteTitle.trim()) return;

    this.router.navigate(['/note/new'], {
      queryParams: { title: this.newNoteTitle },
    });

    this.newNoteTitle = '';
  }

  editNote(note: INote): void {
    this.router.navigate(['/note', note.id, 'edit']);
  }

  delete(note: INote): void {
    const modalRef = this.modalService.open(NoteDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.note = note;
    modalRef.closed.subscribe(() => this.loadAll());
  }

  search(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredNotes = this.notes.filter(
      note => note.title?.toLowerCase().includes(query) ?? note.content?.toLowerCase().includes(query),
    );
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filteredNotes = [...this.notes];
  }
}

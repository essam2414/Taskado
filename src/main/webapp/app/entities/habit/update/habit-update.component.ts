import { Component, OnInit, inject, ElementRef, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ICategory, NewCategory, CATEGORY_COLORS } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { HabitService } from '../service/habit.service';
import { IHabit } from '../habit.model';
import { HabitFormGroup, HabitFormService } from './habit-form.service';
import dayjs from 'dayjs';

@Component({
  standalone: true,
  selector: 'jhi-habit-update',
  templateUrl: './habit-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
  styleUrls: ['../habit.component.scss'],
})
export class HabitUpdateComponent implements OnInit {
  isSaving = false;
  habit: IHabit | null = null;

  categoriesSharedCollection: ICategory[] = [];
  usersSharedCollection: IUser[] = [];

  @ViewChild('addCategoryInput') addCategoryInputRef?: ElementRef<HTMLInputElement>;
  categoryDropdownOpen = false;
  selectedCategory: ICategory | null = null;
  addCategoryOpen = false;
  newCategoryName = '';
  newCategoryColor = this.getRandomColor();

  habitDropdownOpen = false;
  activeRepeatType = 'daily';
  currentWeekStart: dayjs.Dayjs = dayjs().startOf('week').add(1, 'day');

  selectedWeekDays: string[] = [];
  customEveryXDays = 1;
  timesPerDay = 1;

  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected habitService = inject(HabitService);
  protected habitFormService = inject(HabitFormService);
  protected categoryService = inject(CategoryService);
  protected userService = inject(UserService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: HabitFormGroup = this.habitFormService.createHabitFormGroup();

  compareCategory = (o1: ICategory | null, o2: ICategory | null): boolean => this.categoryService.compareCategory(o1, o2);

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ habit }) => {
      this.habit = habit;
      if (habit) {
        this.updateForm(habit);
      }

      this.loadRelationshipsOptions();
    });
  }

  toggleCategoryDropdown(): void {
    this.categoryDropdownOpen = !this.categoryDropdownOpen;
  }

  setRepeatType(selectedRepeatType: string): void {
    this.activeRepeatType = selectedRepeatType;
    this.editForm.controls['repeatType'].setValue(this.activeRepeatType);
  }

  toggleWeekDay(day: string): void {
    const index = this.selectedWeekDays.indexOf(day);
    if (index > -1) {
      this.selectedWeekDays.splice(index, 1);
    } else {
      this.selectedWeekDays.push(day);
    }
  }

  getCurrentWeekDates(): string[] {
    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
      dates.push(this.currentWeekStart.add(i, 'day').format('YYYY-MM-DD'));
    }
    return dates;
  }

  toggleHabitDropdown(): void {
    this.habitDropdownOpen = !this.habitDropdownOpen;
  }

  selectCategory(category: ICategory | null): void {
    this.selectedCategory = category ? { ...category } : null;
    this.editForm.controls['category'].setValue(this.selectedCategory);
    this.editForm.controls['category'].markAsDirty();
    this.categoryDropdownOpen = false;
  }

  toggleAddCategory(): void {
    this.addCategoryOpen = !this.addCategoryOpen;

    if (this.addCategoryOpen) {
      setTimeout(() => {
        this.addCategoryInputRef?.nativeElement.focus();
      });
    }
  }

  addCategoryFromInput(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;

    keyboardEvent.preventDefault();

    const name = this.newCategoryName.trim();
    const color = this.newCategoryColor;

    if (!name) return;

    const newCategory: NewCategory = {
      id: null,
      name,
      color,
    };

    this.categoryService.create(newCategory).subscribe({
      next: res => {
        const added = res.body;
        if (added) {
          this.categoriesSharedCollection.push(added);
          this.newCategoryName = '';
          this.newCategoryColor = this.getRandomColor();
          this.addCategoryOpen = false;
        }
      },
    });
  }

  getRandomColor(): string {
    const random = Math.floor(Math.random() * CATEGORY_COLORS.length);
    return CATEGORY_COLORS[random].value;
  }

  loadCategories(): void {
    this.categoryService.query().subscribe({
      next: (res: HttpResponse<ICategory[]>) => {
        this.categoriesSharedCollection = res.body ?? [];

        if (this.habit?.category?.id) {
          const fullCategory = this.categoriesSharedCollection.find(c => c.id === this.habit?.category?.id);
          if (fullCategory) {
            this.selectedCategory = fullCategory;
            this.editForm.controls['category'].setValue(fullCategory);
          }
        }
      },
    });
  }

  deleteCategory(category: ICategory, event: Event): void {
    event.stopPropagation(); // ✅ So it doesn’t trigger selectCategory()

    if (!category.id) return;

    this.categoryService.delete(category.id).subscribe(() => {
      this.categoriesSharedCollection = this.categoriesSharedCollection.filter(c => c.id !== category.id);

      // Clear it from the selected form if it was selected
      if (this.editForm.controls['category'].value?.id === category.id) {
        this.editForm.controls['category'].setValue(null);
        this.selectedCategory = null;
      }
    });
  }

  getCategoryStyle(category: ICategory | null): Record<string, string> {
    if (!category?.color) return {};
    return {
      color: category.color,
      'background-color': this.getCategoryBackground(category.color) ?? '',
    };
  }

  getCategoryBackground(color: string | null | undefined): string | null {
    if (!color) return null;

    const div = document.createElement('div');
    div.style.color = color;

    document.body.appendChild(div);
    const computedColor = getComputedStyle(div).color;
    document.body.removeChild(div);

    const match = computedColor.match(/rgba?\((\d+), (\d+), (\d+)/);
    if (!match) return null;

    const [_, r, g, b] = match;
    return `rgba(${r}, ${g}, ${b}, 0.18)`; // your custom alpha
  }

  hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) return null;
    let c = hex.substring(1).split('');
    if (c.length === 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    const r = parseInt(c[0] + c[1], 16);
    const g = parseInt(c[2] + c[3], 16);
    const b = parseInt(c[4] + c[5], 16);
    return { r, g, b };
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('teamproject24App.error', { message: err.message })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const habit = this.habitFormService.getHabit(this.editForm);

    if (habit.id !== null) {
      this.subscribeToSaveResponse(this.habitService.update(habit));
    } else {
      this.subscribeToSaveResponse(this.habitService.create(habit));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHabit>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(habit: IHabit): void {
    this.habit = habit;
    this.habitFormService.resetForm(this.editForm, habit);

    if (!habit.repeatType) {
      this.editForm.controls['repeatType'].setValue('daily');
      this.activeRepeatType = 'daily';
    } else {
      this.activeRepeatType = habit.repeatType;
    }

    this.categoriesSharedCollection = this.categoryService.addCategoryToCollectionIfMissing<ICategory>(
      this.categoriesSharedCollection,
      habit.category,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.categoryService
      .query()
      .pipe(map((res: HttpResponse<ICategory[]>) => res.body ?? []))
      .pipe(
        map((categories: ICategory[]) =>
          this.categoryService.addCategoryToCollectionIfMissing<ICategory>(categories, this.habit?.category),
        ),
      )
      .subscribe((categories: ICategory[]) => (this.categoriesSharedCollection = categories));
  }
}

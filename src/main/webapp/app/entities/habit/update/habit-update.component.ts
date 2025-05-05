import { Component, OnInit, inject, ElementRef, ViewChild, HostListener } from '@angular/core';
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
  daysOfWeek: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  selectedWeekDays: string[] = [];
  customEveryXDays = 1;
  timesPerDay = 1;
  validationErrorMessage: string | null = null;

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
    this.loadCategories();

    this.activatedRoute.data.subscribe(({ habit }) => {
      this.habit = habit;
      if (habit) {
        this.updateForm(habit);
      } else {
        this.editForm.controls['repeatType'].setValue('daily');
        this.editForm.controls['repeatTimes'].setValue('1');
        this.editForm.controls['repeatDays'].setValue(null);
        this.editForm.controls['repeatInterval'].setValue(null);
      }

      this.loadRelationshipsOptions();
    });
  }

  deleteHabit(): void {
    const id = this.editForm.get('id')?.value as number;
    if (id) {
      this.isSaving = true;
      this.habitService
        .delete(id)
        .pipe(finalize(() => (this.isSaving = false)))
        .subscribe({
          next: () => this.previousState(),
          error: () => {
            this.isSaving = false;
          },
        });
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedInsideDropdown = target.closest('.dropdown-select');

    if (!clickedInsideDropdown) {
      this.closeAllDropdowns();
    }
  }

  closeAllDropdowns(): void {
    this.categoryDropdownOpen = false;
    this.habitDropdownOpen = false;
  }

  get repeatSummary(): string {
    if (this.activeRepeatType === 'daily') {
      if (this.timesPerDay === 1) {
        return 'Repeat every day';
      } else {
        return `Repeat ${this.timesPerDay} times a day`;
      }
    }

    if (this.activeRepeatType === 'weekly') {
      if (this.selectedWeekDays.length === 7) {
        return 'Repeat every day';
      }
      if (this.selectedWeekDays.length === 6) {
        const missingDay = this.daysOfWeek.find(day => !this.selectedWeekDays.includes(day));
        return `Repeat every day except ${missingDay}`;
      }
      if (this.selectedWeekDays.length > 0) {
        return `Repeat every ${this.selectedWeekDays.join(', ')}`;
      }
      return 'Repeat on selected days';
    }

    if (this.activeRepeatType === 'custom') {
      return `Repeat every ${this.customEveryXDays} day${this.customEveryXDays > 1 ? 's' : ''}`;
    }

    return 'Repeat';
  }

  toggleCategoryDropdown(): void {
    const wasOpen = this.categoryDropdownOpen;
    this.closeAllDropdowns();
    this.categoryDropdownOpen = !wasOpen;
  }

  setRepeatType(selectedRepeatType: string): void {
    this.activeRepeatType = selectedRepeatType;
    this.editForm.controls['repeatType'].setValue(this.activeRepeatType);

    if (selectedRepeatType === 'weekly' && this.selectedWeekDays.length === 0) {
      this.selectedWeekDays = [...this.daysOfWeek];
    }
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
    const wasOpen = this.habitDropdownOpen;
    this.closeAllDropdowns();
    this.habitDropdownOpen = !wasOpen;
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
    if (!this.validateRepeatSettings()) {
      return;
    }

    this.isSaving = true;

    // Set repeat settings into form
    this.applyRepeatSettings();

    const habit = this.habitFormService.getHabit(this.editForm);

    if (habit.id !== null) {
      this.subscribeToSaveResponse(this.habitService.update(habit));
    } else {
      this.subscribeToSaveResponse(this.habitService.create(habit));
    }
  }

  protected applyRepeatSettings(): void {
    if (this.activeRepeatType === 'daily') {
      this.editForm.controls['repeatType'].setValue('daily');
      this.editForm.controls['repeatTimes'].setValue(String(this.timesPerDay));
      this.editForm.controls['repeatDays'].setValue(null);
      this.editForm.controls['repeatInterval'].setValue(null);
    } else if (this.activeRepeatType === 'weekly') {
      this.editForm.controls['repeatType'].setValue('weekly');
      this.editForm.controls['repeatTimes'].setValue('1');
      this.editForm.controls['repeatDays'].setValue(this.selectedWeekDays.join(','));
      this.editForm.controls['repeatInterval'].setValue(null);
    } else if (this.activeRepeatType === 'custom') {
      this.editForm.controls['repeatType'].setValue('custom');
      this.editForm.controls['repeatTimes'].setValue('1');
      this.editForm.controls['repeatDays'].setValue(null);
      this.editForm.controls['repeatInterval'].setValue(this.customEveryXDays);
    }
  }

  protected validateRepeatSettings(): boolean {
    this.validationErrorMessage = null; // Clear old errors first

    if (this.activeRepeatType === 'daily') {
      if (this.timesPerDay < 1) {
        this.showValidationError('Times per day must be at least 1.');
        return false;
      }
    } else if (this.activeRepeatType === 'weekly') {
      if (this.selectedWeekDays.length === 0) {
        this.showValidationError('You must select at least one day for weekly habits.');
        return false;
      }
    } else if (this.activeRepeatType === 'custom') {
      if (this.customEveryXDays < 1) {
        this.showValidationError('Repeat every X days must be at least 1.');
        return false;
      }
    }

    return true;
  }

  protected showValidationError(message: string): void {
    this.validationErrorMessage = message;

    setTimeout(() => {
      this.validationErrorMessage = null;
    }, 3000); // disappear after 3 seconds
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

    this.activeRepeatType = habit.repeatType ?? 'daily';
    this.editForm.controls['repeatType'].setValue(this.activeRepeatType);

    if (habit.repeatType === 'daily') {
      this.timesPerDay = +(habit.repeatTimes ?? 1);
    } else if (habit.repeatType === 'weekly' && habit.repeatDays) {
      this.selectedWeekDays = habit.repeatDays.split(',');
    } else if (habit.repeatType === 'custom') {
      this.customEveryXDays = +(habit.repeatInterval ?? 1);
    }

    this.applyRepeatSettings();

    if (habit.category) {
      this.selectedCategory = habit.category;
    } else {
      this.selectedCategory = null;
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

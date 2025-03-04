import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { INote } from '../note.model';
import { NoteService } from '../service/note.service';
import { NoteFormService } from './note-form.service';

import { NoteUpdateComponent } from './note-update.component';

describe('Note Management Update Component', () => {
  let comp: NoteUpdateComponent;
  let fixture: ComponentFixture<NoteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let noteFormService: NoteFormService;
  let noteService: NoteService;
  let categoryService: CategoryService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoteUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(NoteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(NoteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    noteFormService = TestBed.inject(NoteFormService);
    noteService = TestBed.inject(NoteService);
    categoryService = TestBed.inject(CategoryService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Category query and add missing value', () => {
      const note: INote = { id: 456 };
      const category: ICategory = { id: 19835 };
      note.category = category;

      const categoryCollection: ICategory[] = [{ id: 23602 }];
      jest.spyOn(categoryService, 'query').mockReturnValue(of(new HttpResponse({ body: categoryCollection })));
      const additionalCategories = [category];
      const expectedCollection: ICategory[] = [...additionalCategories, ...categoryCollection];
      jest.spyOn(categoryService, 'addCategoryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ note });
      comp.ngOnInit();

      expect(categoryService.query).toHaveBeenCalled();
      expect(categoryService.addCategoryToCollectionIfMissing).toHaveBeenCalledWith(
        categoryCollection,
        ...additionalCategories.map(expect.objectContaining),
      );
      expect(comp.categoriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const note: INote = { id: 456 };
      const user: IUser = { id: 9720 };
      note.user = user;

      const userCollection: IUser[] = [{ id: 11195 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ note });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const note: INote = { id: 456 };
      const category: ICategory = { id: 3314 };
      note.category = category;
      const user: IUser = { id: 9607 };
      note.user = user;

      activatedRoute.data = of({ note });
      comp.ngOnInit();

      expect(comp.categoriesSharedCollection).toContain(category);
      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.note).toEqual(note);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<INote>>();
      const note = { id: 123 };
      jest.spyOn(noteFormService, 'getNote').mockReturnValue(note);
      jest.spyOn(noteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ note });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: note }));
      saveSubject.complete();

      // THEN
      expect(noteFormService.getNote).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(noteService.update).toHaveBeenCalledWith(expect.objectContaining(note));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<INote>>();
      const note = { id: 123 };
      jest.spyOn(noteFormService, 'getNote').mockReturnValue({ id: null });
      jest.spyOn(noteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ note: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: note }));
      saveSubject.complete();

      // THEN
      expect(noteFormService.getNote).toHaveBeenCalled();
      expect(noteService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<INote>>();
      const note = { id: 123 };
      jest.spyOn(noteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ note });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(noteService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCategory', () => {
      it('Should forward to categoryService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(categoryService, 'compareCategory');
        comp.compareCategory(entity, entity2);
        expect(categoryService.compareCategory).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});

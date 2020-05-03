import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { EntryService } from '../shared/entry.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';
import IMask from 'imask';
import { Entry } from '../shared/entry.model';
import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';
@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css'],
})
export class EntryFormComponent implements OnInit, AfterContentChecked {
  entryForm: FormGroup;
  entry: Entry = new Entry();
  currentAction: string;
  pageTitle: string;
  submitFormButton: boolean;
  serverErrorMessage: string[];
  categories: Category[];
  kl: any;
  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ',',
  };

  constructor(
    private entryService: EntryService,
    private router: Router,
    private activetedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private cattegoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.setCurrentAction();
    this.builEntryForm();
    this.loadEntry();
    this.teste();
    this.setCategories();
  }
  ngAfterContentChecked(): void {
    this.setPageTitle();
  }
  teste() {
    this.kl = IMask.createMask({
      mask: Number,
      scale: 2,
      thousandSeparator: '',
      padFractionalZeros: true,
      normalizeZeros: true,
      radix: ',',
    });
  }

  setPaid() {
    this.entryForm.get('paid').setValue(false);
    console.log(this.entryForm.get('paid').value);
  }
  private setCurrentAction() {
    // tslint:disable-next-line: triple-equals
    if (this.activetedRoute.snapshot.url[0].path == 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }

  setCategories() {
    this.cattegoryService
      .getAll()
      .subscribe((categories) => (this.categories = categories));
  }

  get Options(): Array<any> {
    return Object.entries(Entry.type).map(([id, name]) => {
      return { text: id, value: name };
    });
  }
  private builEntryForm() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: ['expense', [Validators.required]],
      amount: [null, [Validators.required]],
      date: ['10/10/2000', [Validators.required]],
      paid: [true, [Validators.required]],
      categoryId: [null, [Validators.required]],
    });
  }

  private loadEntry() {
    // tslint:disable-next-line: triple-equals
    if (this.currentAction == 'edit') {
      this.entryService
        .get(+this.activetedRoute.snapshot.paramMap.get('id'))
        .subscribe((entry) => {
          this.entryForm.patchValue(entry);
        });
      this.activetedRoute.paramMap
        .pipe(switchMap((params) => this.entryService.get(+params.get('id'))))
        .subscribe((entry) => (this.entry = entry));
    }
  }
  private setPageTitle() {
    // tslint:disable-next-line: triple-equals
    if (this.currentAction == 'edit') {
      this.pageTitle = 'Editar ' + this.entry.name;
    } else {
      this.pageTitle = 'criar';
    }
  }
  submitForm() {
    const entry = Object.assign(new Entry(), this.entryForm.value);
    this.submitFormButton = true;
    // tslint:disable-next-line: triple-equals
    if (this.currentAction == 'edit') {
      this.updateEntry(entry);
    } else {
      this.createEntry(entry);
    }
  }
  createEntry(entry: Entry) {
    this.entryService.create(entry).subscribe(
      (object) => this.success(object),
      (error) => this.error(error)
    );
  }
  updateEntry(entry: Entry) {
    this.entryService.update(entry).subscribe(
      (object) => this.success(object),
      (error) => this.error(error)
    );
  }

  private success(entry: Entry) {
    toastr.success('Solicitação processada com sucesso');
    this.router
      .navigateByUrl('entries', { skipLocationChange: true })
      .then(() => this.router.navigate(['entries', 'edit', entry.id]));
  }
  private error(error: any) {
    toastr.error('Solicitação com erro');
    this.submitFormButton = false;
    if (error.status === 422) {
      this.serverErrorMessage = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessage = ['Falha na comunicação com o servidor'];
    }
    // this.router.navigate(['entries']);
  }
}

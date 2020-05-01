import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { EntryService } from '../shared/entry.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { Entry } from '../shared/entry.model';
import toastr from 'toastr';
@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css'],
})
export class EntryFormComponent implements OnInit, AfterContentChecked {
  entryForm: FormGroup;
  entry: Entry;
  currentAction: string;
  pageTitle: string;
  submitFormButton: boolean;
  serverErrorMessage: string[];
  constructor(
    private entryService: EntryService,
    private router: Router,
    private activetedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.setCurrentAction();
    this.builEntryForm();
    this.loadEntry();
  }
  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  private setCurrentAction() {
    // tslint:disable-next-line: triple-equals
    if (this.activetedRoute.snapshot.url[0].path == 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }
  private builEntryForm() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: [null, [Validators.required]],
      aumount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [null, [Validators.required]],
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
      this.pageTitle = 'Editar';
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

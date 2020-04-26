import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { CategoryService } from '../shared/category.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { Category } from '../shared/category.model';
import toastr from 'toastr';
@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css'],
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {
  categoryForm: FormGroup;
  category: Category;
  currentAction: string;
  pageTitle: string;
  submitFormButton: boolean;
  serverErrorMessage: string[];
  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private activetedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.setCurrentAction();
    this.builCategoryForm();
    this.loadCategory();
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
  private builCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
    });
  }

  private loadCategory() {
    // tslint:disable-next-line: triple-equals
    if (this.currentAction == 'edit') {
      this.categoryService
        .get(+this.activetedRoute.snapshot.paramMap.get('id'))
        .subscribe((category) => {
          this.categoryForm.patchValue(category);
        });
      this.activetedRoute.paramMap
        .pipe(
          switchMap((params) => this.categoryService.get(+params.get('id')))
        )
        .subscribe((category) => (this.category = category));
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
    const category = Object.assign(new Category(), this.categoryForm.value);
    this.submitFormButton = true;
    // tslint:disable-next-line: triple-equals
    if (this.currentAction == 'edit') {
      this.updateCategory(category);
    } else {
      this.createCategory(category);
    }
  }
  createCategory(category: Category) {
    this.categoryService.create(category).subscribe(
      (object) => this.success(object),
      (error) => this.error(error)
    );
  }
  updateCategory(category: Category) {
    this.categoryService.update(category).subscribe(
      (object) => this.success(object),
      (error) => this.error(error)
    );
  }

  private success(category: Category) {
    toastr.success('Solicitação processada com sucesso');
    this.router
      .navigateByUrl('categories', { skipLocationChange: true })
      .then(() => this.router.navigate(['categories', 'edit', category.id]));
  }
  private error(error: any) {
    toastr.error('Solicitação com erro');
    this.submitFormButton = false;
    if (error.status === 422) {
      this.serverErrorMessage = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessage = ['Falha na comunicação com o servidor'];
    }
    // this.router.navigate(['categories']);
  }
}

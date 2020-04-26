import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Observable } from 'rxjs';
import { Category } from './pages/categories/shared/category.model';

export class InMemoryDataBase implements InMemoryDbService {
  categories: Category[];

  createDb() {
    const categories = [
      { id: 1, name: 'diego', description: 'descricao diego' },
      { id: 2, name: 'felix', description: 'descricao diego' },
      { id: 3, name: 'diego', description: 'descricao diego' },
      { id: 4, name: 'felix', description: 'descricao diego' },
      { id: 5, name: 'diego', description: 'descricao diego' },
      { id: 6, name: 'felix', description: 'descricao diego' },
      { id: 7, name: 'diego', description: 'descricao diego' },
      { id: 8, name: 'felix', description: 'descricao diego' },
    ];
    const products = new Observable<Category>((obs) => {
      setTimeout(() => this.categories, 1000);
    });
    console.log(products);
    return { categories };
  }
}

import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Observable } from 'rxjs';
import { Category } from './pages/categories/shared/category.model';
import { Entry } from './pages/entries/entries/shared/entry.model';

export class InMemoryDataBase implements InMemoryDbService {
  createDb() {
    const categories: Category[] = [
      { id: 1, name: 'diego', description: 'descricao diego' },
      { id: 2, name: 'felix', description: 'descricao diego' },
      { id: 3, name: 'diego', description: 'descricao diego' },
      { id: 4, name: 'felix', description: 'descricao diego' },
      { id: 5, name: 'diego', description: 'descricao diego' },
      { id: 6, name: 'felix', description: 'descricao diego' },
      { id: 7, name: 'diego', description: 'descricao diego' },
      { id: 8, name: 'felix', description: 'descricao diego' },
    ];
    const entries: Entry[] = [];
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < categories.length; index++) {
      entries.push(
        new Entry(
          ++index,
          'Gás cozinha' + index,
          'string' + index,
          'string' + index,
          '70,58',
          '10/20/2020',
          true,
          categories[++index].id,
          categories[++index]
        )
      );
    }

    return { categories, entries };
  }
}

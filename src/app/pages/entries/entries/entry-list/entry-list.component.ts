import { Component, OnInit } from '@angular/core';
import { EntryService } from '../shared/entry.service';
import { Entry } from '../shared/entry.model';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css'],
})
export class EntryListComponent implements OnInit {
  entries: Entry[] = [];
  constructor(private entryService: EntryService) {}

  ngOnInit(): void {
    this.entryService.getAll().subscribe(
      (entries) => (this.entries = entries),
      (error) => console.log(error)
    );
  }
  deleteEntry(entry: Entry) {
    this.entryService
      .delete(entry)
      .subscribe(
        () => (this.entries = this.entries.filter((item) => item !== entry))
      );
    console.log(entry);
  }
}

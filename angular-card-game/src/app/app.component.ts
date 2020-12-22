import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Memory';

  moves=0;

  constructor() {
  }

  ngOnInit(): void {
  }

  addItem(newItem: number) {
    this.moves = newItem;
  }
}
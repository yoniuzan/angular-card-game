import { animate, keyframes, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CardData } from '../card-data.model';
import { RestartDialogComponent } from '../restart-dialog/restart-dialog.component';

@Component({
  selector: 'app-memory-game',
  templateUrl: './memory-game.component.html',
  styleUrls: ['./memory-game.component.scss'],
  animations: [
    // Trigger animation cards array
    trigger('cardImages', [
      // Transition from any state to any state
      transition('* => *', [
        // Initially the all cards are not visible
        query(':enter', style({ opacity: 0 }), { optional: true }),

        // Each card will appear sequentially with the delay of 150ms
        query(':enter', stagger('150ms', [
          animate('.5s ease-in', keyframes([
            style({ opacity: 0, transform: 'translateY(-50%)', offset: 0 }),
            style({ opacity: .5, transform: 'translateY(-10px) scale(1.1)', offset: 0.3 }),
            style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
          ]))]), { optional: true }),

        // Cards will disappear sequentially with the delay of 300ms
        query(':leave', stagger('300ms', [
          animate('500ms ease-out', keyframes([
            style({ opacity: 1, transform: 'scale(1.1)', offset: 0 }),
            style({ opacity: .5, transform: 'scale(.5)', offset: 0.3 }),
            style({ opacity: 0, transform: 'scale(0)', offset: 1 }),
          ]))]), { optional: true })
      ]),
    ]),
  ]
})
export class MemoryGameComponent implements OnInit {

  cardImages = [
    'NfolQmovGYM',
    'QvcjOvnneWE',
    'gAVD08Mwhcg',
    'rGAFz8LhFZY',
    'hhtvzWRfndE',
    'ACELkfoBYTQ',
    '5cmpjwLu5Qg',
    'Z0KjmjxUsKs',
  ];

  @Output() moves = new EventEmitter<number>();
  
  cards: CardData[] = [];

  flippedCards: CardData[] = [];

  matchedCount = 0;

  countMove = 0;

  constructor(private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.setupCards();
  }

  addNewItem(value: number) {
    this.moves.emit(value);
  }

  setupCards(): void {
    this.cards = [];
    this.cardImages.forEach((image) => {
      const cardData: CardData = {
        imageId: image,
        state: 'default'
      };

      this.cards.push({ ...cardData });
      this.cards.push({ ...cardData });

    });

    this.cards = this.shuffleArray(this.cards);
  }

  shuffleArray(anArray: any[]): any[] {
    return anArray.map(a => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map(a => a[1]);
  }

  cardClicked(index: number): void {
    const cardInfo = this.cards[index];

    if (cardInfo.state === 'default' && this.flippedCards.length < 2) {
      cardInfo.state = 'flipped';
      this.flippedCards.push(cardInfo);

      if (this.flippedCards.length > 1) {
        this.checkForCardMatch();
      }

    } else if (cardInfo.state === 'flipped') {
      cardInfo.state = 'default';
      this.flippedCards.pop();

    }
  }

  checkForCardMatch(): void {
    setTimeout(() => {
      const cardOne = this.flippedCards[0];
      const cardTwo = this.flippedCards[1];
      const nextState = cardOne.imageId === cardTwo.imageId ? 'matched' : 'default';
      cardOne.state = cardTwo.state = nextState;

      this.flippedCards = [];
      this.countMove ++;
      this.addNewItem(this.countMove)
      

      if (nextState === 'matched') {
        this.matchedCount++;

        if (this.matchedCount === this.cardImages.length) {
          // this.moves = 0 ;
          //   this.restart();
          const dialogRef = this.dialog.open(RestartDialogComponent, {
            disableClose: true,
          });

          dialogRef.afterClosed().subscribe(() => {
            this.restart();
          });
        }
      }

    }, 1000);
  }

  restart(): void {
    this.matchedCount = 0;
    this.countMove = 0 ;
    this.setupCards();
  }
  

}

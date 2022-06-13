import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { HostListener } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  currentPlayer: string = "X";
  position = new Array<string>(9);
  overlayMsg: string = "";
  resultObj: any;
  typeSelected: string = "";

  configs = new OverlayConfig({
    hasBackdrop: true
  });

  overlayRef = this.overlay.create(this.configs);

  @ViewChild('overlayBtn', { read: ElementRef }) overlayBtn?: ElementRef;

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    console.log(event.key);
    if (event.keyCode <= 48 || event.keyCode > 57) {
      event.preventDefault();
      return;
    }

    this.markBoard(event.key, this.currentPlayer);
  }

  constructor(
    private service: SharedService,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef) {
    this.typeSelected = 'pacman';
  }

  ngOnInit(): void {
    this.resetPosition();
    this.initializeApp();
  }

  initializeApp() {
    this.service.testConnection()
      .subscribe({
        next: (data) => {
          console.log(data);
          console.log('Test Play successful!');
        },
        error: (e) => {
          console.log(e);
          this.overlayMsg = "Unable to connect with the backend!";
          this.overlayBtn?.nativeElement.click();
          setTimeout(() => {
            this.ngOnInit();
          }, 2000);
        },
        complete: () => {
          console.log('done');
        }
      });
  }

  resetPosition() {
    this.currentPlayer = "X";
    for (let i = 0; i < this.position.length; i++) {
      this.position[i] = '';
    }
  }

  markBoard(key: string, player: string) {
    if (this.position[Number(key) - 1] != '') {
      this.overlayMsg = "Already marked by other player!";
      this.overlayBtn?.nativeElement.click();
      return;
    }

    this.position[Number(key) - 1] = player;

    this.currentPlayer = player == "X" ? "O" : "X";

    const body = [
      { "player": this.position[6] },
      { "player": this.position[7] },
      { "player": this.position[8] },
      { "player": this.position[3] },
      { "player": this.position[4] },
      { "player": this.position[5] },
      { "player": this.position[0] },
      { "player": this.position[1] },
      { "player": this.position[2] }
    ];

    this.playTicTac(body);
  }

  playTicTac(obj: any) {
    this.service.play(obj).subscribe({
      next: (data) => {
        console.log(data);
        this.resultObj = data;
        if (this.resultObj.Winner) {
          this.overlayMsg = "Player " + this.resultObj.PlayerName + " Won!";
          this.overlayBtn?.nativeElement.click();
        }

        if (!this.resultObj.Winner && this.resultObj.PlayerName == "draw") {
          this.overlayMsg = "Cat's Game!";
          this.overlayBtn?.nativeElement.click();
        }
      },
      error: (e) => {
        console.log(e);
          this.overlayMsg = "Unable to connect with the backend!";
          this.overlayBtn?.nativeElement.click();
          setTimeout(() => {
            this.ngOnInit();
          }, 2000);
      },
      complete: () => {
        console.log('done');
      }
    });
  }

  openOverlay(tpl: TemplateRef<any>) {
    this.overlayRef.attach(new TemplatePortal(tpl, this.viewContainerRef));
  }

  closeOverlay() {
    this.overlayRef.detach();
  }
}

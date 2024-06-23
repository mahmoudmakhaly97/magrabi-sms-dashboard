import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import MetisMenu from 'metismenujs';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent  implements OnInit, OnChanges{
  @ViewChild('componentRef') scrollRef;
  @Output() sideMenuToggledChange = new EventEmitter<boolean>();

  @Input() isCondensed = false;
  @ViewChild('sideMenu') sideMenu: ElementRef;
  menu: any;

  constructor(private router:Router) {}
  ngOnInit(): void {
  }





  closeSideMenu(){ this.sideMenuToggledChange.emit(false);}

  ngOnChanges() {
    if (!this.isCondensed && this.sideMenu || this.isCondensed) {
      setTimeout(() => {
        this.menu = new MetisMenu(this.sideMenu.nativeElement);
      });
    } else if (this.menu) {
      this.menu.dispose();
    }
  }




}

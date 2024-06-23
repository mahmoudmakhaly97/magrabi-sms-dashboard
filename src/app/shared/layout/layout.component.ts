import { Component, HostListener, OnInit } from '@angular/core';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent{

  // isCondensed:any = false;
  constructor(public loadingService: LoadingService){}

  // ngOnInit(): void {

  //   if (window.screen.width <= 768) {
  //     document.body.classList.add('vertical-collpsed');
  //   }
  //   else{
  //     document.body.classList.add('sidebar-enable');
  //     document.body.classList.add('vertical-collpsed');
  //   }
  // }

  // onToggleMobileMenu() {
  //   this.isCondensed = !this.isCondensed;
  //   document.body.classList.toggle('sidebar-enable');
  //   document.body.classList.toggle('vertical-collpsed');

  //   if (window.screen.width <= 768) {
  //     document.body.classList.remove('vertical-collpsed');
  //   }
  // }
  sideMenuToggled:Boolean=false;
  sideMenuToggledMobile:Boolean=false;
  isSmallScreen = false;

  handleSideMenuToggledChange(value: boolean): void {
    this.sideMenuToggled = value;
  }

  toggleSideMenu(event: any): void {
    if (this.sideMenuToggledMobile) {
      this.sideMenuToggled = event;
    } else {
      this.sideMenuToggled = !this.sideMenuToggled;
    }
  }

  checkScreenSize(): void {
    const screenWidth = window.innerWidth;

    // Toggle classes based on screen size and sideMenuToggled value
    if (this.sideMenuToggled && screenWidth < 768) {
      this.isSmallScreen = true;
    } else {
      this.isSmallScreen = false;
    }
  }
  closeSideMenu(){
    this.sideMenuToggled =false
  }

  ngOnChanges(): void {
    this.checkScreenSize();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }
}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  @Input() public applyPaddingLeft: boolean = false;

  public readonly currentYear: number = new Date().getFullYear();
}

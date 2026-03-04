import { Component } from '@angular/core';
import { FooterLogo } from './footer-logo/footer-logo';
import { FooterNav } from './footer-nav/footer-nav';
import { FooterPolicies } from './footer-policies/footer-policies';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FooterLogo, FooterNav, FooterPolicies],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer { }

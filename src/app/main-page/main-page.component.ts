import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  standalone: true, // This component is now standalone
  imports: [CommonModule] // Imports CommonModule for Angular directives
})
export class MainPageComponent implements OnInit {

  // ViewChild decorator to get a reference to the code element
  @ViewChild('codeBlock') codeBlock!: ElementRef;

  mcpJsonContent = '';
  activeAssistant: string | null = null;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
  }

  setActive(assistant: string) {
    this.activeAssistant = assistant;
  }

  isActive(assistant: string): boolean {
    return this.activeAssistant === assistant;
  }

  // Method to copy the text from an input field or a div
  copyToClipboard(elementId: string): void {
    let copyText = '';
    const element = document.getElementById(elementId) as HTMLInputElement | HTMLDivElement;
    if (element instanceof HTMLInputElement) {
      copyText = element.value;
    } 
    else if (element instanceof HTMLDivElement) {
      copyText = element.innerText;
    }

    if (!copyText) {
      console.error('No text found to copy.');
      return;
    }

    // Create a temporary textarea to hold the text
    const textarea = this.renderer.createElement('textarea');
    this.renderer.setStyle(textarea, 'position', 'fixed');
    this.renderer.setStyle(textarea, 'top', '0');
    this.renderer.setStyle(textarea, 'left', '0');
    this.renderer.setStyle(textarea, 'width', '1px');
    this.renderer.setStyle(textarea, 'height', '1px');
    this.renderer.setStyle(textarea, 'padding', '0');
    this.renderer.setStyle(textarea, 'border', 'none');
    this.renderer.setStyle(textarea, 'outline', 'none');
    this.renderer.setStyle(textarea, 'boxShadow', 'none');
    this.renderer.setStyle(textarea, 'background', 'transparent');
    this.renderer.setProperty(textarea, 'value', copyText);

    this.renderer.appendChild(document.body, textarea);
    textarea.select();

    try {
      const successful = document.execCommand('copy');
      const msg = successful ? 'successful' : 'unsuccessful';
      console.log('Copying text command was ' + msg);
      this.showMessage('Copied!');
    } catch (err) {
      console.error('Oops, unable to copy', err);
      this.showMessage('Failed to copy.');
    } finally {
      this.renderer.removeChild(document.body, textarea);
    }
  }

  // Method to display a temporary message
  showMessage(text: string): void {
    const messageContainer = document.getElementById('message-container');
    if (messageContainer) {
      messageContainer.innerText = text;
      this.renderer.addClass(messageContainer, 'show-message');
      setTimeout(() => {
        this.renderer.removeClass(messageContainer, 'show-message');
      }, 2000); // Hide after 2 seconds
    }
  }

  // Method to copy the code block text
  copyCode(): void {
    if (this.codeBlock) {
      this.copyToClipboard('code-block-content');
    }
  }
}
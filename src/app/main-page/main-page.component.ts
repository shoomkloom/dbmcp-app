import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class MainPageComponent implements OnInit {

  connectionString = '';
  mcpUrl = '';
  dbuser = '';
  mcpJsonContent = '';
  showHighlightInstructions = false;
  activeAssistant = 'cursor';

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
  }

  setActive(assistant: string) {
    this.activeAssistant = assistant;
    this.setMcpJsonContent();
  }

  isActive(assistant: string): boolean {
    return this.activeAssistant === assistant;
  }

  connectionStringChanged(connectionString: string) {
    this.connectionString = connectionString;
    this.updateMcpUrlAndJson();
  }

  updateMcpUrlAndJson() {
    // Update the MCP URL based on the connection string
    try{
      const result = this.sanitizeAndEncodeConnectionString();
      if(result.sanitized){
        let passwordPlaceholder = '';
        switch(result.dbtype){
          case 'mongodb':
            passwordPlaceholder = 'mongodbpassword=<YOUR PASSWORD>';
            break;
          case 'postgre':
            passwordPlaceholder = 'postgrepassword=<YOUR PASSWORD>';
            break;
          case 'mysql':
            passwordPlaceholder = 'mysqlpassword=<YOUR PASSWORD>';
            break;
          default:
            throw new Error('Unsupported database type'); 
        }
        this.mcpUrl = `${environment.dbmcpBaseUrl}?srvString=${result.sanitized}&${passwordPlaceholder}`;
        this.dbuser = result.dbuser || '';
        // Update the MCP JSON content
        this.setMcpJsonContent();
      }
      else{
        this.mcpUrl = '';
        this.mcpJsonContent = '';
      }
    }
    catch(error){
      console.error('Error updating MCP URL and JSON:', error);
      this.mcpUrl = '';
      this.mcpJsonContent = '';
      const errorMessage = `Error updating MCP URL and JSON: ${(error instanceof Error ? error.message : String(error))}`;
      this.showMessage(errorMessage);
    }
  }

  setMcpJsonContent() {
    const dbmcServerName = this.dbuser ? `dbmcp-${this.dbuser}` : 'dbmcp';
    switch(this.activeAssistant){
      case 'cursor':
        this.showHighlightInstructions = false;
        this.mcpJsonContent = 
`
{
  "mcpServers": {
    "${dbmcServerName}": {
      "url": "${this.mcpUrl}",
    }
  }
}`;
        break;
      case 'claude':
        this.showHighlightInstructions = false;
        this.mcpJsonContent = 
`
{
  "mcpServers": {
    "${dbmcServerName}": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "${this.mcpUrl}"
      ]
    }
  }
}`;  
        break;
      case 'windsurf':
        this.showHighlightInstructions = false;
        this.mcpJsonContent =
`
{
  "mcpServers": {
    "${dbmcServerName}": {
      "serverUrl": "${this.mcpUrl}"
    }
  }
}`;
        break;
      case 'vscode':
        this.showHighlightInstructions = false;
        this.mcpJsonContent = 
`
{
  "servers": {
    "${dbmcServerName}": {
      "type": "http",
      "url": "${this.mcpUrl}"
    }
  }
}`;
        break;
      case 'cline':
        this.showHighlightInstructions = false;
        this.mcpJsonContent = 
`
{
  "mcpServers": {
    "${dbmcServerName}": {
      "url": "${this.mcpUrl}",
      "disabled": false,
      "autoApprove": []
    }
  }
}`; 
        break;
      case 'highlight':
        this.showHighlightInstructions = true;
        this.mcpJsonContent = ``; 
        break;
      case 'augment':
        this.showHighlightInstructions = false;
        this.mcpJsonContent = 
`
{
  "mcpServers": {
    "${dbmcServerName}": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "${this.mcpUrl}"
      ]
    }
  }
}`;
        break;
      case 'mysty':
        this.showHighlightInstructions = false;
        this.mcpJsonContent = 
`
{
  "mcpServers": {
    "${dbmcServerName}": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "${this.mcpUrl}"
      ]
    }
  }
}`;
        break;
      default:
        this.showHighlightInstructions = false;
        this.mcpJsonContent = '';
    }

    
  }

  sanitizeAndEncodeConnectionString(): { sanitized: string; dbuser: string | null; dbtype: string | null } {
    // Regex to match mongodb connection string with optional password
    const mongodbRegex = /^(mongodb(?:\+srv)?:\/\/)([^:]+)(?::([^@]*))?@(.*)$/;
    const mongodbMatch = this.connectionString.match(mongodbRegex);
    if(mongodbMatch){
      const [, protocol, username, , rest] = mongodbMatch;

      // Rebuild connection string without the password
      const sanitized = `${protocol}${username}@${rest}`;

      // URL encode full string
      return {
        sanitized: encodeURIComponent(encodeURIComponent(sanitized)),
        dbuser: username,
        dbtype: 'mongodb'
      };
    }

    const postgreRegex = /^(postgresql?:\/\/)([^:]+)(?::([^@]*))?@(.*)$/;
    const postgreMatch = this.connectionString.match(postgreRegex);
    if(postgreMatch){
      const [, protocol, username, , rest] = postgreMatch;

      // Rebuild connection string without the password
      const sanitized = `${protocol}${username}@${rest}`;

      // URL encode full string
      return {
        sanitized: encodeURIComponent(encodeURIComponent(sanitized)),
        dbuser: username,
        dbtype: 'postgre'
      };
    }

    const mysqlRegex = /^(mysql?:\/\/)([^:]+)(?::([^@]*))?@(.*)$/;
    const mysqlMatch = this.connectionString.match(mysqlRegex);
    if(mysqlMatch){
      const [, protocol, username, , rest] = mysqlMatch;

      // Rebuild connection string without the password
      const sanitized = `${protocol}${username}@${rest}`;

      // URL encode full string
      return {
        sanitized: encodeURIComponent(encodeURIComponent(sanitized)),
        dbuser: username,
        dbtype: 'mysql'
      };
    }

    // Not a valid connection string URI
    return {
      sanitized: '',
      dbuser: '',
      dbtype: ''
    };
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
    this.copyToClipboard('code-block-content');
  }
}
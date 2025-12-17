import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExecutionModalComponent } from './execution-modal/execution-modal.component';
import { NodeCanvasComponent } from './node-canvas/node-canvas.component';
import { PropertyPanelComponent } from './property-panel/property-panel.component';
import { SeleniumPageComponent } from './selenium.page';

@NgModule({
  declarations: [
    SeleniumPageComponent,
    NodeCanvasComponent,
    PropertyPanelComponent,
    ExecutionModalComponent,
  ],
  imports: [CommonModule, FormsModule],
  exports: [SeleniumPageComponent],
})
export class SeleniumModule {}

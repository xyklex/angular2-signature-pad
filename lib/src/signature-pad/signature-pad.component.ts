import { Component,Output, Input, EventEmitter, OnInit,ElementRef } from '@angular/core';
import { SignaturePadService } from './signature-pad.service';

declare var require: any;

@Component({
  selector: 'signature-pad,[SignaturePad]',
  template: `
    <div id="signature-pad" class="m-signature-pad">
      <div class="m-signature-pad--body">
        <canvas style="touch-action: none;"></canvas>
      </div>
      <div class="m-signature-pad--footer" [hidden]="_hideFooter">
        <div class="description">{{_label}}</div>
        <button type="button" class="button clear" data-action="clear" (click)="onClearClick()">Clear</button>
        <!-- <button type="button" class="button save" data-action="save" (click)="onSaveClick()">Save</button> -->
      </div>
    </div>
 `,
  styles: [`
.m-signature-pad {
  position: relative;
  font-size: 10px;
  background-color: #fff;
  width: 100%;
}

.m-signature-pad--body {
  padding: 20px;
  height: 300px;
}

.m-signature-pad--body
  canvas {
  }

.m-signature-pad--footer {
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 20px;
  height: 40px;
}

.m-signature-pad--footer
  .description {
    color: #C3C3C3;
    text-align: center;
    font-size: 1.2em;
    margin-top: 1.8em;
  }

.m-signature-pad--footer
  .button {
    position: absolute;
    bottom: 0;
  }

.m-signature-pad--footer
  .button.clear {
    left: 0;
  }

.m-signature-pad--footer
  .button.save {
    right: 0;
  }
  `]
})
export class SignaturePadComponent implements OnInit {
  @Output() onSave = new EventEmitter();
  @Output() onClear = new EventEmitter();
 
  private _fromDataURL:String;
  private _fromData:any;
  
  public _width:number = 200;
  public _height:number = 200;
  public _hideFooter:boolean;
  public _label:string = 'Sign above';

  private _canvas: any;
  private _signaturePad:any;
  
  constructor(
    private _el:ElementRef
  ) { }

  ngOnInit() {
  }

  @Input() 
  set width(value:number) {
    this._width = value;
  }

  @Input()
  set height(value:number) {
    this._height = value;
  }

  @Input()
  set formDataURL (value:string) {
    this._fromDataURL = value;
    this._signaturePad.fromDataURL(this._fromDataURL);
  }

  @Input()
  set fromData(value:string) {
    this._fromData = value;
    this._signaturePad.fromData(this._fromData);
  }

  @Input() 
  set hideFooter(value:boolean) {
    this._hideFooter = value;
  }

  @Input()
  set label(value:string) {
    this._label = value;
  }

  get toDataUrl() {
    return this._signaturePad.toDataURL();
  }

  resizeCanvas() {
    console.log(window);
    const ratio =  Math.max(window.devicePixelRatio || 1, 1);
    const parentDiv = this._el.nativeElement.querySelector('#signature-pad > div.m-signature-pad--body')

    this._canvas.width = (parentDiv.offsetWidth * ratio) - 40;
    this._canvas.height = (parentDiv.offsetHeight * ratio) - 40;
    this._canvas.getContext('2d').scale(ratio, ratio);

    this._signaturePad.clear();
  }

  ngAfterViewInit() {
    let SignaturePad = require('signature_pad')['default'];

    this._canvas = this._el.nativeElement.querySelector('canvas');
    this._signaturePad = new SignaturePad(this._canvas);
    this.resizeCanvas();
    window.onresize = this.resizeCanvas.bind(this);
  }

  onClearClick() {
    this._signaturePad.clear();
    this.onClear.emit();
  }

  onSaveClick() {
    this.onSave.emit(this._signaturePad.toDataURL()); 
  }

}
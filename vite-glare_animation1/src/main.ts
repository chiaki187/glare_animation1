const app=document.getElementById('app') as HTMLElement;
app.insertAdjacentHTML('afterbegin',`<canvas id="canvas" style="border: solid 1px;" width="480" height="480"></canvas>`);
const canvas=document.getElementById('canvas') as HTMLCanvasElement;
const ctx=canvas.getContext('2d') as CanvasRenderingContext2D;


interface Vector2{
  x:number;
  y:number;
}

interface Glare{
  draw():void;
}

abstract class GlareBase implements Glare{
  protected topLeft:Vector2;
  constructor(x:number,y:number){
    this.topLeft={x,y};
  }
  getTopLeft():Vector2{return this.topLeft;};
  abstract draw():void;

}

class Glare1 extends GlareBase{
  constructor(x:number,y:number){
    super(x,y);
  }

  override draw():void{
    ctx.beginPath();
    ctx.arc(canvas.width/2,canvas.height/2,3,0,Math.PI*2);
    ctx.fill();
  }
}

const g1:Glare=new Glare1(0,0);
g1.draw();
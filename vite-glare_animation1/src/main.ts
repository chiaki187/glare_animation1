const app=document.getElementById('app') as HTMLElement;
app.insertAdjacentHTML('afterbegin',`<canvas id="canvas1" style="border: solid 1px;" width="400" height="400"></canvas>`);
app.insertAdjacentHTML('afterbegin',`<canvas id="canvas2" style="border: solid 1px;" width="400" height="400"></canvas>`);
app.insertAdjacentHTML('afterbegin',`<canvas id="canvas3" style="border: solid 1px;" width="400" height="400"></canvas>`);

const canvas:HTMLCanvasElement[]=[];
canvas[0]=document.getElementById('canvas1') as HTMLCanvasElement;
canvas[1]=document.getElementById('canvas2') as HTMLCanvasElement;
canvas[2]=document.getElementById('canvas3') as HTMLCanvasElement;


const ctx:CanvasRenderingContext2D[]=[];
ctx[0]=canvas[0].getContext('2d') as CanvasRenderingContext2D;
ctx[1]=canvas[1].getContext('2d') as CanvasRenderingContext2D;
ctx[2]=canvas[2].getContext('2d') as CanvasRenderingContext2D;

for(let i=0;i<3;i++){
  canvas[i].style.backgroundColor="#000000";
}

interface Vector2{
  x:number;
  y:number;
}

interface Glare{
  draw():void;
}

abstract class GlareBase implements Glare{
  protected topLeft:Vector2;
  protected circleSize:number=50;
  constructor(x:number,y:number){
    this.topLeft={x,y};
  }
  getTopLeft():Vector2{return this.topLeft;};
  abstract draw():void;

}

class Glare1 extends GlareBase{

  protected ctxPlace:number;
  constructor(x:number,y:number,ctxPlace:number){
    super(x,y);
    this.ctxPlace=ctxPlace;
  }

  override draw():void{
    const c=ctx[this.ctxPlace];
    c.beginPath();
    c.arc(this.topLeft.x,this.topLeft.y,this.circleSize,0,Math.PI*2);
    c.fillStyle="white";
    c.fill();
  }
}



abstract class AnimationaFrame extends GlareBase{
  protected ctxPlace:number;
  protected baseSize:number=this.circleSize;
  
  constructor(x:number,y:number,ctxPlace:number){
    super(x,y);
    this.ctxPlace=ctxPlace;
  }

  abstract draw():void;
  abstract move1(t:number):void;

  clare():void{
    ctx[this.ctxPlace].clearRect(0,0,canvas[this.ctxPlace].width,canvas[this.ctxPlace].height);
  }
}

class Animate1 extends AnimationaFrame{
  protected alpha:number=0;
  constructor(x:number,y:number,ctxPlace:number){
    super(x,y,ctxPlace);
  }

  draw():void{
    const c=ctx[this.ctxPlace];
    c.save(); // ← 追加

    c.globalAlpha = this.alpha;
    const grad=c.createRadialGradient(
      this.topLeft.x,this.topLeft.y,this.circleSize,                 //内側
      this.topLeft.x,this.topLeft.y,this.circleSize*2  //外側
    )
    grad.addColorStop(0,"white");       //中心は明るく
    grad.addColorStop(1,"black");//外側は透明
    ctx[this.ctxPlace].beginPath();
    ctx[this.ctxPlace].arc(this.topLeft.x,this.topLeft.y,this.circleSize*2,0,Math.PI*2);
    ctx[this.ctxPlace].fillStyle=grad;
    ctx[this.ctxPlace].fill();

    c.restore();
  }


  move1(t:number):void{
    //元の円よりも小さくなりすぎないように10を最低サイズにする
    this.circleSize=this.circleSize = this.baseSize/2 + Math.sin(t) * 10+20;
  }

  move2(t:number):void{
    this.alpha =  Math.sin(t)*0.5 +0.5;
   
  }

  move3(t:number):void{
    //元の円よりも小さくなりすぎないように10を最低サイズにする
    this.circleSize=this.circleSize = this.baseSize/2 + Math.sin(t) * 10+20;
  }

}


class Animate2 extends AnimationaFrame{
  protected alpha:number=0;
  constructor(x:number,y:number,ctxPlace:number){
    super(x,y,ctxPlace);
  }

  draw():void{
    const c=ctx[this.ctxPlace];
    c.save(); // ← 追加

    c.globalAlpha = this.alpha;
    const grad=c.createRadialGradient(
      this.topLeft.x,this.topLeft.y,this.circleSize,                 //内側
      this.topLeft.x,this.topLeft.y,this.circleSize*2  //外側
    )
    grad.addColorStop(0,"white");       //中心は明るく
    grad.addColorStop(1,"black");//外側は透明
    ctx[this.ctxPlace].beginPath();
    ctx[this.ctxPlace].arc(this.topLeft.x,this.topLeft.y,this.circleSize*2,0,Math.PI*2);
    ctx[this.ctxPlace].fillStyle=grad;
    ctx[this.ctxPlace].fill();

    c.restore();
  }


  move1(t:number):void{
    this.alpha =  Math.sin(t)*0.5 +0.5;
  }

}








class canvasManager{
  protected g1:Glare[]=[];
  
  protected a1:Animate1;
  protected a2:Animate1;
  private time:number=0;

  constructor(){    
    for(let i=0;i<3;i++){
      this.g1[i]=new Glare1(canvas[0].width/2,canvas[0].height/2,i);
    }
    this.a1=new Animate1(canvas[0].width/2,canvas[0].height/2,2);
    this.a2=new Animate1(canvas[0].width/2,canvas[0].height/2,1);
  }
  
  drawAll():void{
    for(let i=0;i<3;i++){
      this.g1[i].draw();
    }
    this.a1.draw();
    this.a2.draw();
     requestAnimationFrame(this.animate);
  }

  animate=()=>{
    this.time+=0.05;

    this.a1.move1(this.time);
    this.a2.move2(this.time);
    //g1,g2ともに消える
    this.a1.clare();
    this.a2.clare();

    //g2の方を先に描画
    this.a1.draw();
    this.a2.draw();


    for(let i=0;i<3;i++){
      this.g1[i].draw();
    }
    
    requestAnimationFrame(this.animate);
  }
}

const m=new canvasManager();
m.drawAll();

//
// Copyright (c) 2022 Freddy Vandriessche.
// notice: https://raw.githubusercontent.com/RetroAppleJS/RetroAppleJS.github.io/main/LICENSE.md
//
// HGRpattern.js

//const { data } = require("jquery");

function PATTERN(idx,x,y)
{
    this.bmapx = 28;  // grid width
    this.bmapy = 4;   // grid height
    this.filterExcl = [];
    this.diffusion_data = [
      [[1,0,0],[2,0,0],[3,0,0],[4,0,0],[5,0,0]],
      [[0,1,0],[0,2,0],[0,3,0],[0,4,0],[0,5,0]],
      [[0,0,1],[0,0,2],[0,0,3],[0,0,4],[0,0,5]]
    ]

    this.diffusion_data = [
      [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
      [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
      [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]]
    ]

    this.trace_diffusion_data = function()
    {
      for(var i=0,s="";i<3;i++)
      {
        s+="<div style='float:left'><table class=thin border=1 style='float:left;margin-right:10px'><tr><td></td>";
        for(var j=0;j<5;j++)
          s+= "<td>"+this.diffusion_data[i][j].join(".")+"</td>"+(j==1?"</tr><tr>":"")
        s+="</tr></table></div>";
      }
      return s
    }

    this.colorFN = function(x, y, left, me, right, b7) { [0,0,0] }  // NEEDS FUNCTION OVERRIDE
    function ltrim(s) { return s.replace(/^ */,"") }
    function rtrim(s) { return s.replace(/ *$/,"") }
    function trim(s)  { return rtrim(ltrim(s)) }

    function editable_map(x,y)
    {
      if(x<0) return [false,0];
      try{ return custom_bmap[x%this.bmapx][y%this.bmapy] }
      catch(e){ return 0 }
    }
    
    this.prep = 4;                          // horizontal pattern repetition = 4, vertical pattern repetition = 2 (hard coded)
    this.pmax = Math.pow(2,2*this.prep)*3;  // 2 ^ (2 rows * 2 bits) * 3 high-bit combinations
    this.hextab= ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
    this.getHexByte    = function(v) { return this.hextab[v>>4]+this.hextab[v&0xf] }
    this.HEX2RGB       = function(hex) { var n=parseInt(hex.slice(1),16); return [(n>>16)&0xFF,(n>>8)&0xFF,n&0xFF] }
    this.RGB2HEX       = function(dec) { return [this.getHexByte(dec[0]),this.getHexByte(dec[1]),this.getHexByte(dec[2])] }
    this.colorDistance = function(a,b) { return Math.sqrt(Math.pow(a[0]-b[0],2)+ Math.pow(a[1]-b[1],2)+Math.pow(a[2]-b[2],2)) }
    this.colorSaturation = function(a) {
      var avg = Math.round((a[0]+a[1]+a[2])/3);
      if(avg==0) return 0;          // prevent division by zero vvv
      return Math.round(100*this.colorDistance(a,[avg,avg,avg])/avg)
    }
    this.set_prep = function(bits) { this.prep = Number(bits); this.pmax = Math.pow(2,2*this.prep)*3 }
    this.calculate = function(p,x,y) // p = pattern number
    {
        var n  = this.prep;          // horizontal pattern repetition
        var pm = (1<<n)-1;           // when all n bits should be lit        
        var ba = [0,1,3];            // cycle through bit 7 
        var b7 =  ba[(p>>(2*n))&3]   // bit 7 status is changing at every combination of every even and uneven rows e.g. 2 * 4 bits = 8 bits

        if((y&1)==0)
          return [(p&pm)&(1<<(x%n))?1:0      ,(b7&1)*128];    // even rows
        else 
          return [((p>>n)&pm)&(1<<(x%n))?1:0 ,(b7&2)*64];     // odd rows
    }

    this.is_2x2 = function(patternID)
    {
      for(var y=0;y<2;y++)
        for(var x=0;x<2;x++)
          if(this.calculate(patternID,x,y)[0] != this.calculate(patternID,x+2,y)[0]) return false;

      for(var x=0;x<2;x++)
        for(var y=0;y<2;y++)
          if(this.calculate(patternID,x,y)[0] != this.calculate(patternID,x,y+2)[0]) return false;

      return true;
    }
    

  /*
  this.calculate = function(idx,x,y)
    {
      switch(idx)
      {
        case 0:  return  [editable_map(x,y)[0],editable_map(x,y)[1]];
        //case 1:  return  [eval(custom_fmla[0]),eval(custom_fmla[1])];
        //case 2:  return  [false,0];               // black 1 
        case 1:  return  [(x+1)%2==0,0];            // green 
        case 2:  return  [x%2==0,0];                // purple
        case 3:  return  [true,0];                  // white 1  
        case 4:  return  [false,128];               // black 2
        case 5:  return  [(x+1)%2==0,128];         // orange
        case 6:  return  [x%2==0,128];              // blue
        case 7:  return  [true,128];                // white2 2

        case 10: return  [(x+1)%2==0 && y%2==0,0];  // dark green 
        case 11: return  [x%2==0 && y%2==0,0];      // dark purple       
        case 12: return  [(x+1)%2==0 && y%2==0,128];// dark orange
        case 13: return  [x%2==0 && y%2==0,128];    // dark blue
        case 14: return  [(x+1)%2==0 || y%2==0,0];  // dark green 
        case 15: return  [x%2==0 || y%2==0,0];      // dark purple    
        case 16: return  [(x+1)%2==0 || y%2==0,128];// dark orange
        case 17: return  [x%2==0 || y%2==0,128];    // dark blue
        case 18: return  [y%2==0,0];
        case 19: return  [(!(x&1)==0 && y%3==0) || (!(x&1)==0 && y%3==1) || (1 && y%3==2),y%3!=1?128:0 ];

        case 20: return  [(x+1)%2==0 && y%2==0 || x%2==0 && y%2!=0,0];
        case 21: return  [(x+1)%2==0,y%2!=0?128:0];
        case 22: return  [(x+1)%2==0 && y%2==0 || x%2==0 && y%2!=0,y%2!=0?128:0];
        case 23: return  [x%2==0 && y%2==0 || (x+1)%2==0 && y%2!=0,y%2!=0?128:0];
        case 24: return  [x%2==0,y%2!=0?128:0];
        case 25: return  [(x+1)%2==0 && y%2==0 || x%2==0 && y%2!=0,128];
        case 26: return  [(y&1)==0 && (x&3)==0 || (y&1)==1 && (x&3)==2 ,0];
        case 27: return  [(y&1)==0 && (x&3)==1 || (y&1)==1 && (x&3)==3 ,0];
        case 28: return  [(y&1)==0 && (x&3)==0 || (y&1)==1 && (x&3)==2 ,128];
        case 29: return  [(y&1)==0 && (x&3)==1 || (y&1)==1 && (x&3)==3 ,128];          

        case 30: return  [y%2==0 && ( (x>>1)%2!=0 || (x+1)%2==0) || y%2!=0 && (x+1)%2!=0,0]; 
        case 31: return  [y%2==0 && ( (x>>1)%2!=0 || (x+1)%2==0) || y%2!=0 && x%2!=0,y%2!=0?128:0];   
        case 32: return  [y%2==0 && ( (x>>1)%2!=0 || (x+1)%2==0) || y%2!=0 && (x+1)%2!=0,y%2!=0?128:0]; 
        case 33: return  [y%2==0 && ( (x>>1)%2!=0 || (x)%2==0)   || y%2!=0 && x%2!=0,y%2!=0?128:0];  
        case 34: return  [y%2==0 && ( (x>>1)%2!=0 || (x)%2==0)   || y%2!=0 && (x+1)%2!=0,y%2!=0?128:0]; 
        case 35: return  [y%2==0 && ( (x>>1)%2!=0 || (x+1)%2==0) || y%2!=0 && (x+1)%2!=0,128];  
        case 36: return  [y%2==0 && ( (x>>1)%2!=0 || (x+1)%2==0) || y%2!=0 && x%2!=0,y%2==0?128:0];
        case 37: return  [(x%2==0 || (x+1)%4==0) && y%2==0 || (x%2==0 || (x+2)%4==0) && y%2!=0,y%2==0?128:0 ];
        case 38: return  [(x>>1)%2==0 && y%2==0 || ((x+2)>>1)%2==0 && y%2!=0 ,0 ];

        case 40: return  [(x%2==0 || (x+1)%4==0) && y%2==0 || (x%2==0 || (x+3)%4==0) && y%2!=0,0 ];
        case 41: return  [((x+1)%2==0 || (x+2)%4==0) && y%2==0 || ((x+1)%2==0 || (x+4)%4==0) && y%2!=0,0 ];
        case 42: return  [((x+1)%2==0 || (x+2)%4==0) && y%2==0 || ((x+1)%2==0 || (x+4)%4==0) && y%2!=0,y%2==0?128:0 ];
        case 43: return  [(x%2==0 || (x+1)%4==0) && y%2==0 || (x%2==0 || (x+3)%4==0) && y%2!=0,y%2==0?128:0 ];
        case 44: return  [y%2==0 && (x>>1)%2!=0 || y%2!=0,0];

        case 50: return  [(y&1)==0 && (x&3)==1 || (y&1)==1 && (x&3)==3 ,(y&1)<<7];
        case 51: return  [(y&1)==0 && (x&3)==0 || (y&1)==1 && (x&3)==2 ,(y&1)<<7];
        case 52: return  [(y&1)==0 && ((x+1)&3)==0,0];
        case 53: return  [(y&1)==0 && (x&3)==0,0];
        case 54: return  [(y&1)==0 && ((x+1)&3)==0,128];
        case 55: return  [(y&1)==0 && (x&3)==0,128];

        case "": return  [true,0];
        default: return  [false,0];  
      }
  }
  */

  this.colCompIDX = {}

  this.color = function(patternID,colorFN)
  {
    this.colCompIDX = {};
    var m = 2;
    var col_m = 255 * m * m * this.bmapx * this.bmapy;
    var max_sum = [col_m,col_m,col_m];
    var col_sum = [0,0,0];

      // color sampler
      for(var y=0;y<this.bmapy*m;y++)
      {
        for(var x=1;x<this.bmapx*m-1;x++)
        {
          var left = this.calculate(patternID,x-1,y)[0];
          var me = this.calculate(patternID,x,y)[0];
          var right = this.calculate(patternID,x+1,y)[0];
          var b7 = this.calculate(patternID,x,y)[1];
          var col = colorFN(x, y, left, me, right, b7);
          col_sum = [ col_sum[0] + parseInt(col.substring(1,3),16)
                    , col_sum[1] + parseInt(col.substring(3,5),16)
                    , col_sum[2] + parseInt(col.substring(5,7),16)];

          //if(y==0 && x==0) document.write(col+"<br>")
          this.colCompIDX[col] = true;
        }
      }
      // calculate color average
      return [Math.round(col_sum[0]/max_sum[0]*255), Math.round(col_sum[1]/max_sum[1]*255), Math.round(col_sum[2]/max_sum[2]*255) ]
  }

  this.bColorUsed = function(col)
  {
     return this.colIDX[col]?true:false;
  }

  this.add_criteria = function(colorFN)
  {
    // INVENTORIZE DOUBLES (PATTERNS WITH SAME COLOR)
    var doubles = {};
    for(var p=0;p<this.pmax;p++)
    {
      var c = this.color(p,colorFN);    // calculate average color of patternID, by borrowing hgr_PixelColor function from emulator
      var csh = "#"+RGB2HEX(c).join("");

      if(typeof(doubles[csh])!="number"                                                         // inventorize doubles
      && !this.criteria[p])    // do not inventorize pre-defined doubles
          doubles[csh] = p;
      else
      {
        if(typeof(doubles[csh])!="number") continue;

        if (!this.criteria[p])   
            this.criteria[p] = {"DOUBL":doubles[csh]};
          else 
            this.criteria[p]["DOUBL"] = doubles[csh]; // bug
      }
    }
  }

  this.test_criteria = function(p)
  {
    var cc = this.criteria[p];
    if(typeof(cc)=="undefined") cc = {"REG":-1};
    for(var i=0;i<this.filterExcl.length;i++)
      if(cc[this.filterExcl[i]]) return false;
    return true;
  }

  this.parse = function()
  {
    // PARSE PATTERN FUNCTION - CASE BY CASE
    var formula_list = String(this.calculate).split("return");
    var formula_ref = {};
    for(var i=1;i<formula_list.length;i++)
    {
      var casenr = formula_list[i-1].split("case")[1];
      var triple = trim( formula_list[i].substring(0,formula_list[i].indexOf(";")) );
      var arr = triple.split(/([()])/);
      var levels = []; c =0;
      for(var l=0;l<arr.length;l++)
        {levels.push(c==0?arr[l].replace(/,/g,",,,,,"):arr[l]) ; c+=(arr[l]=='('?1:0) + (arr[l]==')'?-1:0);   }
      
      if(typeof(casenr)=="string" && casenr.indexOf(":")>0 && triple.charAt(0)=="[")
      {
        casenr = Number(casenr.substring(0,casenr.indexOf(":")));
        var fml = levels.join("").split(",,,,,")
        formula_ref[casenr] = [ fml[1] , fml[2].substring(0,fml[2].lastIndexOf("]")) ];  // TODO fix EOL sign !
      }
    }
    return formula_ref
  }

  this.pixel = function(x,y,patternID,rbyt)
  {
      var wbyt = rbyt | (1 << x%7);                     // OR current bit with pixel bit
      if(rbyt ==0 && rbyt&8 != this.calculate(patternID,x,y)[1])
        wbyt |= this.calculate(patternID,x,y)[2];    // OR high bit
      else
      {
        wbyt |= this.calculate(patternID,x,y)[1];
        //document.getElementById("debug").innerHTML += "CONFLICT "+PRINTByte(rbyt)+" >> "+PRINTByte(wbyt)
      }  // TODO resolve Hi-Byte conflict !!

      if(this.calculate(patternID,x,y)[0]) return wbyt;
      return rbyt;
  }

  this.steinberg_error_diffusion = function(arg)
  {

  }

  this.export_json = function(arg)
  {
    if(arg===undefined) arg = {};
    var s= "{\r\n";
    //s+= "\"settings\":{\"bits\":4},\r\n";
    var idx = 0;
    //var pmax = _D.blc[1]*_D.blc[0];

    // TODO ADD 2 RECORDS !!! BLACK AND WHITE !!!!
    var isBW = [false,false];

    for(var p=0;p<this.pmax;p++)   // this is the display matrix size
    {
      if(this.calculate(p,0,0)[0]!=null)
      {
        var c = this.color(p,apple2plus.video.hgr_PixelColor);    // calculate average color of patternID, by borrowing hgr_PixelColor function from emulator
        var cc = typeof(this.criteria[p])=="object"?this.criteria[p]:{};

        var m=["0b",0,"0b",0]
        for(var i=0;i<this.prep;i++) { var t=this.calculate(p,i,0); m[0]+=t[0];m[1]=t[1] }
        for(var i=0;i<this.prep;i++) { var t=this.calculate(p,i,1); m[2]+=t[0];m[3]=t[1] }
        //console.log(p+" "+m[0]+" "+m[0]);

        var data_arg = {
          "idx":idx
          ,"col":"\"#"+RGB2HEX(c).join("")+"\""
          ,"sat":this.colorSaturation(c)
          ,"cmp":"["+Object.keys(this.colCompIDX).map(function(x){return '"'+x+'"'}).join(',')+"]"
          ,"pat":"new Uint8Array(["+m.join(",")+"])"
          ,"cri":"{"+Object.keys(cc).map(function(x){return '"'+x+'":'+cc[x]}).join(',')+"}"
        }
        if(idx==0) data_arg["dim"] = "["+(m[0].length-2)+","+(m.length>>1)+"]";

        isBW[0] = data_arg.col=="\"#000000\"";
        isBW[1] = data_arg.col=="\"#FFFFFF\"";

        if(arg.filter=="exclude_all_criteria"
        && data_arg.cri.length>2
        && !isBW[0] && !isBW[1]) continue;

        idx++;
        var ss = Object.keys(data_arg).map(function(x){return '"'+x+'":'+data_arg[x]}).join(',')
  
        s += p+":{"+ss+"},\r\n"
      }
    }
    s = s.slice(0,-3)+"\r\n"
    s+="}"
    return s;
  }
}
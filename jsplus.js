//JS EMCASCRIPT 5/6 Additions

//GNU GPL v3 Licence

//Created by Aron Tatai, 2017
//base for all RONTAP - NXTJS applications.

//-----------------NXT-JS-MAIN-CONFIG------------------------------

'use strict';					//we use strict so everything is clear and no unexpected errors
const nxtjs_proto_BuildNumber = 1530;  //build number for modules
// use nxt.build instead.

//-----------------------------------------------------------------
//-----------------BASE-PROTOTYPE-EXTENSIONS-----------------------
//-----------------------------------------------------------------

//DOM interaction like JQuery
var $    = (call)    =>  document.querySelector(call);
var $$   = (call)    =>  document.querySelectorAll(call);

//for some reason, NodeList didnt have an indexOf in its prototype.
NodeList.prototype.indexOf = function(element) {
    return [...this].indexOf(element);
}

//toggle DOM interaction within nxt.
//Used by high performance applications
var $DOMInteraction = function (call) {
	if (call) {
		$    = (call)    =>  document.querySelector(call)
		$$   = (call)    =>  document.querySelectorAll(call)
    nxt.domInteraction = true;
	}
	else {
	    $ = function(){ throw 'DOM Interaction is turned off'; }
	   $$ = $ ;
     nxt.domInteraction = false;
	}
}

//-----------------ARRAY-PROTOTYPE-EXENSIONS-------------------------

Array.prototype.max = function()  {    return Math.max(...this);    }
Array.prototype.min = function()  {    return Math.min(...this);    }
Array.prototype.last = function() {    return this[this.length-1];  }

Array.prototype.shuffle = function() { //shuffle the array compleately
	for (let i = this.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [this[i], this[j]] = [this[j], this[i]];
    }
	return this;
}
Array.prototype.isSame = function() {
  //this is not perfect. when all elements are false or 0, this will fail. please do not use
  return !!this.reduce(function(a, b){ return (a === b) ? a : NaN; });
}


//JS is loosely typed, but this will not stop us from checking types...
  Array.prototype.type = "Array";
 String.prototype.type = "String";
Boolean.prototype.type = "Boolean";
 Number.prototype.type = "Number";
 Object.prototype.type = "Object";



//-----------------------------------------------------------------
//-----------------MATHEMATIC-OPERATIONS---------------------------
//-----------------------------------------------------------------

Math.spread =  function(/*array*/ call)
{
   let avg = Math.avg(call);
   let temp = [];
   for (i=0;i<call.length;i++) {
       temp[i]=Math.pow(call[i]-avg,2);
   }
   return /*number*/ Math.sqrt(Math.sum(temp)/(temp.length));
}

Math.sum = function(/*array*/ call ) {
    return call.reduce((acc,curr) => acc+curr , 0);
}
Math.product = function(/*array*/ call ) {
    return call.reduce((acc,curr) => acc*curr , 1);
}
Math.avg = function(/*array*/ call ) {
    let a=0;
    for (let i=0; i<call.length;i++) {
        a+=call[i];
    }
    return /*number*/ Math.round(a/call.length);
}
Math.prime = /*returns array*/ function(/*number*/ call) {
  let divide=[];
  for (let q = 2; q < (call / 2); q++) {
      if (call % q == 0) divide.push(q);
  }
  return divide; /*array of dividers, all of them*/
}

Math.isPrime = /*returns boolean*/ function(/*number*/ call) {
  if (Math.prime(call).length==0) return true;
  else return false;

}
Math.randInt = function(/*number*/ upTo) {
  return Math.floor(Math.random()*upTo);
}

Math.factorial = function(number /*int*/, serialise) { /*factorisation*/
  if (typeof serialise === 'undefined')     return Math.factorial(number,number);
  else if (serialise>1)                     return Math.factorial(number*(--serialise),serialise);
  else if (number!=0)                       return number
  else                                      return 1
}

Math.choose = function( n , k ) { /* permutation, n under k*/
  if (k>n) throw 'NXT.JS RangeError: in (n choose k) , n must be >= than k';  //fancy error handling
  return ( Math.factorial(n) / ( Math.factorial(k) * Math.factorial(n-k) ) )
}

Number.prototype.pad = function() { /*padding number for dates and stuff*/
  if (this<10) return String("0"+this);
  else return String(this);
}

//-----------------------------------------------------------------
//-----------------COLOR-GENERATION--------------------------------
//-----------------------------------------------------------------


class Color {                   //simple generation of colors. Finally
  constructor(r,g,b) {          // can create random numbers
     if (r!=undefined) this.r=Number(r); else this.r = Math.floor(Math.random()*255);
     if (g!=undefined) this.g=Number(g); else this.g = Math.floor(Math.random()*255);
     if (b!=undefined) this.b=Number(b); else this.b = Math.floor(Math.random()*255);

     this.rgb="rgb(" + this.r + ',' + this.g + ',' + this.b + ')';
     this.hex='#'+this.r.toString(16)+this.g.toString(16)+this.b.toString(16)
     //whether to add BLACK = true or WHITE = false  text color
     if ((this.r+this.g+this.b)>360) this.shade=false;
     else this.shade=true;
  }

}


//-----------------------------------------------------------------
//-----------------JS-GET/from-PHP---------------------------------
//---------------------original-version-co-written-with-deesnow97--

function $_GET(args) {
    args = args || 'null' ; //args is only used for asking specific argument
    var hash = location.hash.slice(1,Infinity);

    if (args!='null') {
        var startLoc =hash.indexOf(args + '=');
        var endLoc = hash.slice(startLoc,Infinity).indexOf('&');
            if (endLoc==-1) endLoc = Infinity;
        return hash.slice(startLoc + args.length + 1,endLoc);

    }
    //return other functions of JSGET
    else {
        return {
            'argumentList' : function() {   //list all of the arguments
                let arr = [ hash.slice( 0 , hash.indexOf('=') ) ];
                for (i=0; i< $_GET().length() -2 ; i++) {
                    var tempCont = /&([^=]+)=/g.exec(hash);
                    //RegExp: search whole where &×××= is the syntax, with any × inbetween
                    arr.push(tempCont[1]);
                    hash = hash.replace(tempCont[0],'');
                    //remove text from hash and put in arr.
                }
                return arr;
            },
            'length' : function () { return location.hash.split("=").length }  //returns the length of arguments. to be used with arguumentList to loop
        }
    }

}
function $_SET( locationCall , from , to ) {
  args = args || 'null';
  from = from.concat( nxt.jsgetFrom );
  to = from.concat( nxt.jsgetTo );

  if (args!=null) {
    let parsedLocation="#";
    $$('#NineDotMenu')[0].classList.add("on");
    $$('body')[0].classList.add("NineDotMenuTransition");
    for (i=0;i<from.length;i++) {
      parsedLocation += from[i] + "=" +to[i] + "&";
    }
    setTimeout(function(){
      location.href = locationCall + parsedLocation;
    },200);
  }
  else {
    return {
      'add' : function(from,to) {
          nxt.jsgetFrom = nxt.jsgetFrom.concat(from);
          nxt.jsgetTo = nxt.jsgetTo.concat(to);
      }
    }
  }
}

//-----------------------------------------------------------------
//-----------------STRING-STATISTICS-------------------------------
//-----------------------------------------------------------------

String.prototype.stat = function(call) {
   switch (call) {
      case  'LengthNoSpace' :	//how long is this without spaces
         return this.length-this.split(" ").length;

      case  'wc' :	//word count
         return this.split(/\s+/).length;

      case 'letters' : //sort the letters
       a=this.toLowerCase();
       letterStore=[];//where we store the actual letters
       letterCount=[];//where we store those
       for (i=0;i<a.length;i++) {
           index=letterStore.indexOf(a[i]);//to save power, we calculate this here
           if (index<0) { //if not
               letterStore[letterStore.length]=a[i];
               letterCount[letterCount.length]=1;
           }
           else {
               if (letterCount[index]===undefined)     letterCount[index]=0;
               else                                    letterCount[index]++;
           }
       }
       return [ letterCount , letterStore ];

      case 'letterMax' :    //     get the most  freq. letter from the index of the most used letter
       text=this.stat('letters');
       return text[1][ text[0].indexOf( text[0].max() ) ]


      case 'letterMin'  :   //     get the least freq. letter from the index of the most used letter
       text=this.stat('letters');
       return text[1][ text[0].indexOf( text[0].min() ) ]

      case 'letterSort' :
       text=this.stat('letters');
       output=[[],[]];
       for (let xi=0;xi<text[0].length;xi++)
           {
                output[0][output[0].length] = text[0][ text[0].indexOf( text[0].max() ) ]
                output[1][output[1].length] = text[1][ text[0].indexOf( text[0].max() ) ]
                text[0][ text[0].indexOf( text[0].max() ) ] = 0 ;
           }
        return output;

   }
}


//-----------------------------------------------------------------
//-----------------NXT-JS-MAIN-DEFAULT-FNS-------------------------
//-----------------------------------------------------------------

if (localStorage.nxtDataStore==undefined) {
    let temp = {
      nightMode : false,
      desktopMode : false,
      mobileEnabled : true
    }
    localStorage.nxtDataStore = JSON.stringify(temp);
}
var nxt = {
  jsgetFrom : [],
  jsGetTo : [],
  build : nxtjs_proto_BuildNumber,
  modules : ["core"],
  //loading JS packages
  require : function(url) {
    console.info("[NXTJS][PACKAGES] loading module "+url);
    if ( $$('script[src="'+url+'"]').length==0 ) {  //do not import twice if already defined
      let script = document.createElement('script');
      script.src = url;
      $('head').appendChild(script);    //appending new script
      nxt.modules.push(url.slice(0,url.length-3));
      return true;
    }
    else return false;
  },
  requireCSS : function(url) {
    console.info("[NXTJS][PACKAGES] loading CSS "+url);
    if ( $$('style[href="'+url+'"]').length==0 ) {  //do not import twice if already defined
      let style = document.createElement('style');
      style.href = url;
      style.rel="stylesheet";
      $('head').appendChild(style);    //appending new script
      return true;
    }
    else return false;
  },
  notify : function() { nxt.require("design-notifications.js");  nxt.requireCSS("elements-design.css"); setTimeout( ()=> nxt.notify(arguments[0]), 10) ;},


  openMenu : function(call) {
    $$('#NineDotMenu')[0].classList.add("on");
    $$('body')[0].classList.add("NineDotMenuTransition");
      setTimeout(function() {
        location.href=call+"rtsmenu.html"
      },550)
  },
   closeSidebar : function(e) {
      if (document.body.offsetWidth<640) {
          $('body').classList.add('sidebarMinimised');
      }
   },

   internalNXTStorage : JSON.parse(localStorage.nxtDataStore),
   //this is strictly READ ONLY. use getStore and setStore.

   getStore : function(elem){
     return nxt.internalNXTStorage[elem];
    },
   setStore : function(elem, to) {
      nxt.internalNXTStorage[elem] = to;
      localStorage.nxtDataStore = JSON.stringify(nxt.internalNXTStorage);
   },
   setNormalisation : function(call) { //extended by sets
     let temp = [];
     for ( i=0 ; i<call.length ; i++ ) {
       if (temp.indexOf(call[i])==-1) temp.push( call[i] );
     }
     return temp;
   }
,
   //critial error settings, when parsing goes Wrong
   die : function(message) {
      var message = message || "";
      document.writeln("<style>body {font-family:monospace;margin:60px;}</style><title>ParseError</title>")
      document.writeln("<br><h1>NXT JS Runtime Error</h1>");
      document.writeln("The page cannot be parsed. Please reload or go back to the previous site.<br>");
      document.writeln(message+"<hr><br>");
      let a =  new Date().getTime();
      document.writeln("nxt.js build version: " + nxt.build + "<br>Timestamp: " + a);
      throw "NXT.JS Fatal Parse Error.";
   },
   domInteraction : true,

   //allowing <var is="" setups
   timeCop : function() {
     if ( nxt.domInteraction )
       for (let i=0;i<$$("var").length;i++) {
         if ( (window[$$("var")[i].getAttribute("is")] != undefined) )
           $$("var")[i].innerHTML = window[$$("var")[i].getAttribute("is")];
        }
     setTimeout( () => nxt.timeCop() ,100);
    }


}


//timecop for varables
nxt.timeCop();

//-----------------------------------------------------------------
//-----------------KEYBOARD-CONTROL--------------------------------
//------------------------------------postponed--------------------

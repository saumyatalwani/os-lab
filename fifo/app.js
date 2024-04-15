function fifo(pages, queueSize) {
  //console.log(pages);
  var queue = [];
  var pageFault = 0;
  var temp="";
  var out = document.getElementById('output');
  pages.forEach((p) => {
    if (queue.length < queueSize) {
      var hit = false;
      for (let ele = 0; ele < queue.length; ele++) {
        if (queue[ele] == p) {
          hit = true;
          //console.log('hit');
          temp="Hit<br/>"
          break; //hitt
        }
      }
      if(hit==false){
        queue.push(p);
        pageFault++;
        //console.log('miss');
        temp="Miss<br/>"
      }
      
    } else {
      var hit = false;
      for (let ele = 0; ele < queue.length; ele++) {
        if (queue[ele] == p) {
          hit = true;
          //console.log('hit');
          temp="Hit<br/>"
          break; //hit
        }
      }
      if (hit == false) {
        pageFault++;
        queue.shift();
        queue.push(p);
        //console.log('miss');
        temp="Miss<br/>"
      }
    }
    //console.log(queue);
    out.innerHTML+=`${JSON.stringify(queue)} ${temp}`;
  });
  var outText = document.createElement('p');
  outText.innerHTML=`Number of page faults = ${pageFault}`
  out.appendChild(outText);
  //console.log(pageFault);
}

document.addEventListener("DOMContentLoaded", function(){
  var calc = document.getElementById('generate');
  
  calc.addEventListener("click",function(){
    var out = document.getElementById('output');
    out.innerHTML="";
    var pageSequence=document.getElementById('pageSeq').value.split(",");
    pageSequence=pageSequence.map(element => {
      return parseInt(element);
    });
    var queueSize=parseInt(document.getElementById('queueSize').value);
    
    fifo(pageSequence,queueSize);
  })
});
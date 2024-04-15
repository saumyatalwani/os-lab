function fifo(pages, queueSize) {
  console.log(pages);
  var queue = [];
  var pageFault = 0;

  pages.forEach((p) => {
    if (queue.length < queueSize) {
      var hit = false;
      for (let ele = 0; ele < queue.length; ele++) {
        if (queue[ele] == p) {
          hit = true;
          break; //hitt
        }
      }
      if(hit==false){
        queue.push(p);
        pageFault++;
      }
      
    } else {
      var hit = false;
      for (let ele = 0; ele < queue.length; ele++) {
        if (queue[ele] == p) {
          hit = true;
          break; //hit
        }
      }
      if (hit == false) {
        pageFault++;
        queue.shift();
        queue.push(p);
      }
    }
  });

  var out = document.getElementById('output');
  var outText = document.createElement('p');
  out.innerHTML='';
  outText.innerHTML=`Number of page faults = ${pageFault}`
  out.appendChild(outText);
  console.log(pageFault);
}

document.addEventListener("DOMContentLoaded", function(){
  var calc = document.getElementById('generate');
  calc.addEventListener("click",function(){
    var pageSequence=document.getElementById('pageSeq').value.split(",");
    pageSequence=pageSequence.map(element => {
      return parseInt(element);
    });
    var queueSize=parseInt(document.getElementById('queueSize').value);
    
    fifo(pageSequence,queueSize);
  })
});
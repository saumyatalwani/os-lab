function clook(inputSequence, head){
    
    var seekSequence=[];
    var seekCount=0;
    var left=[];
    var right=[];

    for (let i = 0; i < inputSequence.length; i++) {
        if(inputSequence[i] >= head) {
            right.push(inputSequence[i]);
        }
        else {
            left.push(inputSequence[i]);
        }
    }

    left.sort((a,b) => { return a-b });
    right.sort((a,b) => { return a-b });

    for(let i = 0; i < right.length; i++) {
        seekSequence.push(right[i]);
        seekCount += Math.abs(head - right[i]);
        head = right[i];
    }

    seekCount += Math.abs(head - left[0]);
    head = left[0];

    for(let i = 0; i < left.length; i++) {
        seekSequence.push(left[i]);
        seekCount += Math.abs(head - left[i]);
        head = left[i];
    }

    return { "seekCount" : seekCount, "seekSequence" : seekSequence }
    
}

document.addEventListener("DOMContentLoaded", function(){
    var calculateBtn=document.getElementById('generate');
    
    calculateBtn.addEventListener("click",function(){
        var inputSequence=document.getElementById('inputSeq').value.split(",");
        inputSequence=inputSequence.map(element => {
            return parseInt(element);
        });
        var headCount=parseInt(document.getElementById('head').value);
        var out=clook(inputSequence,headCount);
        var output=document.getElementById('output');
        var seq = out.seekSequence.map(element => {
            return {"y" : element};
        })
        seq.unshift({ "y" : headCount});
        //console.log(out);
        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            theme: "light2",
            title:{
                text: "C-Look Disk Scheduling"
            },
            data: [{        
                type: "line",
                  indexLabelFontSize: 16,
                dataPoints: seq
            }]
        });
        var text1  = document.createElement('p');
        var text2  = document.createElement('p');
        text1.innerHTML=`Seek Sequence : ${out.seekSequence}`
        text2.innerHTML=`Seek Count : ${out.seekCount}`
        output.appendChild(text1);
        output.appendChild(text2);
        chart.render();
    })
    

})
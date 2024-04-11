document.addEventListener("DOMContentLoaded", function () {
    const generateButton = document.getElementById("generate");
    const calculateButton = document.getElementById("calculate");
    const processTable = document.getElementById("process-table").getElementsByTagName("tbody")[0];
    const outputDiv = document.getElementById("output");

    generateButton.addEventListener("click", function () {
        const numProcesses = parseInt(document.getElementById("processes").value);
        processTable.innerHTML = "";
        for (let i = 1; i <= numProcesses; i++) {
            const row = processTable.insertRow();
            row.innerHTML = `
                <td><input type="text" class="process-id py-2 px-4 rounded-full" value="P${i}" disabled></td>
                <td><input type="number" class="arrival-time py-2 px-4 rounded-full" min="0" step="1" value="0"></td>
                <td><input type="number" class="burst-time py-2 px-4 rounded-full" min="1" step="1" value="1"></td>
            `;
        }
    });

    calculateButton.addEventListener("click", function () {
        const processes = [];
        const completedProcesses=[];
        const rows = processTable.rows;
        for (let i = 0; i < rows.length; i++) {
            const processId = rows[i].cells[0].getElementsByTagName("input")[0].value;
            const arrivalTime = parseInt(rows[i].cells[1].getElementsByTagName("input")[0].value);
            const burstTime = parseInt(rows[i].cells[2].getElementsByTagName("input")[0].value);
            processes.push({ id: processId, arrivalTime: arrivalTime, burstTime: burstTime, waitTime: 0, turnaroundTime : 0});
        }

        processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

        let currentTime = 0;
        let totalWaitingTime = 0;
        let totalTurnaroundTime = 0;
        let outputText = "<h3>Output:</h3>";

        while (processes.length > 0) {
            let nextProcessIndex = 0;
            for (let i = 1; i < processes.length; i++) {
                if (processes[i].arrivalTime <= currentTime && processes[i].burstTime < processes[nextProcessIndex].burstTime) {
                    nextProcessIndex = i;
                }
            }

            const nextProcess = processes[nextProcessIndex];
            processes.splice(nextProcessIndex, 1);

            if(currentTime<=nextProcess.arrivalTime){
                totalWaitingTime += nextProcess.arrivalTime - currentTime;
                currentTime=nextProcess.arrivalTime
            }

            outputText += `Executing ${nextProcess.id} from ${currentTime} to ${currentTime + nextProcess.burstTime}<br>`;
            totalWaitingTime += currentTime - nextProcess.arrivalTime;
            nextProcess.waitTime += currentTime - nextProcess.arrivalTime;
            totalTurnaroundTime += currentTime + nextProcess.burstTime - nextProcess.arrivalTime;
            nextProcess.turnaroundTime += currentTime + nextProcess.burstTime - nextProcess.arrivalTime;
            currentTime += nextProcess.burstTime;
            completedProcesses.push(nextProcess);
        }
       
        const averageWaitingTime = totalWaitingTime / rows.length;
        const averageTurnaroundTime = totalTurnaroundTime / rows.length;

        outputText += `<br>Average Waiting Time: ${averageWaitingTime.toFixed(2)}<br>`;
        outputText += `Average Turnaround Time: ${averageTurnaroundTime.toFixed(2)}<br>`;
        
        processTable.innerHTML = "";
        for (let i = 0; i <completedProcesses.length; i++) {
            const row = processTable.insertRow();
            row.innerHTML = `
                <td><input type="text" class="process-id py-2 px-4 rounded-full" value="${completedProcesses[i].id}" disabled ></td>
                <td><input type="number" class="arrival-time py-2 px-4 rounded-full" min="0" step="1" value="${completedProcesses[i].arrivalTime}" disabled></td>
                <td><input type="number" class="burst-time py-2 px-4 rounded-full" min="1" step="1" value="${completedProcesses[i].burstTime}" disabled></td>
                <td><input type="number" class="wait-time py-2 px-4 rounded-full" min="1" step="1" value="${completedProcesses[i].waitTime}" disabled></td>
                <td><input type="number" class="turaround-time py-2 px-4 rounded-full" min="1" step="1" value="${completedProcesses[i].turnaroundTime}" disabled></td>
            `;
        }

        outputDiv.innerHTML = outputText;
    });
});
// Sidebar active menu
const sidebarItems = document.querySelectorAll(".sidebar-list li");

sidebarItems.forEach(function (item) {
    item.addEventListener("click", function () {
        sidebarItems.forEach(function (el) {
            el.classList.remove('active-menu');
        });
        item.classList.add("active-menu");
    });
});

// Form + History
const form = document.querySelector("form");
let transactionHistory = document.getElementById('transactionHistoryId');

let myFormList = JSON.parse(localStorage.getItem("paymentHistory")) || [];

// Create UI for each transaction
function createAndAppendObject(eachObj) {

    let { description, amount, category } = eachObj;

    let listElement = document.createElement('li');
    listElement.classList.add("history", 'd-flex', 'justify-content-between', 'align-items-center');
    transactionHistory.appendChild(listElement);

    let divEl = document.createElement("div");
    divEl.classList.add("description-type-cont");
    listElement.appendChild(divEl);

    let iconCont = document.createElement('div');

    if (amount > 0 && category === "Salary") {
        iconCont.classList.add("credit-icon-contc");
    } else {
        iconCont.classList.add("debit-icon-contc");
    }

    let icon = document.createElement('i');
    icon.classList.add('fa-solid', 'fa-indian-rupee-sign');

    iconCont.appendChild(icon);
    divEl.appendChild(iconCont);

    let textCont = document.createElement('div');
    textCont.classList.add("d-flex", 'flex-row', 'justify-content-center', "align-items-center");

    let paraEl = document.createElement('p');
    paraEl.textContent = description;
    paraEl.classList.add("description-style");
    textCont.appendChild(paraEl);

    let categoryEl = document.createElement('p');
    categoryEl.textContent = '(' + category + ")";
    categoryEl.classList.add('category-style', 'ml-2');
    textCont.appendChild(categoryEl);

    divEl.appendChild(textCont);

    let amountEl = document.createElement('h3');

    if (category === "Salary") {
        amountEl.textContent = "+₹" + amount;
        amountEl.classList.add("credit");
    } else {
        amountEl.textContent = "-₹" + amount;
        amountEl.classList.add("debit");
    }

    listElement.appendChild(amountEl);
}

// BAR CHART


const myBarGraphEl = document.getElementById('myBarGraph');

const data = {
    labels: ['Income', 'Expenses'],
    datasets: [{
        label: "Amount",
        data: [0, 0],
        backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 99, 132, 0.7)'
        ],
        borderWidth: 1,
        borderRadius: 6,
        barThickness: 60
    }]
};

const config1 = {
    type: 'bar',
    data: data,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
};

const chart = new Chart(myBarGraphEl, config1);

// PIE CHART


const pieChartEl = document.getElementById("pieChart");

const data1 = {
    labels: [],
    datasets: [{
        label: "Expenses",
        data: [],
        backgroundColor: [
            '#ff6384',
            '#36a2eb',
            '#ffce56',
            '#4bc0c0',
            '#9966ff',
            '#ff9f40'
        ],
        borderWidth: 1
    }]
};

const config = {
    type: 'doughnut',
    data: data1,
    options: {
        plugins: {
            legend: {
                position: 'right'
            }
        }
    }
};

const pieChart = new Chart(pieChartEl, config);

// SUMMARY FUNCTION


let income = 0;
let totalExpenses = 0;
let totalBalance = 0;

function updateSummary() {

    income = 0;
    totalExpenses = 0;

    let categoryTotals = {};

    myFormList.forEach((each) => {

        if (each.category === "Salary" && each.amount > 0) {
            income += each.amount;
        } else {
            totalExpenses += Math.abs(each.amount);

            let category = each.category;

            if (categoryTotals[category]) {
                categoryTotals[category] += Math.abs(each.amount);
            } else {
                categoryTotals[category] = Math.abs(each.amount);
            }
        }
    });

    totalBalance = income - totalExpenses;

    document.getElementById('monthlyIncome').textContent = "₹" + income;
    document.getElementById('monthlyIncome').style.color = "green";

    document.getElementById('monthlyExpenses').textContent = "₹" + totalExpenses;
    document.getElementById("monthlyExpenses").style.color = 'red';

    document.getElementById("totalBalance").textContent = "₹" + totalBalance;

    let savingsRate = 0;
    if (income > 0) {
        savingsRate = ((income - totalExpenses) / income) * 100;
    }

    document.getElementById("savingsRate").textContent =
        savingsRate.toFixed(2) + "%";

    chart.data.datasets[0].data = [income, totalExpenses];
    chart.update();

    pieChart.data.labels = Object.keys(categoryTotals);
    pieChart.data.datasets[0].data = Object.values(categoryTotals);
    pieChart.update();
}

// FORM SUBMIT


form.addEventListener('submit', function (event) {
    event.preventDefault();

    const description = document.getElementById('descriptionId').value;

    if (description === '') {
        alert("Enter Description of Transaction!");
        return;
    }

    if (document.getElementById('amountId').value === '') {
        alert("Enter Amount of Transaction!");
        return;
    }

    const amount = parseFloat(document.getElementById('amountId').value);
    const category = document.getElementById('addTransaction').value;

    let myObject = {
        id: myFormList.length,
        description,
        amount,
        category
    };

    document.getElementById('descriptionId').value = "";
    document.getElementById('amountId').value = "";

    myFormList.push(myObject);

    createAndAppendObject(myObject);

    localStorage.setItem("paymentHistory", JSON.stringify(myFormList));

    updateSummary();
});


// CLEAR HISTORY


function clearHistory() {
    if (confirm("Are you sure you want to clear all transactions?")) {
        localStorage.removeItem("paymentHistory");
        myFormList = [];
        transactionHistory.innerHTML = "";
        updateSummary();
    }
}



for (let i of myFormList) {
    createAndAppendObject(i);
}

updateSummary();
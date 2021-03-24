const Modal = { // ATIVAÇÃO DA NOVA TRANSAÇÃO
    open() {
        // Abrir Modal
        // Adicionar a class active ao Modal
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')
    },
    close() {
        //Fechar Modal
        //Remover a class active do Modal
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')
    }
}



const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []

    },

    set(transactions){
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}


const Transaction = { // TRANSAÇÕES
    all: Storage.get(),
    
    add(transaction){
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
        
    },

    incomes() {
        let income = 0;
        //PEGAR TODAS AS TRANSAÇÕES
        //PARA CADA TRANSAÇÃO (FOR EACH)
        Transaction.all.forEach(transaction => {
            if(transaction.amount > 0 ) 
            //SE ELA FOR MAIOR QUE ZERO
                income += transaction.amount;
                //SOMAR UMA VARIAVEL E RETORNAR A VARIAVEL

            })
            return income;
    },

    expenses() {
        let expense = 0;
        //PEGAR TODAS AS TRANSAÇÕES
        //PARA CADA TRANSAÇÃO (FOR EACH)
        Transaction.all.forEach(transaction => {
            if(transaction.amount < 0 ) 
            // SE ELA FOR MENOR QUE ZERO
                expense += transaction.amount;
                //SOMAR UMA VARIAVEL E RETORNAR A VARIAVEL
            })
            return expense;
    },

    total() {
       // TODAS AS ENTRADAS (INCOMES) + AS SAÍDAS (EXPENSES) QUE FIZEMOS LOGO ACIMA.
        return Transaction.incomes() + Transaction.expenses();
    }

}

const DOM = { // A PARTE ESTÉTICA DO JS
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')  
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        console.log(DOM.transactionsContainer)
        DOM.transactionsContainer.appendChild(tr)
    
    },
    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"
        const amount = Utils.formatCurrency(transaction.amount)
        const html = `

            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}0</td>
            <td class="date">${transaction.date}</td>
            <td >
                <img onclick="Transaction.remove(${index})" src="assets/assets/minus.svg" alt="Remover transação">
            </td>

        `
        return html
    },

    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
        
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = { // FORMATAÇÃO DA MOEDA 
    formatAmount(value){
        value = Number(value) * 100

        return value

    },

    formatDate(date){
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`

    },

    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")
        
        value= Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }

}

const Form = {

    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields(){ // VALIDAR SE OS CAMPOS DO FORMULARIO FORAM PREENCHIDOS
        const {description, amount, date} = Form.getValues()
        if(
            description.trim() === "" || 
            amount.trim() === "" ||
            date.trim() ==="") {
                throw new Error("Por favor, preencha todos os campos")
            }
    },
    
    formatValues(){
        let {description, amount, date} = Form.getValues()
        
        amount= Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }

    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

 

    submit(event) {
        event.preventDefault()

        try { // TENTE
            Form.validateFields() // VERIFICAR SE OS CAMPOS SAO VALIDOS
            const transaction = Form.formatValues() // PEGAR UMA TRANSAÇÃO FORMATADA

            Transaction.add(transaction) // ADICIONAR UMA TRANSAÇÃO

            Form.clearFields() // LIMPAR OS FIELDS OU CAMPOS

            Modal.close() // FECHAR O MODAL

       } catch (error) {
            alert(error.message)
        }
        
    }
}

const App = {
    init() {
        Transaction.all.forEach(DOM.addTransaction)
        
        DOM.updateBalance()
        
        Storage.set(Transaction.all)
       
    },

    reload() {
        DOM.clearTransactions()
        App.init()
    },
}

App.init()








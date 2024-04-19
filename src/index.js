import "./styles/style.css"
import { createDomElement } from "./utils/createDomElement"

let transactionIdToEdit

async function getEveryTransactions() {
  const transactions = await fetch("http://localhost:3000/transactions").then(
    (res) => res.json()
  )

  document.querySelector('#table').innerText = ''

  const totalAmount = transactions.reduce((acummulator, transaction) => {
    renderTransaction(transaction)
    
    if(transaction.type == "entry"){
      return acummulator + transaction.amount
    } else if (transaction.type == "out"){
      return acummulator - transaction.amount
    }
  }, 0)
  document.querySelector('#currentAmount').innerText = totalAmount.toFixed(2).toString().replace('.',',')
}

async function getTransaction(transactionID) {
  return await fetch(`http://localhost:3000/transactions/${transactionID}`).then(res => res.json())
}

async function deleteTransaction(ev) {
  const id = ev.currentTarget.dataset.id

  await fetch(`http://localhost:3000/transactions/${id}`, { method: "DELETE" })

  await getEveryTransactions()
}

async function postTransaction(transaction){
  await fetch("http://localhost:3000/transactions", {
    method: 'POST',
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(transaction)
  })

  getEveryTransactions()
}

async function putTransaction(transaction, id){
  await fetch(`http://localhost:3000/transactions/${id}`, {
    body: JSON.stringify(transaction),
    method: 'PUT',
    headers: {
        "Content-Type": "application/json",
    }
  })

  getEveryTransactions()
}

async function editTransaction(ev){
  transactionIdToEdit = ev.currentTarget.dataset.id

  const transaction = await getTransaction(transactionIdToEdit)
  document.querySelector('#name').value = transaction.name
  document.querySelector('#amount').value = transaction.amount
  document.querySelector('#type').value = transaction.type
}

function renderTransaction(transaction) {
  // {
  //     "name": "Payment",
  //     "amount": "2000.00",
  //     "type": "entry",
  //     "id": "4"
  // }

  const name = createDomElement("p", "transaction-name")
  name.innerText = transaction.name

  const amountText = createDomElement(
    "p",
    "transaction-amount",
    transaction.type
  )
  amountText.innerText = "R$ "

  const amount = createDomElement("span")
  amount.innerText = transaction.amount.toFixed(2).toString().replace(".", ",")
  amountText.append(amount)

  const btnEdit = createDomElement("button", "edit")
  btnEdit.innerText = "Editar"
  btnEdit.dataset.id = transaction.id
  btnEdit.addEventListener("click", editTransaction)

  const btnDelete = createDomElement("button", "delete")
  btnDelete.innerText = "Excluir"
  btnDelete.dataset.id = transaction.id
  btnDelete.addEventListener("click", deleteTransaction)

  const li = createDomElement("li")
  li.append(name, amountText, btnEdit, btnDelete)

  document.querySelector("#table").append(li)
}



document.addEventListener("DOMContentLoaded", getEveryTransactions)
const form = document.querySelector('form')
form.addEventListener('submit', async (ev) => {
  ev.preventDefault()

  const transaction = {
    name: document.querySelector('#name').value ,
    amount: Number(document.querySelector('#amount').value),
    type: document.querySelector('#type').value
  }

  if(!transactionIdToEdit){
    await postTransaction(transaction)
  } else {
    await putTransaction(transaction, transactionIdToEdit)
  }

  transactionIdToEdit = ''
  form.reset()
})

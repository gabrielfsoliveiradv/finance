import "./styles/style.css"
import { createDomElement } from "./utils/createDomElement"

async function getTransactions() {
  const transactions = await fetch("http://localhost:3000/transactions").then(
    (res) => res.json()
  )
  console.log(transactions)


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

async function deleteTransaction(ev) {
  const id = ev.currentTarget.dataset.id

  await fetch(`http://localhost:3000/transactions/${id}`, { method: "DELETE" })

  await getTransactions()
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

  const btnDelete = createDomElement("button", "delete")
  btnDelete.innerText = "Excluir"
  btnDelete.dataset.id = transaction.id
  btnDelete.addEventListener("click", deleteTransaction)

  const li = createDomElement("li")
  li.append(name, amountText, btnEdit, btnDelete)

  document.querySelector("#table").append(li)
}

document.addEventListener("DOMContentLoaded", getTransactions)

import "./styles/style.css"
import { createDomElement } from "./utils/createDomElement"

async function getTransactions() {
  const transactions = await fetch("http://localhost:3000/transactions").then(
    (res) => res.json()
  )

  document.querySelector('#table').innerText = ''
  transactions.forEach(renderTransaction)
}

async function deleteTransaction(ev){
  const id = ev.currentTarget.dataset.id

  const response = await fetch(`http://localhost:3000/transactions/${id}`,
    {
      method: 'DELETE',
    }
  )

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
  amount.innerText = transaction.amount.replace(".", ",")
  amountText.append(amount)

  const btnEdit = createDomElement("button", "edit")
  btnEdit.innerText = "Editar"
  btnEdit.dataset.id = transaction.id

  const btnDelete = createDomElement("button", "delete")
  btnDelete.innerText = "Excluir"
  btnDelete.dataset.id = transaction.id
  btnDelete.addEventListener('click', deleteTransaction)

  const li = createDomElement("li")
  li.append(name, amountText, btnEdit, btnDelete)

  document.querySelector("#table").append(li)
}


document.addEventListener("DOMContentLoaded", getTransactions)

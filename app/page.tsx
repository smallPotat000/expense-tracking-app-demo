import { connectToDB } from '@/lib/mongodb';
import Expense from '@/models/Expense';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';

export default async function Home() {
  await connectToDB();
  const expenses = await Expense.find().lean();

  return (
    <main className="container-centered">
      <h1 className="text-2xl font-bold">Budgeting Expense Tracker</h1>
      <br></br>
      <hr className="solid"></hr>
      <br></br>
      <ExpenseForm/>
      <br></br>
      <hr className="solid"></hr>
      <br></br>
      <ExpenseList initialExpenses={JSON.parse(JSON.stringify(expenses))} />
    </main>
  );
}

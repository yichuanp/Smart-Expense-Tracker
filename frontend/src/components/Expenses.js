


//  const [showForm, setShowForm] = useState(false);
//  const [formData, setFormData] = useState({
//    title: '',
//    amount: '',
//    category: '',
//    date: '',
//    recurring: false
//  });

//  const handleAddExpense = async (e) => {
//    e.preventDefault();
//    const token = localStorage.getItem('token');
//    try {
//      const response = await fetch(`http://localhost:8080/api/exp/addExpense?token=${token}`
//      ,{
//        method: 'POST',
//        headers: {
//          'Content-Type': 'application/json',
//        },
//        body: JSON.stringify({ ...formData, token })
//      });
//
//      if (response.ok) {
//        setFormData({ title: '', amount: '', category: '', date: '', recurring: false });
//        setShowForm(false);
//        const newExpense = await response.json();
//        setExpenses(prev => [...prev, newExpense]);
//      } else {
//        console.error("Failed to add expense");
//      }
//    } catch (error) {
//      console.error("Error adding expense:", error);
//    }
//  };

//  const handleInputChange = (e) => {
//    const { name, value, type, checked } = e.target;
//    setFormData(prev => ({
//      ...prev,
//      [name]: type === 'checkbox' ? checked : value
//    }));
//  };

//<form className="new-expense" onSubmit={handleAddExpense}>
//              <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Title" required />
//              <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} placeholder="Amount" step="0.01" required />
//              <input type="text" name="category" value={formData.category} onChange={handleInputChange} placeholder="Category" required />
//              <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
//              <label>
//                <input type="checkbox" name="recurring" checked={formData.recurring} onChange={handleInputChange} />
//                Recurring
//              </label>
//              <button type="submit">Submit</button>
//              <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
//            </form>
//          )}
//        </div>
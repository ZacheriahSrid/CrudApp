import './App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [filterUsers, setFilterUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({ name: "", age: "", city: "" });

  const getAllUsers = async () => {
    await axios.get("http://localhost:8001/users").then((res) => {
      setUsers(res.data);
      setFilterUsers(res.data);
    });
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleSearchChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(searchText) ||
      user.city.toLowerCase().includes(searchText)
    );
    setFilterUsers(filteredUsers);
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
    if (isConfirmed) {
      await axios.delete(`http://localhost:8001/users/${id}`).then((res) => {
        setUsers(res.data);
        setFilterUsers(res.data);
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    getAllUsers();
  };

  const handleData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userData.id) {
      await axios.patch(`http://localhost:8001/users/${userData.id}`, userData).then(() => {
        getAllUsers();
      });
    } else {
      await axios.post("http://localhost:8001/users", userData).then(() => {
        getAllUsers();
      });
    }
    closeModal();
    setUserData({ name: "", age: "", city: "" });
  };

  const handleAddRecord = () => {
    setUserData({ name: "", age: "", city: "" });
    setIsModalOpen(true);
  };

  const handleUpdateRecord = (user) => {
    setUserData(user);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="container">
        <h3>CRUD Application with ReactJS Frontend and NodeJS Backend</h3>
        <div className="input-search">
          <input type="search" placeholder='Search Text Here' onChange={handleSearchChange} />
          <button className='btn green' onClick={handleAddRecord}>Add Record</button>
        </div>
        <table className='table'>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filterUsers && filterUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.age}</td>
                <td>{user.city}</td>
                <td>
                  <button className='btn green' onClick={() => handleUpdateRecord(user)}>Edit</button>
                </td>
                <td>
                  <button className='btn red' onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className='close' onClick={() => setIsModalOpen(false)}>&times;</span>
              <h2>{userData.id ? "Update Record" : "Add Record"}</h2>
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" name='name' id='name' value={userData.name} onChange={handleData} />
                <label htmlFor="age">Age</label>
                <input type="number" name='age' id='age' value={userData.age} onChange={handleData} />
                <label htmlFor="city">City</label>
                <input type="text" name='city' id='city' value={userData.city} onChange={handleData} />
              </div>
              <button className='btn green' onClick={handleSubmit}> {userData.id ? "Update Record" : "Add Record"} </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;

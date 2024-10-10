import { useState, useEffect } from 'react';
import './Todo.css';


function Todo() {

    const [newTitle, setNewTitle] = useState('');
    const [allTodos, setTodos] = useState([]);
    const [currentEdit, setCurrentEdit] = useState(null);
    const [currentEditedItem, setCurrentEditedItem] = useState(null);
    const [selectedTodos, setSelectedTodos] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const Addtodo = () => {
        if (!newTitle) return alert("Task cannot be empty");
        const newTodo = { title: newTitle, completed: false };
        const updatedTodos = [...allTodos, newTodo];
        setTodos(updatedTodos);
        localStorage.setItem('allTodos', JSON.stringify(updatedTodos));
        setNewTitle('');
        alert("Task added successfully");
    };

    const toggleComplete = (index) => {
        const updatedTodos = [...allTodos];
        updatedTodos[index].completed = !updatedTodos[index].completed;
        setTodos(updatedTodos);
        localStorage.setItem('allTodos', JSON.stringify(updatedTodos));
    };

    const handleDeleteTodo = (index) => {
        const updatedTodos = allTodos.filter((_, i) => i !== index);
        localStorage.setItem('allTodos', JSON.stringify(updatedTodos));
        setTodos(updatedTodos);
        alert("delete sccessful")
    };

    const handleEdit = (index, item) => {
        setCurrentEdit(index);
        setCurrentEditedItem(item);
    };

    useEffect(() => {
        const savedTodos = JSON.parse(localStorage.getItem('allTodos')) || [];
        setTodos(savedTodos);
    }, []);

    const handleUpdateTitle = (value) => {
        setCurrentEditedItem((prev) => ({ ...prev, title: value }));
    };

    const handleUpdateToDo = () => {
        if (!currentEditedItem.title) return alert("Title cannot be empty!");
        const updatedTodos = [...allTodos];
        updatedTodos[currentEdit] = currentEditedItem;
        setTodos(updatedTodos);
        setCurrentEdit(null);
        setCurrentEditedItem(null);
        localStorage.setItem('allTodos', JSON.stringify(updatedTodos));
        alert("update successful");
    };

    const toggleSelectTodo = (index) => {
        setSelectedTodos((prev) => {
            if (prev.includes(index)) {
                return prev.filter(i => i !== index);
            } else {
                return [...prev, index];
            }
        });
    };

    const deleteSelectedTodos = () => {
        const updatedTodos = allTodos.filter((_, index) => !selectedTodos.includes(index));
        localStorage.setItem('allTodos', JSON.stringify(updatedTodos));
        setTodos(updatedTodos);
        setSelectedTodos([]);
        setShowDropdown(false); // Hide dropdown after action
        alert("Selected tasks deleted successfully");
    };

    const completeSelectedTodos = () => {
        const updatedTodos = [...allTodos];
        selectedTodos.forEach(index => {
            updatedTodos[index].completed = true;
        });
        localStorage.setItem('allTodos', JSON.stringify(updatedTodos));
        setTodos(updatedTodos);
        setSelectedTodos([]);
        setShowDropdown(false); // Hide dropdown after action
        alert("Selected tasks completed successfully");
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center">To-Do List</h1>
            <div className="input-group mb-3">

                <input
                    type="text"
                    className="form-control"
                    placeholder="Add a new task"
                    id="taskInput"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                />
                <button className="btn btn-primary" type="button" id="addButton" onClick={Addtodo}>Add</button>&nbsp;&nbsp;&nbsp;
                {selectedTodos.length > 1 && (
                    <div className="dropdown">
                        <div className="dropdown-toggle" onClick={() => setShowDropdown(!showDropdown)}>
                            Actions
                        </div>
                        {showDropdown && (
                            <div className="dropdown-menu">
                                <div className="dropdown-item btn-danger" onClick={deleteSelectedTodos}>Delete</div>
                                <div className="dropdown-item btn-light" onClick={completeSelectedTodos}>Complete</div>
                            </div>
                        )}
                    </div>
                )}

            </div>


            <ul className="list-group" id="taskList">
                {
                    allTodos.map((item, index) => {
                        if (currentEdit === index) {
                            return (
                                <div className="input-group mb-3" key={index}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Edit task"
                                        id="editInput"
                                        value={currentEditedItem?.title || ''}
                                        onChange={(e) => handleUpdateTitle(e.target.value)}
                                    />
                                    <div className="float-end">
                                        <button className="btn btn-danger" type="button" onClick={handleUpdateToDo}>Update</button>
                                    </div>
                                </div>
                            );
                        } else {
                            return (
                                <li className="list-group-item" key={index}>
                                    <input
                                        type="checkbox"
                                        checked={selectedTodos.includes(index)}
                                        onChange={() => toggleSelectTodo(index)}
                                    />
                                    <span
                                        className="todo-text"
                                        style={{ textDecoration: item.completed ? 'line-through' : 'none', flex: 1, textAlign: 'left' }}>
                                        {item.title}
                                    </span>
                                    <div className="float-end">
                                        {item.completed ? (
                                            <button className="btn btn-danger" onClick={() => handleDeleteTodo(index)}>Delete</button>
                                        ) : (
                                            <>
                                                <button className="btn btn-success" onClick={() => toggleComplete(index)}>
                                                Complete
                                                </button>
                                                <button className="btn btn-warning" onClick={() => handleEdit(index, item)}>Edit</button>
                                                <button className="btn btn-danger" onClick={() => handleDeleteTodo(index)}>Delete</button>
                                            </>
                                        )}
                                    </div>
                                </li>
                            );
                        }
                    })
                }
            </ul>
        </div>
    );
}
export default Todo;
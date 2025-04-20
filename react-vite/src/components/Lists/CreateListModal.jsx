import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createList } from '../../redux/listsReducer';
import './CreateListModal.css';

export default function CreateListModal({ boardId, onClose }) {
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [errors, setErrors] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors(null);

        const listData = {
            name: name.trim()
        };

        try {
            const result = await dispatch(createList(boardId, listData));
            if (result?.error) {
                setErrors(result.error);
            } else {
                setName('');
                if (onClose) onClose();
            }
        } catch (err) {
            setErrors(err.message);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Create List</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <form onSubmit={handleSubmit} className="create-list-form">
                    <div className="form-group">
                        <label htmlFor="list-name">List Name</label>
                        <input
                            id="list-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter list name"
                            required
                        />
                    </div>
                    {errors && <div className="error-message">{errors}</div>}
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="cancel-button">
                            Cancel
                        </button>
                        <button type="submit" className="create-button">
                            Create List
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 
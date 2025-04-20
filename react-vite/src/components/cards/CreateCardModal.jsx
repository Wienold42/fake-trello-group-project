import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createCard } from '../../redux/cardsReducer';
import './CreateCardModal.css';

export default function CreateCardModal({ listId, onClose }) {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        due_date: ''
    });
    const [errors, setErrors] = useState(null);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors(null);

        const newCard = {
            list_id: listId,
            name: formData.name.trim(),
            description: formData.description.trim(),
            due_date: formData.due_date
        };

        try {
            const result = await dispatch(createCard(newCard));
            if (result?.error) {
                setErrors(result.error);
            } else {
                setFormData({ name: '', description: '', due_date: '' });
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
                    <h2>Create Card</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <form onSubmit={handleSubmit} className="create-card-form">
                    <div className="form-group">
                        <label htmlFor="card-name">Card Title</label>
                        <input
                            id="card-name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter card title"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="card-description">Description</label>
                        <textarea
                            id="card-description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter card description"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="card-due-date">Due Date</label>
                        <input
                            id="card-due-date"
                            type="date"
                            name="due_date"
                            value={formData.due_date}
                            onChange={handleChange}
                        />
                    </div>
                    {errors && <div className="error-message">{errors}</div>}
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="cancel-button">
                            Cancel
                        </button>
                        <button type="submit" className="create-button">
                            Create Card
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 
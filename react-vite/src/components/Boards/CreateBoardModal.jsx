import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBoard } from '../../redux/boardsReducer';
import { useNavigate, Navigate } from 'react-router-dom';
import './CreateBoardModal.css';

export default function CreateBoardModal({ onClose }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sessionUser = useSelector(state => state.session.user);
    const [name, setName] = useState('');
    const [errors, setErrors] = useState(null);

    if (!sessionUser) {
        return <Navigate to="/login" replace={true} />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors(null);

        const boardData = {
            name: name.trim()
        };

        try {
            const result = await dispatch(createBoard(boardData));
            const { id, error } = result || {};
            
            if (error) {
                setErrors(error);
            } else if (id) {
                setName('');
                if (onClose) onClose();
                navigate(`/boards/${id}`);
            } else {
                setErrors('Failed to create board: Invalid response');
            }
        } catch (err) {
            setErrors(err.message);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Create Board</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <form onSubmit={handleSubmit} className="create-board-form">
                    <div className="form-group">
                        <label htmlFor="board-name">Board Name</label>
                        <input
                            id="board-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter board name"
                            required
                        />
                    </div>
                    {errors && <div className="error-message">{errors}</div>}
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="cancel-button">
                            Cancel
                        </button>
                        <button type="submit" className="create-button">
                            Create Board
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 
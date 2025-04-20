import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateBoard } from '../../redux/boardsReducer';
import './EditBoardModal.css';

export default function EditBoardModal({ board, onClose }) {
    const dispatch = useDispatch();
    const [name, setName] = useState(board.name);
    const [errors, setErrors] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors(null);

        const boardData = {
            name: name.trim()
        };

        try {
            await dispatch(updateBoard(board.id, boardData));
            if (onClose) onClose();
        } catch (err) {
            setErrors(err.message);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Edit Board</h2>
                {errors && <div className="error-message">{errors}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Board Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="submit" className="submit-button">Save Changes</button>
                        <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
} 
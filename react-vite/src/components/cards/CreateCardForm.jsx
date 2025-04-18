import { useState } from "react";
import { useDispatch } from "react-redux";
import { createCard } from "../../redux/cardsReducer";

export default function CreateCardForm({ listId, onClose }) {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        due_date: "",
    });

    const [errors, setErrors] = useState(null);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors(null);

        const newCard = {
            list_id: listId,
            name: formData.name,
            description: formData.description,
            due_date: formData.due_date,
        };

        const action = await dispatch(createCard(newCard));

        if (action?.error) {
            setErrors(action.error);
        } else {
            setFormData({ name: "", description: "", due_date: "" });
            if (onClose) onClose();
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Create New Card</h3>

            {errors && <div>{errors}</div>}

            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Card title"
                required
            />

            <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description "
            />

            <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
            />

            <div>
                <button type="submit">Create</button>
                {onClose && (
                    <button type="button" onClick={onClose}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}

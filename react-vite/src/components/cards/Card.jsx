import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchCard,
    updateCard,
    deleteCard,
} from "../../redux/cardsReducer";
import {
  createComment,
  fetchComments,
  updateComment,
  deleteComment,
} from "../../redux/commentsReducer";
import { useParams, useNavigate } from "react-router-dom";
import './Card.css';

export default function Card() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cardId } = useParams();

  const card = useSelector((state) => state.cards.byId[cardId]);
  const comments = useSelector((state) => state.comments.byCardId[cardId] || {});
  const user = useSelector((state) => state.session.user);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    due_date: "",
    list_id: null
  });
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    dispatch(fetchCard(cardId));
    dispatch(fetchComments(cardId));
  }, [dispatch, cardId]);

  useEffect(() => {
    if (card) {
      setFormData({
        name: card.name,
        description: card.description || "",
        due_date: formatDateForInput(card.due_date),
        list_id: card.list_id
      });
    }
  }, [card]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    dispatch(updateCard(cardId, formData));
    setEditMode(false);
  };

  const handleDelete = () => {
    dispatch(deleteCard(cardId));
    navigate("/");
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    await dispatch(createComment(cardId, { content: newComment }));
    setNewComment("");
  };

  const handleCommentEdit = (commentId, content) => {
    setEditingCommentId(commentId);
    setEditingCommentText(content);
  };

  const handleCommentEditSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateComment(editingCommentId, {content: editingCommentText}));
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  const handleCommentDelete = async (commentId) => {
    if (window.confirm("Delete this comment?")) {
      await dispatch(deleteComment(commentId, cardId));
    }
  };

  if (!card) return <div>Loading card...</div>;

  return (
    <div className="card-detail-container">
      {editMode ? (
        <>
          <input
            className="card-input"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Card name"
          />
          <textarea
            className="card-textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
          />
          <input
            className="card-input"
            type="date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
          />
          <div className="card-actions">
            <button className="card-button edit-button" onClick={handleSave}>
              Save
            </button>
            <button className="card-button" onClick={() => setEditMode(false)}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="card-header">
            <h2 className="card-title">{card.name}</h2>
            <p className="card-description">{card.description}</p>
            {card.due_date && <p className="card-due-date">Due: {card.due_date}</p>}
          </div>
          <div className="card-actions">
            <button className="card-button edit-button" onClick={() => setEditMode(true)}>
              Edit Card
            </button>
            <button className="card-button delete-button" onClick={handleDelete}>
              Delete Card
            </button>
          </div>
        </>
      )}

      <div className="comments-section">
        <h3 className="comments-title">Comments</h3>
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            className="comment-textarea"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
          />
          <button type="submit" className="comment-submit">
            Add Comment
          </button>
        </form>

        <ul className="comments-list">
          {Object.values(comments).map((comment) => (
            <li key={comment.id} className="comment-item">
              <div className="comment-header">
                <span className="comment-username">
                  {comment.username || `User ${comment.user_id}`}
                </span>
              </div>

              {editingCommentId === comment.id ? (
                <form onSubmit={handleCommentEditSubmit}>
                  <textarea
                    className="comment-textarea"
                    value={editingCommentText}
                    onChange={(e) => setEditingCommentText(e.target.value)}
                  />
                  <div className="card-actions">
                    <button type="submit" className="card-button edit-button">Save</button>
                    <button
                      type="button"
                      className="card-button"
                      onClick={() => setEditingCommentId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <p className="comment-content">{comment.content}</p>
                  {user?.id === comment.user_id && (
                    <div className="comment-actions">
                      <button
                        className="comment-button"
                        onClick={() => handleCommentEdit(comment.id, comment.content)}
                      >
                        Edit
                      </button>
                      <button
                        className="comment-button"
                        onClick={() => handleCommentDelete(comment.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

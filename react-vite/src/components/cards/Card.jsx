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

export default function Card() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cardId } = useParams();

  const card = useSelector((state) => state.cards.byId[cardId]);
  const comments = useSelector((state) => state.comments.byId);
  const user = useSelector((state) => state.session.user);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    due_date: "",
  });
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  useEffect(() => {
    dispatch(fetchCard(cardId));
    dispatch(fetchComments(cardId));
  }, [dispatch, cardId]);

  useEffect(() => {
    if (card) {
      setFormData({
        name: card.name,
        description: card.description || "",
        due_date: card.due_date || "",
      });
    }
  }, [card]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
      await dispatch(deleteComment(commentId));
    }
  };

  if (!card) return <div>Loading card...</div>;

  return (
    <div >
      {editMode ? (
        <>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Card name"
          />
          <textarea

            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
          />
          <input

            type="date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
          />
          <div >
            <button onClick={handleSave} >
              Save
            </button>
            <button onClick={() => setEditMode(false)} >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 >{card.name}</h2>
          <p>{card.description}</p>
          {card.due_date && <p>Due: {card.due_date}</p>}
          <div >
            <button onClick={() => setEditMode(true)} >
              Edit Card
            </button>
            <button onClick={handleDelete}>
              Delete Card
            </button>
          </div>
        </>
      )}

      <hr />

      <h3>Comments</h3>
      <form onSubmit={handleCommentSubmit} >
        <textarea

          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
        />
        <button type="submit" >
          Add Comment
        </button>
      </form>

      <ul >
        {Object.values(comments).map((comment) => (
          <li key={comment.id} >
            <div >
              {comment.username || `User ${comment.user_id}`}
            </div>

            {editingCommentId === comment.id ? (
              <form onSubmit={handleCommentEditSubmit}>
                <textarea

                  value={editingCommentText}
                  onChange={(e) => setEditingCommentText(e.target.value)}
                />
                <div >
                  <button type="submit" >Save</button>
                  <button
                    type="button"
                    onClick={() => setEditingCommentId(null)}

                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p>{comment.content}</p>
                {user?.id === comment.user_id && (
                  <div className="text-sm flex gap-4 mt-1">
                    <button
                      onClick={() => handleCommentEdit(comment.id, comment.content)}

                    >
                      Edit
                    </button>
                    <button
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
  );
}

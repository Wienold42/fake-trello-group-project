import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoards, deleteBoard } from '../../redux/boardsReducer';
import { Link, Navigate } from 'react-router-dom';
import CreateBoardModal from './CreateBoardModal';
import EditBoardModal from './EditBoardModal';
import './BoardListPage.css';

function BoardListPage() {
  const dispatch = useDispatch();
  const boardsState = useSelector(state => state.boards);
  const sessionUser = useSelector(state => state.session.user);
  const boards = Object.values(boardsState.byId || {});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBoard, setEditingBoard] = useState(null);

  useEffect(() => {
    if (sessionUser) {
      dispatch(fetchBoards());
    }
  }, [dispatch, sessionUser]);

  const handleDeleteBoard = async (boardId) => {
    if (window.confirm('Are you sure you want to delete this board?')) {
      await dispatch(deleteBoard(boardId));
    }
  };

  if (!sessionUser) {
    return <Navigate to="/login" replace={true} />;
  }

  if (boardsState.loading) {
    return <div className="loading-container">Loading boards...</div>;
  }

  return (
    <div className="boards-container">
      <h1 className="boards-title">Your Boards</h1>
      <div className="boards-grid">
        {boards.map(board => (
          <div key={board.id} className="board-card">
            <Link to={`/boards/${board.id}`} className="board-link">
              <h3>{board.name}</h3>
            </Link>
            <div className="board-actions">
              <button 
                className="edit-board-button"
                onClick={() => setEditingBoard(board)}
              >
                Edit
              </button>
              <button 
                className="delete-board-button"
                onClick={() => handleDeleteBoard(board.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        <div 
          className="board-card create-board"
          onClick={() => setShowCreateModal(true)}
        >
          <h3>+ Create New Board</h3>
        </div>
      </div>
      {showCreateModal && (
        <CreateBoardModal onClose={() => setShowCreateModal(false)} />
      )}
      {editingBoard && (
        <EditBoardModal 
          board={editingBoard} 
          onClose={() => setEditingBoard(null)} 
        />
      )}
    </div>
  );
}

export default BoardListPage; 
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoards } from '../../redux/boardsReducer';
import { Link, Navigate } from 'react-router-dom';
import './BoardListPage.css';

function BoardListPage() {
  const dispatch = useDispatch();
  const boardsState = useSelector(state => state.boards);
  const sessionUser = useSelector(state => state.session.user);
  const boards = Object.values(boardsState.byId || {});

  useEffect(() => {
    if (sessionUser) {
      dispatch(fetchBoards());
    }
  }, [dispatch, sessionUser]);

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
          <Link 
            key={board.id} 
            to={`/boards/${board.id}`}
            className="board-card"
          >
            <h3>{board.name}</h3>
          </Link>
        ))}
        <div className="board-card create-board">
          <h3>+ Create New Board</h3>
        </div>
      </div>
    </div>
  );
}

export default BoardListPage; 
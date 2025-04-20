import { useEffect, useState } from 'react';  
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoard } from '../../redux/boardsReducer';
import { fetchLists } from '../../redux/listsReducer';
import List from '../lists/List';
import CreateListModal from '../Lists/CreateListModal';
import './BoardViewPage.css';

function BoardViewPage() {
  const { boardId } = useParams();
  const dispatch = useDispatch();
  const boardsState = useSelector(state => state.boards);
  const listsState = useSelector(state => state.lists);
  const board = boardsState?.byId?.[boardId];
  const lists = listsState?.byId || {};
  const listsArray = Object.values(lists).filter(list => list.board_id === parseInt(boardId));
  const [showCreateListModal, setShowCreateListModal] = useState(false);

  useEffect(() => {
    if (boardId) {
      dispatch(fetchBoard(boardId));
      dispatch(fetchLists(boardId));
    }
  }, [dispatch, boardId]);

  if (boardsState.loading || !board) {
    return <div className="loading-container">Loading board...</div>;
  }

  return (
    <div className="board-container">
      <h1 className="board-title">{board.name}</h1>
      <div className="lists-container">
        {listsArray.map(list => (
          <List key={list.id} list={list} />
        ))}
        <div className="add-list-container">
          <button 
            className="add-list-button"
            onClick={() => setShowCreateListModal(true)}
          >
            + Add a list
          </button>
        </div>
      </div>
      {showCreateListModal && (
        <CreateListModal 
          boardId={boardId} 
          onClose={() => setShowCreateListModal(false)} 
        />
      )}
    </div>
  );
}

export default BoardViewPage; 
import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchListCards, deleteList, updateList } from '../../redux/listsReducer';
import CardPreview from '../Cards/CardPreview';
import CreateCardModal from '../Cards/CreateCardModal';
import './List.css';

function List({ list }) {
  const dispatch = useDispatch();
  const cards = useSelector(state => state.lists.cardsByListId);
  const cardsForList = useMemo(() => cards[list.id] || [], [cards, list.id]);
  const [isEditing, setIsEditing] = useState(false);
  const [listName, setListName] = useState(list.name);
  const [showCreateCardModal, setShowCreateCardModal] = useState(false);

  useEffect(() => {
    if (list && list.id) {
      dispatch(fetchListCards(list.id));
    }
  }, [dispatch, list]);

  const handleNameChange = (e) => {
    setListName(e.target.value);
  };

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    if (listName.trim() !== list.name) {
      await dispatch(updateList(list.id, { name: listName.trim() }));
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this list? This will also delete all cards in the list.')) {
      await dispatch(deleteList(list.id));
    }
  };

  return (
    <div className="list-container">
      <div className="list-header">
        {isEditing ? (
          <form onSubmit={handleNameSubmit}>
            <input
              type="text"
              value={listName}
              onChange={handleNameChange}
              onBlur={handleNameSubmit}
              autoFocus
            />
          </form>
        ) : (
          <h3 onClick={() => setIsEditing(true)}>{list.name}</h3>
        )}
      </div>
      <div className="cards-container">
        {cardsForList.map(card => (
          <CardPreview key={card.id} card={card} />
        ))}
      </div>
      <div className="list-actions">
        <button 
          className="add-card-button" 
          onClick={() => setShowCreateCardModal(true)}
        >
          + Add a card
        </button>
        <button className="delete-list-button" onClick={handleDelete}>
          Delete list
        </button>
      </div>
      {showCreateCardModal && (
        <CreateCardModal 
          listId={list.id} 
          onClose={() => setShowCreateCardModal(false)} 
        />
      )}
    </div>
  );
}

export default List; 
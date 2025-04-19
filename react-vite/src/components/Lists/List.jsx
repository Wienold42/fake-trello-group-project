import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchListCards } from '../../redux/listsReducer';
import Card from '../Cards/Card';
import './List.css';

function List({ list }) {
  const dispatch = useDispatch();
  const cards = useSelector(state => state.lists.cardsByListId);
  const cardsForList = useMemo(() => cards[list.id] || [], [cards, list.id]);
  const [isEditing, setIsEditing] = useState(false);
  const [listName, setListName] = useState(list.name);

  useEffect(() => {
    dispatch(fetchListCards(list.id));
  }, [dispatch, list.id]);

  const handleNameChange = (e) => {
    setListName(e.target.value);
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement update list name
    setIsEditing(false);
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
          <Card key={card.id} card={card} />
        ))}
      </div>
      <div className="add-card-container">
        <button className="add-card-button">+ Add a card</button>
      </div>
    </div>
  );
}

export default List; 
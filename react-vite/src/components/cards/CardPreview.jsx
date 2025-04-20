import { Link } from 'react-router-dom';
import './CardPreview.css';

export default function CardPreview({ card }) {
  return (
    <div className="card-preview">
      <Link to={`/cards/${card.id}`} className="card-link">
        {card.name}
      </Link>
    </div>
  );
} 
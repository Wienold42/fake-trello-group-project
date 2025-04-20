import Cookies from 'js-cookie';
import { addCardToList } from './listsReducer';

const CREATE_CARD_REQUEST = 'cards/CREATE_CARD_REQUEST';
const CREATE_CARD_SUCCESS = 'cards/CREATE_CARD_SUCCESS';
const CREATE_CARD_FAILURE = 'cards/CREATE_CARD_FAILURE';

const GET_CARD_REQUEST = 'cards/GET_CARD_REQUEST';
const GET_CARD_SUCCESS = 'cards/GET_CARD_SUCCESS';
const GET_CARD_FAILURE = 'cards/GET_CARD_FAILURE';

const UPDATE_CARD_REQUEST = 'cards/UPDATE_CARD_REQUEST';
const UPDATE_CARD_SUCCESS = 'cards/UPDATE_CARD_SUCCESS';
const UPDATE_CARD_FAILURE = 'cards/UPDATE_CARD_FAILURE';

const DELETE_CARD_REQUEST = 'cards/DELETE_CARD_REQUEST';
const DELETE_CARD_SUCCESS = 'cards/DELETE_CARD_SUCCESS';
const DELETE_CARD_FAILURE = 'cards/DELETE_CARD_FAILURE';


const createCardRequest = () => ({ type: CREATE_CARD_REQUEST });
const createCardSuccess = (card) => ({ type: CREATE_CARD_SUCCESS, payload: card });
const createCardFailure = (error) => ({ type: CREATE_CARD_FAILURE, payload: error });

const getCardRequest = () => ({ type: GET_CARD_REQUEST });
const getCardSuccess = (card) => ({ type: GET_CARD_SUCCESS, payload: card });
const getCardFailure = (error) => ({ type: GET_CARD_FAILURE, payload: error });

const updateCardRequest = () => ({ type: UPDATE_CARD_REQUEST });
const updateCardSuccess = (card) => ({ type: UPDATE_CARD_SUCCESS, payload: card });
const updateCardFailure = (error) => ({ type: UPDATE_CARD_FAILURE, payload: error });

const deleteCardRequest = () => ({ type: DELETE_CARD_REQUEST });
const deleteCardSuccess = (cardId) => ({ type: DELETE_CARD_SUCCESS, payload: cardId });
const deleteCardFailure = (error) => ({ type: DELETE_CARD_FAILURE, payload: error });


export const fetchCard = (cardId) => async (dispatch) => {
  dispatch(getCardRequest());
  try {
    const res = await fetch(`/api/cards/${cardId}`, {
      credentials: 'include'
    });
    if (!res.ok) throw new Error("Failed to fetch card");
    const data = await res.json();
    dispatch(getCardSuccess(data));
  } catch (err) {
    dispatch(getCardFailure(err.message));
  }
};

export const createCard = (cardData) => async (dispatch) => {
  dispatch(createCardRequest());
  try {
    const formData = new URLSearchParams();
    formData.append("csrf_token", Cookies.get("XSRF-TOKEN"));
    formData.append("list_id", cardData.list_id);
    formData.append("name", cardData.name);
    formData.append("description", cardData.description || "");
    formData.append("due_date", cardData.due_date || "");

    const res = await fetch(`/api/cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to create card");
    const data = await res.json();
    dispatch(createCardSuccess(data));
    dispatch(addCardToList(data));
    return data;
  } catch (err) {
    dispatch(createCardFailure(err.message));
    return { error: err.message };
  }
};

export const updateCard = (cardId, updates) => async (dispatch) => {
  dispatch(updateCardRequest());
  try {
    const formData = new URLSearchParams();
    formData.append("csrf_token", Cookies.get("XSRF-TOKEN"));
    formData.append("list_id", updates.list_id);
    formData.append("name", updates.name);
    formData.append("description", updates.description);
    if (updates.due_date) {
      formData.append("due_date", updates.due_date);
    }

    const res = await fetch(`/api/cards/${cardId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to update card");
    const data = await res.json();
    dispatch(updateCardSuccess(data));
  } catch (err) {
    dispatch(updateCardFailure(err.message));
  }
};

export const deleteCard = (cardId) => async (dispatch) => {
  dispatch(deleteCardRequest());
  try {
    const res = await fetch(`/api/cards/${cardId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error("Failed to delete card");
    dispatch(deleteCardSuccess(cardId));
  } catch (err) {
    dispatch(deleteCardFailure(err.message));
  }
};

const initialState = {
  byId: {},
  loading: false,
  error: null,
};

export default function cardsReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_CARD_REQUEST:
    case GET_CARD_REQUEST:
    case UPDATE_CARD_REQUEST:
    case DELETE_CARD_REQUEST:
      return { ...state, loading: true, error: null };

    case CREATE_CARD_SUCCESS:
    case GET_CARD_SUCCESS:
    case UPDATE_CARD_SUCCESS:
      return {
        ...state,
        loading: false,
        byId:
        {
          ...state.byId,
          [action.payload.id]: action.payload,
        },
      };

    case DELETE_CARD_SUCCESS: {
      const newState = { ...state.byId };
      delete newState[action.payload];
      return { ...state, loading: false, byId: newState, };
    }

    case CREATE_CARD_FAILURE:
    case GET_CARD_FAILURE:
    case UPDATE_CARD_FAILURE:
    case DELETE_CARD_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}

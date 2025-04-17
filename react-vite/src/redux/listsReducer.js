
const FETCH_LISTS_REQUEST = 'lists/FETCH_LISTS_REQUEST';
const FETCH_LISTS_SUCCESS = 'lists/FETCH_LISTS_SUCCESS';
const FETCH_LISTS_FAILURE = 'lists/FETCH_LISTS_FAILURE';

const CREATE_LIST_REQUEST = 'lists/CREATE_LIST_REQUEST';
const CREATE_LIST_SUCCESS = 'lists/CREATE_LIST_SUCCESS';
const CREATE_LIST_FAILURE = 'lists/CREATE_LIST_FAILURE';

const UPDATE_LIST_REQUEST = 'lists/UPDATE_LIST_REQUEST';
const UPDATE_LIST_SUCCESS = 'lists/UPDATE_LIST_SUCCESS';
const UPDATE_LIST_FAILURE = 'lists/UPDATE_LIST_FAILURE';

const DELETE_LIST_REQUEST = 'lists/DELETE_LIST_REQUEST';
const DELETE_LIST_SUCCESS = 'lists/DELETE_LIST_SUCCESS';
const DELETE_LIST_FAILURE = 'lists/DELETE_LIST_FAILURE';

const FETCH_LIST_CARDS_REQUEST = 'lists/FETCH_LIST_CARDS_REQUEST';
const FETCH_LIST_CARDS_SUCCESS = 'lists/FETCH_LIST_CARDS_SUCCESS';
const FETCH_LIST_CARDS_FAILURE = 'lists/FETCH_LIST_CARDS_FAILURE';

const fetchListsRequest = () => ({ type: FETCH_LISTS_REQUEST });
const fetchListsSuccess = (lists) => ({ type: FETCH_LISTS_SUCCESS, payload: lists });
const fetchListsFailure = (error) => ({ type: FETCH_LISTS_FAILURE, payload: error });

const createListRequest = () => ({ type: CREATE_LIST_REQUEST });
const createListSuccess = (list) => ({ type: CREATE_LIST_SUCCESS, payload: list });
const createListFailure = (error) => ({ type: CREATE_LIST_FAILURE, payload: error });

const updateListRequest = () => ({ type: UPDATE_LIST_REQUEST });
const updateListSuccess = (list) => ({ type: UPDATE_LIST_SUCCESS, payload: list });
const updateListFailure = (error) => ({ type: UPDATE_LIST_FAILURE, payload: error });

const deleteListRequest = () => ({ type: DELETE_LIST_REQUEST });
const deleteListSuccess = (listId) => ({ type: DELETE_LIST_SUCCESS, payload: listId });
const deleteListFailure = (error) => ({ type: DELETE_LIST_FAILURE, payload: error });

const fetchListCardsRequest = () => ({ type: FETCH_LIST_CARDS_REQUEST });
const fetchListCardsSuccess = (listId, cards) => ({
    type: FETCH_LIST_CARDS_SUCCESS,
    payload: { listId, cards },
});
const fetchListCardsFailure = (error) => ({ type: FETCH_LIST_CARDS_FAILURE, payload: error });

export const fetchLists = (boardId) => async (dispatch) => {
    dispatch(fetchListsRequest());
    try {
        const res = await fetch(`/api/boards/${boardId}/lists`);
        if (!res.ok) throw new Error('Failed to fetch lists');
        const data = await res.json();
        dispatch(fetchListsSuccess(data.lists));
    } catch (err) {
        dispatch(fetchListsFailure(err.message));
    }
};

export const createList = (boardId, listData) => async (dispatch) => {
    dispatch(createListRequest());
    try {
        const res = await fetch(`/api/boards/${boardId}/lists`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(listData),
        });
        if (!res.ok) throw new Error('Failed to create list');
        const data = await res.json();
        dispatch(createListSuccess(data));
    } catch (err) {
        dispatch(createListFailure(err.message));
    }
};

export const updateList = (listId, listData) => async (dispatch) => {
    dispatch(updateListRequest());
    try {
        const res = await fetch(`/api/lists/${listId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(listData),
        });
        if (!res.ok) throw new Error('Failed to update list');
        const data = await res.json();
        dispatch(updateListSuccess(data));
    } catch (err) {
        dispatch(updateListFailure(err.message));
    }
};

export const deleteList = (listId) => async (dispatch) => {
    dispatch(deleteListRequest());
    try {
        const res = await fetch(`/api/lists/${listId}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete list');
        dispatch(deleteListSuccess(listId));
    } catch (err) {
        dispatch(deleteListFailure(err.message));
    }
};

export const fetchListCards = (listId) => async (dispatch) => {
    dispatch(fetchListCardsRequest());
    try {
        const res = await fetch(`/api/lists/${listId}/cards`);
        if (!res.ok) throw new Error('Failed to fetch cards for list');
        const data = await res.json();
        dispatch(fetchListCardsSuccess(listId, data.cards));
    } catch (err) {
        dispatch(fetchListCardsFailure(err.message));
    }
};

// Reducer
const initialState = {
    byId: {},
    cardsByListId: {},
    loading: false,
    error: null,
};

export default function listsReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_LISTS_REQUEST:
        case FETCH_LIST_CARDS_REQUEST:
        case CREATE_LIST_REQUEST:
        case UPDATE_LIST_REQUEST:
        case DELETE_LIST_REQUEST:
            return { ...state, loading: true, error: null };

        case FETCH_LISTS_SUCCESS: {
            const listMap = {};
            action.payload.forEach((list) => {
                listMap[list.id] = list;
            });
            return { ...state, loading: false, byId: listMap };
        }

        case CREATE_LIST_SUCCESS:
        case UPDATE_LIST_SUCCESS:
            return {
                ...state,
                loading: false,
                byId: {
                    ...state.byId,
                    [action.payload.id]: action.payload,
                },
            };

        case DELETE_LIST_SUCCESS: {
            const newState = { ...state.byId };
            delete newState[action.payload];
            return { ...state, loading: false, byId: newState };
        }

        case FETCH_LIST_CARDS_SUCCESS:
            return {
                ...state,
                loading: false,
                cardsByListId: {
                    ...state.cardsByListId,
                    [action.payload.listId]: action.payload.cards,
                },
            };

        case FETCH_LISTS_FAILURE:
        case FETCH_LIST_CARDS_FAILURE:
        case CREATE_LIST_FAILURE:
        case UPDATE_LIST_FAILURE:
        case DELETE_LIST_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
}

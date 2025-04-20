const FETCH_BOARDS_REQUEST = 'boards/FETCH_BOARDS_REQUEST';
const FETCH_BOARDS_SUCCESS = 'boards/FETCH_BOARDS_SUCCESS';
const FETCH_BOARDS_FAILURE = 'boards/FETCH_BOARDS_FAILURE';

const FETCH_BOARD_REQUEST = 'boards/FETCH_BOARD_REQUEST';
const FETCH_BOARD_SUCCESS = 'boards/FETCH_BOARD_SUCCESS';
const FETCH_BOARD_FAILURE = 'boards/FETCH_BOARD_FAILURE';

const CREATE_BOARD_REQUEST = 'boards/CREATE_BOARD_REQUEST';
const CREATE_BOARD_SUCCESS = 'boards/CREATE_BOARD_SUCCESS';
const CREATE_BOARD_FAILURE = 'boards/CREATE_BOARD_FAILURE';

const UPDATE_BOARD_REQUEST = 'boards/UPDATE_BOARD_REQUEST';
const UPDATE_BOARD_SUCCESS = 'boards/UPDATE_BOARD_SUCCESS';
const UPDATE_BOARD_FAILURE = 'boards/UPDATE_BOARD_FAILURE';

const DELETE_BOARD_REQUEST = 'boards/DELETE_BOARD_REQUEST';
const DELETE_BOARD_SUCCESS = 'boards/DELETE_BOARD_SUCCESS';
const DELETE_BOARD_FAILURE = 'boards/DELETE_BOARD_FAILURE';

const fetchBoardsRequest = () => ({ type: FETCH_BOARDS_REQUEST });
const fetchBoardsSuccess = (boards) => ({ type: FETCH_BOARDS_SUCCESS, payload: boards })
const fetchBoardsFailure = (error) => ({ type: FETCH_BOARDS_FAILURE, payload: error })

const fetchBoardRequest = () => ({ type: FETCH_BOARD_REQUEST });
const fetchBoardSuccess = (board) => ({ type: FETCH_BOARD_SUCCESS, payload: board });
const fetchBoardFailure = (error) => ({ type: FETCH_BOARD_FAILURE, payload: error });

const createBoardRequest = () => ({ type: CREATE_BOARD_REQUEST });
const createBoardSuccess = (board) => ({ type: CREATE_BOARD_SUCCESS, payload: board });
const createBoardFailure = (error) => ({ type: CREATE_BOARD_FAILURE, payload: error });

const updateBoardRequest = () => ({ type: UPDATE_BOARD_REQUEST });
const updateBoardSuccess = (board) => ({ type: UPDATE_BOARD_SUCCESS, payload: board });
const updateBoardFailure = (error) => ({ type: UPDATE_BOARD_FAILURE, payload: error });

const deleteBoardRequest = () => ({ type: DELETE_BOARD_REQUEST });
const deleteBoardSuccess = (boardId) => ({ type: DELETE_BOARD_SUCCESS, payload: boardId });
const deleteBoardFailure = (error) => ({ type: DELETE_BOARD_FAILURE, payload: error });

export const fetchBoards = () => async (dispatch) => {
    dispatch(fetchBoardsRequest());
    try {
        const res = await fetch(`/api/boards`);
        if (!res.ok) throw new Error('Boards fetch failed');
        const data = await res.json();
        dispatch(fetchBoardsSuccess(data));
    } catch (err) {
        dispatch(fetchBoardsFailure(err.message));
    }
}

export const fetchBoard = (id) => async (dispatch) => {
    dispatch(fetchBoardRequest());
    try {
        const res = await fetch(`/api/boards/${id}`);
        if (!res.ok) throw new Error('Failed to fetch board');
        const data = await res.json()
        dispatch(fetchBoardSuccess(data));
    } catch (err) {
        dispatch(fetchBoardFailure(err.message))
    }
}

export const createBoard = (boardData) => async (dispatch) => {
    dispatch(createBoardRequest());
    try {
        const csrfToken = document.cookie.split('; ')
            .find(row => row.startsWith('csrf_token='))
            ?.split('=')[1] || '';

        const res = await fetch(`/api/boards`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            credentials: 'include',
            body: JSON.stringify(boardData)
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Failed to create board');
        }
        const data = await res.json();
        dispatch(createBoardSuccess(data));
        return data;
    } catch (err) {
        dispatch(createBoardFailure(err.message));
        return { error: err.message };
    }
}

export const updateBoard = (boardId, boardData) => async (dispatch) => {
    dispatch(updateBoardRequest());
    try {
        const res = await fetch(`/api/boards/${boardId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(boardData),
        });
        if (!res.ok) throw new Error('Failed to update board');
        const data = await res.json();
        dispatch(updateBoardSuccess(data));
    } catch (err) {
        dispatch(updateBoardFailure(err.message));
    }
};

export const deleteBoard = (boardId) => async (dispatch) => {
    dispatch(deleteBoardRequest());
    try {
        const res = await fetch(`/api/boards/${boardId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete board');
        dispatch(deleteBoardSuccess(boardId));
    } catch (err) {
        dispatch(deleteBoardFailure(err.message))
    }
}

const initialState = {
    byId: {},
    loading: false,
    error: null
}

export default function boardsReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_BOARDS_REQUEST:
        case FETCH_BOARD_REQUEST:
        case CREATE_BOARD_REQUEST:
        case UPDATE_BOARD_REQUEST:
        case DELETE_BOARD_REQUEST:
            return { ...state, loading: true, error: null }

        case FETCH_BOARDS_SUCCESS: {
            const boardsMap = {};
            action.payload.boards.forEach((board) => {
                boardsMap[board.id] = board;
            })
            return { ...state, loading: false, byId: boardsMap }
        }

        case FETCH_BOARD_SUCCESS:
        case CREATE_BOARD_SUCCESS:
        case UPDATE_BOARD_SUCCESS:
            return {
                ...state, loading: false, byId: { ...state.byId, [action.payload.id]: action.payload, },
            };

        case DELETE_BOARD_SUCCESS: {
            const updated = { ...state.byId };
            delete updated[action.payload];
            return { ...state, loading: false, byId: updated };
        }


        case FETCH_BOARDS_FAILURE:
        case FETCH_BOARD_FAILURE:
        case CREATE_BOARD_FAILURE:
        case UPDATE_BOARD_FAILURE:
        case DELETE_BOARD_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;

    }
}
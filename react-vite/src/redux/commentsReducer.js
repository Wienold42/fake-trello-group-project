import Cookies from "js-cookie";

const FETCH_COMMENTS_REQUEST = 'comments/FETCH_COMMENTS_REQUEST';
const FETCH_COMMENTS_SUCCESS = 'comments/FETCH_COMMENTS_SUCCESS';
const FETCH_COMMENTS_FAILURE = 'comments/FETCH_COMMENTS_FAILURE';

const CREATE_COMMENT_REQUEST = 'comments/CREATE_COMMENT_REQUEST';
const CREATE_COMMENT_SUCCESS = 'comments/CREATE_COMMENT_SUCCESS';
const CREATE_COMMENT_FAILURE = 'comments/CREATE_COMMENT_FAILURE';

const DELETE_COMMENT_REQUEST = 'comments/DELETE_COMMENT_REQUEST';
const DELETE_COMMENT_SUCCESS = 'comments/DELETE_COMMENT_SUCCESS';
const DELETE_COMMENT_FAILURE = 'comments/DELETE_COMMENT_FAILURE';

const UPDATE_COMMENT_REQUEST = 'comments/UPDATE_COMMENT_REQUEST';
const UPDATE_COMMENT_SUCCESS = 'comments/UPDATE_COMMENT_SUCCESS';
const UPDATE_COMMENT_FAILURE = 'comments/UPDATE_COMMENT_FAILURE';

const fetchCommentsRequest = () => ({ type: FETCH_COMMENTS_REQUEST });
const fetchCommentsSuccess = (comments) => ({ type: FETCH_COMMENTS_SUCCESS, payload: comments });
const fetchCommentsFailure = (error) => ({ type: FETCH_COMMENTS_FAILURE, payload: error });

const createCommentRequest = () => ({ type: CREATE_COMMENT_REQUEST });
const createCommentSuccess = (comment) => ({ type: CREATE_COMMENT_SUCCESS, payload: comment });
const createCommentFailure = (error) => ({ type: CREATE_COMMENT_FAILURE, payload: error });

const deleteCommentRequest = () => ({ type: DELETE_COMMENT_REQUEST });
const deleteCommentSuccess = (commentId) => ({ type: DELETE_COMMENT_SUCCESS, payload: commentId });
const deleteCommentFailure = (error) => ({ type: DELETE_COMMENT_FAILURE, payload: error });

const updateCommentRequest = () => ({ type: UPDATE_COMMENT_REQUEST });
const updateCommentSuccess = (comment) => ({ type: UPDATE_COMMENT_SUCCESS, payload: comment });
const updateCommentFailure = (error) => ({ type: UPDATE_COMMENT_FAILURE, payload: error });

export const fetchComments = (cardId) => async (dispatch) => {
    dispatch(fetchCommentsRequest());
    try {
        const res = await fetch(`/api/cards/${cardId}/comments`);
        if (!res.ok) throw new Error("Failed to fetch comments");
        const data = await res.json();
        dispatch(fetchCommentsSuccess(data.comments));
    } catch (err) {
        dispatch(fetchCommentsFailure(err.message));
    }
};

export const createComment = (cardId, commentData) => async (dispatch) => {
    dispatch(createCommentRequest());
    try {
        const res = await fetch(`/api/cards/${cardId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(commentData),
        });
        if (!res.ok) throw new Error("Failed to create comment");
        const data = await res.json();
        dispatch(createCommentSuccess(data));
    } catch (err) {
        dispatch(createCommentFailure(err.message));
    }
};

export const deleteComment = (commentId) => async (dispatch) => {
    dispatch(deleteCommentRequest());
    try {
        const res = await fetch(`/api/comments/${commentId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error("Failed to delete comment");
        dispatch(deleteCommentSuccess(commentId));
    } catch (err) {
        dispatch(deleteCommentFailure(err.message));
    }
};

export const updateComment = (commentId, updateData) => async (dispatch) => {
    dispatch(updateCommentRequest());
    try {
        const formData = new URLSearchParams();
        formData.append("content", updateData.content);
        formData.append("csrf_token", Cookies.get("XSRF-TOKEN"));

        const res = await fetch(`/api/comments/${commentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData,
        });
        if (!res.ok) throw new Error("Failed to update comment");
        const data = await res.json();
        dispatch(updateCommentSuccess(data));
    } catch (err) {
        dispatch(updateCommentFailure(err.message));
    }
};

const initialState = {
    byId: {},
    loading: false,
    error: null,
};

export default function commentsReducer(state = initialState, action) {
    switch (action.type) {
        case CREATE_COMMENT_REQUEST:
        case DELETE_COMMENT_REQUEST:
        case UPDATE_COMMENT_REQUEST:
            return { ...state, loading: true, error: null };

        case CREATE_COMMENT_SUCCESS:
        case UPDATE_COMMENT_SUCCESS:
            return {
                ...state,
                loading: false,
                byId: {
                    ...state.byId,
                    [action.payload.id]: action.payload,
                },
            };

        case DELETE_COMMENT_SUCCESS: {
            const newState = { ...state.byId };
            delete newState[action.payload];
            return {
                ...state,
                loading: false,
                byId: newState,
            };
        }

        case CREATE_COMMENT_FAILURE:
        case DELETE_COMMENT_FAILURE:
        case UPDATE_COMMENT_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
}
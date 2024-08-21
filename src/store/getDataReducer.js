const initialState = {
    chatList: [],
    loading: false,
    error: null
};

const chatListReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_CHATLIST_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case FETCH_CHATLIST_SUCCESS:
            return {
                ...state,
                loading: false,
                chatList: action.payload
            };
        case FETCH_CHATLIST_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.error
            };
        default:
            return state;
    }
};

export default chatListReducer;
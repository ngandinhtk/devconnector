import { SET_ALERT, REMOVE_ALERT } from "../actions/type";
const initialState = [
    // {
    //     id: 1,
    //     msg: 'Please log in',
    //     alertType: 'success'
    // }
];

export default function (state = initialState, action) {
    const { payload} = action;
    switch (action.type) {
        case SET_ALERT:
            return [...state, action.payload]
            // break;
        case REMOVE_ALERT: 
            return state.filter(alert=>alert.id !== payload);
        default:
            return state
    }
}



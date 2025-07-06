
import { createSlice } from '@reduxjs/toolkit';

//create a Redux slice for managing the search query
const searchSlice = createSlice({
  name: 'search', // Name of the slice (used in action types)
  
  //Initial state= the query is empty by default
  initialState: { query: '' },

  reducers: {
    //Reducer to update the search query in the state
    setSearchQuery: (state, action) => {
      state.query = action.payload; // Update the query with the input value
    },
  },
});

//Export the action so it can be dispatched in components
export const { setSearchQuery } = searchSlice.actions;

//Export the reducer to include it in the Redux store
export default searchSlice.reducer;

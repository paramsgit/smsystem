
import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
    name: "app",
    initialState: {
        isSidebarOpen: true,
        isSearchbarOpen: true, 
        isModalOpen: false,    
    },
    reducers: {
        openSidebar: (state) => {
            state.isSidebarOpen = true;
        },
        closeSidebar: (state) => {
            state.isSidebarOpen = false;
        },
        toggleSearchbar: (state) => {
            state.isSearchbarOpen = !state.isSearchbarOpen;
        },
        OpenModal: (state) => {
            state.isModalOpen = true;
        },
        CloseModal: (state) => {
            state.isModalOpen = false;
        },
       
    },
});

export const { openSidebar,closeSidebar, toggleSearchbar,OpenModal,CloseModal } = appSlice.actions;
export default appSlice.reducer;

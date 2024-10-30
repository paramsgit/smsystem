
import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
    name: "app",
    initialState: {
        isSidebarOpen: true,
        isSearchbarOpen: true, 
        isServiceModalOpen: false,    
        isSmsModalOpen: false,    
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
        OpenServiceModal: (state) => {
            state.isServiceModalOpen = true;
        },
        CloseServiceModal: (state) => {
            state.isServiceModalOpen = false;
        },
        OpenSmsModal: (state) => {
            state.isSmsModalOpen = true;
        },
        CloseSmsModal: (state) => {
            state.isSmsModalOpen = false;
        },
       
    },
});

export const { openSidebar,closeSidebar, toggleSearchbar,OpenServiceModal,CloseServiceModal,OpenSmsModal,CloseSmsModal } = appSlice.actions;
export default appSlice.reducer;
import { Employee } from "@/types/employee";
import { createSlice } from "@reduxjs/toolkit";

interface EmployeeState {
  employee: Employee | null;
}

const initialState: EmployeeState = {
  employee: null,
};

const employeeSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setEmployee(state, action) {
      state.employee = action.payload;
    },
    clearEmployee(state) {
      state.employee = null;
    },
  },
});

export const { setEmployee, clearEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;

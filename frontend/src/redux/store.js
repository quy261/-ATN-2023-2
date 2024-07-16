import { configureStore } from "@reduxjs/toolkit";

import { userReducer } from "./userRelated/userSlice";
import { studentReducer } from "./studentRelated/studentSlice";
import { sclassReducer } from "./sclassRelated/sclassSlice";
import { teacherReducer } from "./teacherRelated/teacherSlice";
import { assistantReducer } from "./assistantRelated/assistantSlice";
import { roomReducer } from "./roomRelated/roomSlice";
import { scheduleReducer } from "./scheduleRelated/scheduleSlice";
import { adminReducer } from "./accountRelated/accountSlice";
import { moneyReducer } from "./moneyRelated/moneySlice";
import { moneyDefReducer } from "./moneyDefRelated/moneyDefSlice";
import { commentReducer } from "./commentRelated/commentSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    student: studentReducer,
    teacher: teacherReducer,
    assistant: assistantReducer,
    sclass: sclassReducer,
    room: roomReducer,
    schedule: scheduleReducer,
    admin: adminReducer,
    money: moneyReducer,
    moneyDef: moneyDefReducer,
    comment: commentReducer,
  },
});

export default store;

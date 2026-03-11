export const BASE_URL = "https://kaleidoscopic-melba-b30ceb.netlify.app";

export const API_PATHS = {
    AUTH: {
        LOGIN: "/api/v1/auth/login",
        REGISTER: "/api/v1/auth/register",
        GET_USER_INFO: "/api/v1/auth/getUser",
        UPDATE_PROFILE: "/api/v1/auth/update-profile",
        CHANGE_PASSWORD: "/api/v1/auth/change-password",
    },
    DASHBOARD: {
        GET_DATA: "/api/v1/dashboard",
        GET_SUMMARY: "/api/v1/dashboard/summary"
    },
    INCOME: {
        ADD_INCOME: "/api/v1/income/add",
        GET_ALL_INCOME: "/api/v1/income/get",
        GET_INCOME_BY_ID: (incomeId) => `/api/v1/income/get/${incomeId}`,
        UPDATE_INCOME: (incomeId) => `/api/v1/income/update/${incomeId}`,
        DELETE_INCOME: (incomeId) => `/api/v1/income/delete/${incomeId}`,
        GET_SUMMARY: "/api/v1/income/summary",
        DOWNLOAD_INCOME: "/api/v1/income/downloadexcel"
    },
    EXPENSE: {
        ADD_EXPENSE: "/api/v1/expense/add",
        GET_ALL_EXPENSE: "/api/v1/expense/get",
        GET_EXPENSE_BY_ID: (expenseId) => `/api/v1/expense/get/${expenseId}`,
        UPDATE_EXPENSE: (expenseId) => `/api/v1/expense/update/${expenseId}`,
        DELETE_EXPENSE: (expenseId) => `/api/v1/expense/delete/${expenseId}`,
        GET_SUMMARY: "/api/v1/expense/summary",
        DOWNLOAD_EXPENSE: "/api/v1/expense/downloadexcel"
    },
    IMAGE: {
        UPLOAD_IMAGE: "/api/v1/auth/upload-image"
    }
}
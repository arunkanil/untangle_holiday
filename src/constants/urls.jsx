// export const DASHBOARD = "/dashboard";
export const DEPARTMENT_URL = "/masters/department";
export const LEAVE_TYPE_URL = "/masters/leave_type";
export const LEVEL_URL = "/masters/level";
export const COUNTRY_URL = "/masters/country";
export const PUBLICHOLIDAYS_URL = "/masters/public_holidays";
export const LEAVENTITLEMENT_URL = "/masters/leave_entitlement";
export const EMPLOYEE_MANAGEMENT_URL = "/masters/employee_management";

// API URLS
export const GET_DEPARTMENT = "api/services/app/Department/GetAll?MaxResultCount=20000";
export const POST_DEPARTMENT = "api/services/app/Department/CreateOrEdit";
export const DELETE_DEPARTMENT = "api/services/app/Department/Delete?id=";
export const GET_DESIGNATION = "api/services/app/Designation/GetAll?MaxResultCount=20000";
export const POST_DESIGNATION = "api/services/app/Designation/CreateOrEdit";
export const DELETE_DESIGNATION = "api/services/app/Designation/Delete?id=";

export const GET_COUNTRY = "api/services/app/Country/GetAll?MaxResultCount=20000";
export const POST_COUNTRY = "api/services/app/Country/CreateOrEdit";
export const DELETE_COUNTRY = "api/services/app/Country/Delete?id=";
export const GET_LEAVETYPE = "api/services/app/LeaveType/GetAll?MaxResultCount=20000";
export const GET_LEAVETYPEBYCOUNTRY = "/api/services/app/LeaveType/GetAllByCountry?MaxResultCount=20000";
export const POST_LEAVETYPE = "api/services/app/LeaveType/CreateOrEdit";
export const DELETE_LEAVETYPE = "api/services/app/LeaveType/Delete?id=";
export const GET_PUBLICHOLIDAY = "api/services/app/PublicHoliday/GetAll?MaxResultCount=20000&Year=";
export const POST_PUBLICHOLIDAY = "api/services/app/PublicHoliday/CreateOrEdit";
export const DELETE_PUBLICHOLIDAY = "api/services/app/PublicHoliday/Delete?id=";
export const GET_LEAVENTITLEMENT = "api/services/app/LeaveEntitlement/GetAll?MaxResultCount=20000";
export const POST_LEAVENTITLEMENT = "/api/services/app/LeaveEntitlement/CreateOrEdit";
export const DELETE_LEAVENTITLEMENT = "api/services/app/LeaveEntitlement/Delete?id=";

export const GET_EMPLOYEEPROFILE = "api/services/app/EmployeeProfile/GetAll?MaxResultCount=20000";
export const POST_EMPLOYEEPROFILE_FROMAD = "api/services/app/EmployeeProfile/PostEmployeesFromAD";
export const POST_EMPLOYEEPROFILE = "/api/services/app/EmployeeProfile/CreateOrEdit";
export const DELETE_EMPLOYEEPROFILE = "api/services/app/EmployeeProfile/Delete?id=";
export const POST_EMPLOYEEIMPORT = "/api/services/app/EmployeeProfile/Import";
export const GET_USERS = "/api/services/app/User/GetAll?MaxResultCount=20000";
export const GET_EMPLOYEE_LEAVEENTITLEMENT = "/api/services/app/EmployeeLeaveEntitlement/GetAllByUserId";
export const POST_EMPLOYEE_LEAVEENTITLEMENT = "/api/services/app/EmployeeLeaveEntitlement/CreateOrEdit";

export const POST_LEAVEREQUEST = "/api/services/app/LeaveRequest/Create";
export const GET_LEAVEREQUESTFORME = "/api/services/app/LeaveRequest/GetLeaveRequestedForMe/";
export const GET_LEAVEREQUESTFORADMIN = "/api/services/app/LeaveRequest/GetLeaveRequestedForAdmin?";
export const POST_EXPORTLEAVES = "/api/services/app/LeaveExcelExporter/ExportAdminLeavesToFile";
export const GET_LEAVECONFLICTS = "api/services/app/LeaveRequest/GetLeaveConflicts?";
export const GET_LEAVECONFLICTSAPPROVER = "/api/services/app/LeaveRequest/GetLeaveConflictsDetailsForApprover?";
export const GET_LEAVEHISTORY = "/api/services/app/LeaveRequestHistory/Get?";
export const POST_FILEUPLOAD = "/api/File/UploadFile";
export const GET_FILEDOWNLOAD = "/api/File/DownloadFile";
export const POST_FILETEMPDOWNLOAD = "/api/File/DownloadTempFile";
export const GET_CURRENTUSER = "/api/services/app/EmployeeProfile/GetCurrentUser";
export const GET_MYLEAVEDASHBOARDS = "/api/services/app/LeaveRequest/GetMyLeaveDashboards";
export const GET_LEAVEDETAILS = "/api/services/app/LeaveRequest/GetLeaveDetails";
export const POST_REJECTREQUEST = "/api/services/app/LeaveRequest/Reject";
export const POST_APPROVEREQUEST = "/api/services/app/LeaveRequest/Approve";
export const GET_ADMIN_DASHBOARD = "/api/services/app/LeaveRequest/GetAdminLeaveDashboards";
export const UPDATE_LEAVE = "/api/services/app/LeaveRequest/Update";

export const POST_CANCEL_LEAVE = "/api/services/app/LeaveRequest/Cancel";

export const GETLeaveTransferJobHistory = "/api/services/app/LeaveTransferJobHistory/GetAll";
export const POSTLeaveTransferJobHistory = "/api/services/app/LeaveTransferJobHistory/Create";

const apiUrl = "https://lajigo.sansunt.com";

const api = {
    login: apiUrl + "/api/Users/AuthUser",
    imageRecognition: apiUrl + "/WasteApi/ImageRecognition",
    getWasteTypeList : apiUrl + "/api/Waste/GetWasteTypeList",
    correct : apiUrl + "/api/Waste/Correct",
    userInfo : apiUrl + "/api/Users/GetUserCenter",
    indexInfo: apiUrl + "/api/Users/StatisticIndex",
    newsList : apiUrl + "/api/ArticleNews/GetPageList",
    newsDetail : apiUrl + "/api/ArticleNews/Get/",
    getQuestion : apiUrl + "/api/Question/GetQuestion",
    submitQuestionapi : apiUrl + "/api/Question/SubmitQuestion",
    getTrashTypeList : apiUrl + "/api/Trash/GetTrashTypeList",
    addTrash : apiUrl + "/api/Trash/AddTrash",
    getTrashList : apiUrl + "/api/Trash/GetTrashList",
    getTrash : apiUrl + "/api/Trash/GetTrash",
    addTrashPraise : apiUrl + "/api/Trash/AddTrashPraise",
    getTrashCommentList : apiUrl + "/api/Trash/GetTrashCommentList",
    addTrashComment : apiUrl + "/api/Trash/AddTrashComment",
    deleteTrashComment: apiUrl + "/api/Trash/DelTrashComment",
    getTrashByName: apiUrl + "/api/Waste/GetWasteByName"
}

export default api

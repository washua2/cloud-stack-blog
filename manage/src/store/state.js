import crypto from "../utils/crypto"

const state = {
    // 存储当前用户邮箱 
    email: crypto.decrypt(sessionStorage.getItem("email") || "", "hiusahdu823bisadncdi") || [],
    // 存储个人信息
    personalData: ""
}
export default state;
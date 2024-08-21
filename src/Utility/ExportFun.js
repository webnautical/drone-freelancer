import { axiosInstance } from "./Api"

export const getClientSecretFun = async (amount) => {
    try {
        const params = { "amount": amount, "currency": "usd" }
        const res = await axiosInstance.post('user/createPaymentInstant', params)
        if (res?.data?.status == 200) {
            return res?.data?.clientSecret
        }
    } catch (error) { return error }
}
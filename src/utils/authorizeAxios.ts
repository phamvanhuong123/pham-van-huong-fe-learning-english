import axios from 'axios'
import { toast } from 'sonner'
import { handleLogoutApi, refreshTokenApi } from '@/services/authServices'
import { useAuthStore } from '@/store/useAuthStore'

let authorizedAxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_ROOT || 'http://localhost:5000/api/v1'
})
//Thời gian chờ tối đa là 10 phút
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10

//withCredentials : Cho phép axios tự động đính kèm và gửi cookie trong mỗi lần request lên BE theo cơ chế http Cookie
authorizedAxiosInstance.defaults.withCredentials = true

//Cấu hình interceptor

// Add a request interceptor : Can thiệp vào những request từ api
authorizedAxiosInstance.interceptors.request.use((config) => {
    // Do something before request is sent
    //Gửi acessToken lên headers mỗi lần gửi request
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
        //Bearer định nghĩa loại token cho việc xác thực và uỷ quyền, có các loại như : Basic token, Digest token,OAuth token.
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
}, (error) => {
    // Do something with request error
    return Promise.reject(error)
}
)
//Khởi tạo một promise cho việc gọi api refreshToken
//Mục đích là khi tạo yêu cầu refreshToken đầu tiên thì giữ nó lại việc gọi api refreshToken
let refreshTokenPromised: Promise<any> | null = null

// Add a response interceptor : Can thiệp vào những response nhận về từ api
authorizedAxiosInstance.interceptors.response.use((response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
}, (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    if (error?.response?.status === 401) {
        handleLogoutApi().then(() => {
            window.location.href = '/login'
        })
    }
    const originalRequest = error.config
    // console.log('originalRequest : ', originalRequest)
    if (error?.response?.status === 410 && originalRequest) {
        console.log((originalRequest as any)._retry)
            ; (originalRequest as any)._retry = true
        if (!refreshTokenPromised) {
            // Trường hợp dùng cookie: refreshToken sẽ tự động được gửi đi (do withCredentials: true)
            // Không cần lấy từ localStorage nữa
            refreshTokenPromised = refreshTokenApi().then((res: any) => {
                //Gán accessToken vào localStorage
                // console.log('đã gọi refreshToken')
                const { accessToken } = res.data

                // Update Zustand store
                const setAuth = useAuthStore.getState().setAuth
                const currentUser = useAuthStore.getState().userInfo
                if (currentUser) {
                    setAuth(currentUser, accessToken)
                }

                authorizedAxiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`

                //Cho trường hợp cookie
            })
                .catch((err: any) => {
                    //Nếu như api bị lỗi thì đăng xuất luôn
                    // console.log(err)
                    handleLogoutApi().then(() => {
                        window.location.href = '/login'
                    })
                    return Promise.reject(err)
                }).finally(() => {
                    //Dù refreshToken thành công hay lỗi cũng phải gán về null
                    refreshTokenPromised = null
                })
        }
        return refreshTokenPromised.then(() => {
            //Gọi lại những api ban đầu bị lỗi
            return authorizedAxiosInstance(originalRequest)
        })
    }

    // console.log(error)
    // Xử lý tập trung phần thông báo lỗi.Ngoại trừ mã 410 phục vụ cho việc tự động phụ vụ cho việc tự động refesh lại token
    if (error?.response?.status !== 410) {
        toast.error(error?.response?.data?.message || error?.message)
    }
    return Promise.reject(error)
})


export default authorizedAxiosInstance
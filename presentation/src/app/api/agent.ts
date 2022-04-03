import axios, { AxiosError, AxiosResponse } from "axios"
import { toast } from "react-toastify"
import { history } from "../../index"
import { PaginatedResponse } from "../models/pagination"
import { store } from "../store/storeConfig"

const sleep = () => new Promise(resolve => setTimeout(resolve, 500))

axios.defaults.baseURL = process.env.REACT_APP_API_URL
axios.defaults.withCredentials = true

const responseBody = (response: AxiosResponse) => response.data

axios.interceptors.request.use(config => {
	const token = store.getState().account.user?.token
	if (token) {
		config.headers!.Authorization = `Bearer ${token}`
	}
	return config
})

axios.interceptors.response.use(
	async response => {
		if (process.env.NODE_ENV === "development") {
			await sleep()
		}
		const pagination = response.headers["pagination"]
		if (pagination) {
			response.data = new PaginatedResponse(
				response.data,
				JSON.parse(pagination)
			)
			return response
		}
		return response
	},
	(error: AxiosError) => {
		const { data, status } = error.response!
		switch (status) {
			case 400:
				if (data.errors) {
					const modelStateErrors: string[] = []
					for (const key in data.errors) {
						if (data.errors[key]) {
							modelStateErrors.push(data.errors[key])
						}
					}
					throw modelStateErrors.flat()
				}
				toast.error(data.title)
				break
			case 401:
				toast.error(data.title)
				break
			case 403:
				toast.error("You are not allowed to do that!")
				break
			case 500:
				history.push("/server-error")
				break
			default:
				break
		}
		return Promise.reject(error.response)
	}
)

const requests = {
	get: (url: string, params?: URLSearchParams) =>
		axios.get(url, { params }).then(responseBody),
	post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
	put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
	delete: (url: string) => axios.delete(url).then(responseBody),
	postForm: (url: string, data: FormData) =>
		axios
			.post(url, data, {
				headers: { "Content-type": "multipart/form-data" },
			})
			.then(responseBody),
	putForm: (url: string, data: FormData) =>
		axios
			.put(url, data, {
				headers: { "Content-type": "multipart/form-data" },
			})
			.then(responseBody),
}

function createFormData(item: any) {
	let formData = new FormData()
	for (const key in item) {
		formData.append(key, item[key])
	}
	return formData
}

const Account = {
	login: (values: any) => requests.post("account/login", values),
	register: (values: any) => requests.post("account/register", values),
	currentUser: () => requests.get("account/currentUser"),
}

const agent = {
	Account,
}

export default agent
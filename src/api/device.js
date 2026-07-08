import { requestDevice } from "./requst";

export default {
    // 分页查询
    async selectDeviceList(current) {
        try {
            const res = await requestDevice.get('/list', { params: { current } })
            return res.data
        } catch (error) {
            console.log('查询失败', error.response?.data)
            throw error
        }
    },
    // 根据ID查询
    async selectDeviceId(deviceId) {
        try {
            const res = await requestDevice.get(`/${deviceId}`)
            return res.data
        } catch (error) {
            console.log('查询失败', error.response?.data)
            throw error
        }
    },
    // 删除设备
    async deleteDeviceId(deviceId) {
        try {
            const res = await requestDevice.delete(`/${deviceId}`)
            return res.data
        } catch (error) {
            console.log('删除失败', error.response?.data)
            throw error
        }
    },
    // 创建设备
    async createDevice(data) {
        try {
            const res = await requestDevice.post('', data)
            return res.data
        } catch (error) {
            console.log('创建失败', error.response?.data)
            throw error
        }
    },
    // 更新设备
    async updateDevice(data) {
        try {
            const res = await requestDevice.put(`/${data.deviceId}`, data)
            return res.data
        } catch (error) {
            console.log('修改失败', error.response?.data)
            throw error
        }
    }
}

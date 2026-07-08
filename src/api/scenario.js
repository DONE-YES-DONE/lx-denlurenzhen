import { requestScenario } from "./requst";

export default {

    //分页查询
    async selectScenarioList(params){
        try{
            const axiosResponse = await requestScenario.get('/list',{
                params
            })

            return axiosResponse.data
        }catch(error){
            console.log('查询失败',error.response?.data);
            throw error;
        }
    },
    // 根据场景编号查询详情
    async selectScenarioByCode(scenarioCode) {
        try{
            const axiosResponse = await requestScenario.get(`/${scenarioCode}`)
            return axiosResponse.data
        }catch(error){
            console.log('查询失败',error.response?.data);
            throw error;
        }
        
    },

    // 创建应用场景
    async createScenario(data) {
        try{
            const axiosResponse = await requestScenario.post('', data)
            return axiosResponse.data
        }catch(error){
            console.log('创建失败',error.response?.data);
            throw error;
        }
    },

    // 更新应用场景
    async updateScenario(scenarioCode, data) {
        try{
            const axiosResponse = await requestScenario.put(`/${scenarioCode}`, data)
            return axiosResponse.data
        }catch(error){
            console.log('修改失败',error.response?.data);
            throw error;
        }
        
    },

    // 删除应用场景
    async deleteScenario(scenarioCode) {
        try{
            const axiosResponse = await requestScenario.delete(`/${scenarioCode}`)
            return axiosResponse.data
        }catch(error){
            console.log('删除失败',error.response?.data);
            throw error;
        }
        
    }
}
# 仪表盘 API 通信协议

> 基础路径: `/api/dashboard`
> 请求方式: `GET`
> 统一响应格式: `{ "code": 200, "data": {...}, "message": "success" }`

---

## 一、统计卡片（4 个）

### 1.1 检测总数量

```
GET /api/dashboard/checks-total
```

**响应 data:**

| 字段 | 类型 | 说明 |
|------|------|------|
| totalChecks | number | 检测总数量 |
| trend | string | 较昨日变化（如 `+8.3%`） |

```json
{
  "code": 200,
  "data": { "totalChecks": 12847, "trend": "+8.3%" },
  "message": "success"
}
```

---

### 1.2 合格率概览

```
GET /api/dashboard/pass-rate-overview
```

**响应 data:**

| 字段 | 类型 | 说明 |
|------|------|------|
| passRate | number | 合格率百分比 |
| trend | string | 较昨日变化（如 `+0.3`） |

```json
{
  "code": 200,
  "data": { "passRate": 96.8, "trend": "+0.3" },
  "message": "success"
}
```

---

### 1.3 设备状态

```
GET /api/dashboard/device-status
```

**响应 data:**

| 字段 | 类型 | 说明 |
|------|------|------|
| totalDevices | number | 设备总数 |
| activeDevices | number | 启动设备数 |
| inactiveDevices | number | 未启动设备数 |

```json
{
  "code": 200,
  "data": { "totalDevices": 10, "activeDevices": 8, "inactiveDevices": 2 },
  "message": "success"
}
```

---

### 1.4 应用场景种类数量

```
GET /api/dashboard/scenario-count
```

**响应 data:**

| 字段 | 类型 | 说明 |
|------|------|------|
| scenarioTypeCount | number | 场景种类数 |

```json
{
  "code": 200,
  "data": { "scenarioTypeCount": 5 },
  "message": "success"
}
```

---

## 二、质量检测统计图（综合图）

### 2.1 合格率趋势（折线）

```
GET /api/dashboard/pass-rate-trend?year=2026&month=6
```

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| year | number | 是 | 年份 |
| month | number | 是 | 月份（1-12） |

**响应 data:**

| 字段 | 类型 | 说明 |
|------|------|------|
| dates | string[] | 该月日期标签（如 `["6/1","6/2",...]`），长度 = 当月天数 |
| passRates | number[] | 对应每日合格率（%），与 dates 一一对应 |

```json
{
  "code": 200,
  "data": {
    "dates": ["6/1","6/2","6/3","6/4","6/5","6/6","6/7"],
    "passRates": [95.2, 96.1, 94.8, 97.0, 95.5, 96.8, 97.2]
  },
  "message": "success"
}
```

---

### 2.2 合格/不合格数量统计（柱状）

```
GET /api/dashboard/quality-stats?year=2026&month=6
```

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| year | number | 是 | 年份 |
| month | number | 是 | 月份（1-12） |

**响应 data:**

| 字段 | 类型 | 说明 |
|------|------|------|
| dates | string[] | 该月日期标签，长度 = 当月天数 |
| passCounts | number[] | 对应每日合格数量 |
| failCounts | number[] | 对应每日不合格数量 |

```json
{
  "code": 200,
  "data": {
    "dates": ["6/1","6/2","6/3","6/4","6/5","6/6","6/7"],
    "passCounts": [110, 125, 95, 128, 85, 218, 200],
    "failCounts": [5, 6, 8, 4, 3, 7, 6]
  },
  "message": "success"
}
```

---

## 三、应用场景占比图（环状饼图）

```
GET /api/dashboard/scenario-distribution?year=2026&month=6
```

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| year | number | 是 | 年份 |
| month | number | 是 | 月份（1-12） |

**响应 data:**

| 字段 | 类型 | 说明 |
|------|------|------|
| scenarios | object[] | 场景列表 |
| scenarios[].name | string | 场景名称 |
| scenarios[].value | number | 该场景检测件数 |
| scenarios[].percentage | number | 占比百分比 |

```json
{
  "code": 200,
  "data": {
    "scenarios": [
      { "name": "汽车零部件", "value": 450, "percentage": 35.0 },
      { "name": "电子元器件", "value": 320, "percentage": 24.9 },
      { "name": "医疗器械",   "value": 280, "percentage": 21.8 },
      { "name": "航空航天",   "value": 150, "percentage": 11.7 },
      { "name": "其他",       "value": 85,  "percentage": 6.6 }
    ]
  },
  "message": "success"
}
```

---

## 四、接口汇总

| 序号 | 接口 | 参数 | 用途 |
|------|------|------|------|
| 1 | `GET /checks-total` | 无 | 检测总数量卡片 |
| 2 | `GET /pass-rate-overview` | 无 | 合格率卡片 |
| 3 | `GET /device-status` | 无 | 设备启动/总数卡片 |
| 4 | `GET /scenario-count` | 无 | 场景种类卡片 |
| 5 | `GET /pass-rate-trend` | `year, month` | 合格率折线图 |
| 6 | `GET /quality-stats` | `year, month` | 合格/不合格柱状图 |
| 7 | `GET /scenario-distribution` | `year, month` | 场景占比环状图 |

---

## 五、注意事项

1. 所有接口统一响应 `{ code: 200, data, message }` 格式
2. `year` / `month` 参数决定查询哪个自然月的数据：`dates` 数组长度必须等于该月天数
3. 前端已做好 `try/catch` 降级：接口不可用时自动用模拟数据渲染，console 会打出 warn
4. 前端 7 个接口在页面加载时并行请求（`Promise.all`），建议后端做好相应并发处理

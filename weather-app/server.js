const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 静态文件服务
app.use(express.static(path.join(__dirname)));

// 主页
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API代理（可选）
app.get('/api/weather', async (req, res) => {
  const lat = req.query.lat;
  const lon = req.query.lon;
  
  if (!lat || !lon) {
    return res.status(400).json({ error: '需要经纬度参数' });
  }
  
  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,pressure_msl,weather_code&hourly=temperature_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,wind_speed_10m_max,wind_speed_10m_min&timezone=Asia/Shanghai`;
    const aqiUrl = `https://api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,ozone,dust,nitrogen_dioxide`;
    
    const weatherRes = await fetch(weatherUrl);
    const aqiRes = await fetch(aqiUrl);
    
    const weatherData = await weatherRes.json();
    const aqiData = await aqiRes.json();
    
    res.json({ weather: weatherData, air: aqiData });
  } catch (error) {
    res.status(500).json({ error: '获取天气数据失败' });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`天气服务器运行在 http://localhost:${PORT}`);
});
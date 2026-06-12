import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import {
  getDatabase,
  ref,
  onValue,
  set
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBQNOorWkstsRmjFC2V7Jb6ogjqYERYwdA",
  authDomain: "poject1-9ad6f.firebaseapp.com",
  databaseURL: "https://poject1-9ad6f-default-rtdb.firebaseio.com",
  projectId: "poject1-9ad6f",
  storageBucket: "poject1-9ad6f.firebasestorage.app",
  messagingSenderId: "157092418987",
  appId: "1:157092418987:web:2c3197e93b21f2dd0c2eee",
  measurementId: "G-SPTC55MKL2"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const temperature = document.getElementById("temperature");
const distance = document.getElementById("distance");
const mq = document.getElementById("mq");

const motorIcon = document.getElementById("motorIcon");
const motorStatus = document.getElementById("motorStatus");
const motorBadge = document.getElementById("motorBadge");
const motorStateText = document.getElementById("motorStateText");

const bulb = document.getElementById("bulb");
const ledStatus = document.getElementById("ledStatus");
const ledBadge = document.getElementById("ledBadge");
const lightStateText = document.getElementById("lightStateText");

const connectStatus = document.getElementById("connectStatus");
const firebaseStateText = document.getElementById("firebaseStateText");
const systemStatus = document.getElementById("systemStatus");

const dangerStatus = document.getElementById("dangerStatus");
const dangerStateText = document.getElementById("dangerStateText");

const tempAlert = document.getElementById("tempAlert");
const distanceAlert = document.getElementById("distanceAlert");
const mqAlert = document.getElementById("mqAlert");

function updateClock(){
  const now = new Date();
  const clock = document.getElementById("clock");

  if(clock){
    clock.innerText = now.toLocaleString("vi-VN");
  }
}

setInterval(updateClock,1000);
updateClock();

onValue(ref(database,"HeThongGiamSat"),(snapshot)=>{
  const data = snapshot.val();

  console.log("Firebase data:",data);

  if(connectStatus) connectStatus.innerText = "Đã kết nối";
  if(firebaseStateText) firebaseStateText.innerText = "Đã kết nối";
  if(systemStatus) systemStatus.innerText = "Hoạt động";

  if(!data){
    if(connectStatus) connectStatus.innerText = "Không có dữ liệu";
    return;
  }

  const nhietDo = Number(data.nhiet_do);
  const khoangCach = Number(data.khoang_cach);
  const khiGas = Number(data.khi_gas);
  const canhBao = data.canh_bao_nguy_hiem;
  const motor = data.trang_thai_motor;

  if(temperature){
    temperature.innerText = isNaN(nhietDo) ? "--" : nhietDo.toFixed(2);
  }

  if(distance){
    distance.innerText = isNaN(khoangCach) ? "--" : khoangCach.toFixed(1);
  }

  if(mq){
    mq.innerText = isNaN(khiGas) ? "--" : khiGas;
  }

  updateMotor(motor);
  updateDanger(canhBao);
  updateLED(canhBao);
  updateAlerts(nhietDo,khoangCach,khiGas,canhBao);

},(error)=>{
  console.log("Firebase error:",error);

  if(connectStatus) connectStatus.innerText = "Mất kết nối";
  if(firebaseStateText) firebaseStateText.innerText = "Mất kết nối";
  if(systemStatus) systemStatus.innerText = "Lỗi kết nối";
});

function updateMotor(state){
  const text = String(state).toUpperCase();

  const isRunning =
    text === "CHAY" ||
    text === "RUN" ||
    text === "RUNNING" ||
    text === "ON" ||
    state === true ||
    state === 1;

  if(motorIcon){
    if(isRunning){
      motorIcon.classList.add("spin");
    }else{
      motorIcon.classList.remove("spin");
    }
  }

  if(motorStatus){
    motorStatus.innerText = isRunning ? "Motor đang chạy" : "Motor đang dừng";
  }

  if(motorBadge){
    motorBadge.innerText = isRunning ? "ON" : "OFF";
    motorBadge.style.background = isRunning ? "#22c55e" : "#ef4444";
  }

  if(motorStateText){
    motorStateText.innerText = isRunning ? "Đang chạy" : "Đang dừng";
    motorStateText.style.color = isRunning ? "#22c55e" : "#ef4444";
  }
}

function updateDanger(state){
  const danger = state === true || state === 1 || state === "true";

  if(dangerStatus){
    dangerStatus.innerText = danger ? "NGUY HIỂM" : "AN TOÀN";
    dangerStatus.style.color = danger ? "#ef4444" : "#22c55e";
  }

  if(dangerStateText){
    dangerStateText.innerText = danger ? "Nguy hiểm" : "An toàn";
    dangerStateText.style.color = danger ? "#ef4444" : "#22c55e";
  }
}

function updateLED(state){
  const isOn = state === true || state === 1 || state === "true";

  if(bulb){
    if(isOn){
      bulb.classList.remove("off");
      bulb.classList.add("on");
    }else{
      bulb.classList.remove("on");
      bulb.classList.add("off");
    }
  }

  if(ledStatus){
    ledStatus.innerText = isOn ? "Đèn đang bật" : "Đèn đang tắt";
  }

  if(ledBadge){
    ledBadge.innerText = isOn ? "ON" : "OFF";
    ledBadge.style.background = isOn ? "#22c55e" : "#ef4444";
    ledBadge.style.boxShadow = isOn
      ? "0 0 18px rgba(34,197,94,.45)"
      : "0 0 18px rgba(239,68,68,.35)";
  }

  if(lightStateText){
    lightStateText.innerText = isOn ? "Đang bật" : "Đang tắt";
    lightStateText.style.color = isOn ? "#22c55e" : "#ef4444";
  }
}

function updateAlerts(nhietDo,khoangCach,khiGas,canhBao){
  if(tempAlert){
    if(!isNaN(nhietDo) && nhietDo >= 35){
      tempAlert.innerText = "Nhiệt độ cao";
      tempAlert.style.color = "#ef4444";
    }else{
      tempAlert.innerText = "Bình thường";
      tempAlert.style.color = "#22c55e";
    }
  }

  if(distanceAlert){
    if(!isNaN(khoangCach) && khoangCach <= 20){
      distanceAlert.innerText = "Vật thể gần";
      distanceAlert.style.color = "#facc15";
    }else{
      distanceAlert.innerText = "Bình thường";
      distanceAlert.style.color = "#22c55e";
    }
  }

  if(mqAlert){
    if(canhBao === true || (!isNaN(khiGas) && khiGas >= 1000)){
      mqAlert.innerText = "Gas cao";
      mqAlert.style.color = "#ef4444";
    }else{
      mqAlert.innerText = "An toàn";
      mqAlert.style.color = "#22c55e";
    }
  }
}

window.turnLedOn = function(){
  set(ref(database,"HeThongGiamSat/canh_bao_nguy_hiem"),true);
};

window.turnLedOff = function(){
  set(ref(database,"HeThongGiamSat/canh_bao_nguy_hiem"),false);
};
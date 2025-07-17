
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# 允許跨域請求，以便前端可以訪問後端
origins = [
    "http://localhost",
    "http://localhost:8000",
    "file://", # 允許從本地文件系統訪問
    "null", # 允許從本地文件系統訪問 (某些瀏覽器會將 file:// 視為 null origin)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 定義訂單資料模型
class Order(BaseModel):
    customer: dict
    items: list
    totalItems: int
    totalPrice: float

@app.post("/submit-order")
async def submit_order(order: Order):
    print("收到新的訂單！")
    print(f"客戶資訊: {order.customer}")
    print(f"訂單商品: {order.items}")
    print(f"總品項數: {order.totalItems}")
    print(f"總價格: {order.totalPrice}")
    # 在這裡你可以將訂單資料儲存到資料庫，發送郵件通知等
    return {"message": "訂單已成功接收！"}

# 運行說明：
# 1. 確保你已經安裝了 FastAPI 和 Uvicorn：
#    pip install fastapi uvicorn
# 2. 在終端機中，進入到這個檔案所在的目錄 (C:\Users\dcx08\Desktop\my-shop-page)
# 3. 執行以下命令來啟動後端伺服器：
#    uvicorn backend:app --reload
# 4. 訪問你的 index.html 頁面，然後點擊 "去結帳"，填寫資訊並提交，
#    你將會在後端伺服器運行的終端機中看到訂單資訊。

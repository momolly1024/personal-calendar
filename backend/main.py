import gspread
from oauth2client.service_account import ServiceAccountCredentials as SAC
from typing import Optional
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os

Json = "calendar.json"
Url = ["https://spreadsheets.google.com/feeds"]
Connect = SAC.from_json_keyfile_name(Json, Url)
GoogleSheets = gspread.authorize(Connect)
# Sheet = GoogleSheets.open_by_key(os.environ.get("sheetKey"))
Sheet = GoogleSheets.open_by_key('1p_1fAO-8og40blWFHPhJ77hub8b1KqZ5Iy53m0Jz0_0')
Sheets = Sheet.sheet1
# print(key.sheetKey)
# dataTitle = ["date", "time", "events", "place"]
# datas = ["03/11", "15:00", "dinner", "taipei"]
# # Sheets.append_row(dataTitle)
# Sheets.append_row(datas)
# print("寫入成功")
# print(Sheets.get_all_values())
# list_of_dicts = Sheets.get_all_records()
# print(list_of_dicts)

# ----- fast api -----

app = FastAPI()

origins = ["http://localhost", "http://localhost:3000", "*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def getAllData():
    return Sheets.get_all_records()


class Info(BaseModel):
    id: str
    data: list


@app.post("/addNewEvents")
def getInformation(info: Info):
    Sheets.append_row(info.data)
    return {"status": "SUCCESS", "data": info}

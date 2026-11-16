import base64
import zlib
import urllib.request

def encode_diagram(text):
    compressed = zlib.compress(text.encode('utf-8'), 9)
    return base64.urlsafe_b64encode(compressed).decode('ascii')

def generate_diagram(text, type, filename):
    encoded = encode_diagram(text)
    url = f"https://kroki.io/{type}/png/{encoded}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            with open(filename, 'wb') as f:
                f.write(response.read())
        print(f"Generated {filename}")
    except Exception as e:
        print(f"Failed to generate {filename}: {e}")

diagrams = [
    {
        "filename": "1_System_Architecture_HQ.png",
        "type": "plantuml",
        "text": """@startuml
skinparam dpi 300
scale max 3000 width
skinparam defaultFontSize 24
skinparam backgroundColor white
skinparam nodesep 100
skinparam ranksep 120
skinparam ArrowColor #000080
skinparam defaultFontColor #000000

node "Frontend (React)" as Frontend
node "Backend API (Spring Boot)" as Backend
node "AI Microservice (Flask)" as AI
database "MySQL Database" as DB

Frontend -down-> Backend : " API Request (JSON) "
Backend -down-> DB : " Read/Write Data "
Backend -right-> AI : " Forward AI Query "
AI -up-> Backend : " AI Response "

note right of Frontend : User Interface\nDashboards
note left of Backend : Auth, Stock, Portfolio
note right of DB : Stock History, Users
@enduml"""
    },
    {
        "filename": "2_DFD_Context_Level0_HQ.png",
        "type": "mermaid",
        "text": """%%{init: {'theme': 'default', 'themeVariables': { 'fontSize': '26px', 'background': '#ffffff', 'primaryTextColor': '#000000', 'lineColor': '#000080' }}}%%
graph LR
    User([User]) -- "Login, Queries, Trade Orders" --> System((Stock Analysis\nPlatform))
    System -- "Insights, Portfolio Status" --> User
    System -- "Request Market Data" --> API([Market Data API])
    API -- "Real-time Prices" --> System
    System -- "Send Prompts" --> Gemini([Google Gemini API])
    Gemini -- "AI Responses" --> System"""
    },
    {
        "filename": "2_DFD_Level1_HQ.png",
        "type": "plantuml",
        "text": """@startuml
skinparam dpi 300
skinparam defaultFontSize 22
skinparam backgroundColor white
skinparam nodesep 80
skinparam ranksep 100
skinparam ArrowColor #000080
skinparam defaultFontColor #000000

actor "User" as U
usecase "1.0 Auth" as Auth
usecase "2.0 Stock Data" as Stock
usecase "3.0 Portfolio" as Port
usecase "4.0 AI Chat" as AI
database "MySQL DB" as DB
boundary "External APIs" as Ext

U -right-> Auth : " Login Details "
Auth -down-> DB : " Verify/Store "
U -down-> Stock : " Search Stock "
Stock -right-> Ext : " Fetch Live "
Ext -left-> Stock : " Data "
Stock -down-> DB : " Save Metrics "
U -down-> Port : " Add/Sell "
Port -down-> DB : " Update "
U -down-> AI : " Ask Query "
AI -down-> DB : " Get Context "
AI -right-> Ext : " NLP Prompt "
@enduml"""
    },
    {
        "filename": "3_Entity_Relationship_HQ.png",
        "type": "mermaid",
        "text": """%%{init: {'theme': 'default', 'themeVariables': { 'fontSize': '24px', 'background': '#ffffff', 'primaryTextColor': '#000000', 'lineColor': '#000080' }}}%%
erDiagram
    USER ||--o{ PORTFOLIO : "manages"
    USER ||--o{ WATCHLIST : "has"
    STOCK ||--o{ STOCK_METRICS : "contains"
    STOCK ||--o{ STOCK_HISTORY : "has"
    PORTFOLIO }o--|| STOCK : "references"
    WATCHLIST }o--|| STOCK : "references"

    USER {
        int id PK
        string username
        string email
    }
    STOCK {
        string symbol PK
        string company_name
        string sector
    }
    STOCK_METRICS {
        int id PK
        float current_price
    }
    PORTFOLIO {
        int id PK
        int quantity
    }"""
    },
    {
        "filename": "4_Use_Case_HQ.png",
        "type": "plantuml",
        "text": """@startuml
left to right direction
skinparam dpi 300
skinparam defaultFontSize 24
skinparam backgroundColor white
skinparam nodesep 60
skinparam ranksep 100
skinparam ArrowColor #000080

actor User

rectangle "Stock Analysis Platform" {
  usecase "Register & Login" as UC1
  usecase "View Dashboard" as UC2
  usecase "Analyze Stock by Sector" as UC3
  usecase "Ask AI Chatbot" as UC4
  usecase "Manage Portfolio" as UC5
}

User --> UC1
User --> UC2
User --> UC3
User --> UC4
User --> UC5
@enduml"""
    },
    {
        "filename": "5_Sequence_HQ.png",
        "type": "plantuml",
        "text": """@startuml
skinparam dpi 300
skinparam defaultFontSize 20
skinparam backgroundColor white
skinparam participantPadding 40
skinparam boxPadding 40
skinparam ArrowColor #000080

actor User
participant "React Frontend" as UI
participant "Spring Backend" as API
participant "Flask AI Service" as AI
database "MySQL DB" as DB
participant "Gemini API" as Gem

User -> UI : "Ask stock query"
UI -> API : "POST /api/chat"
API -> AI : "Forward query"
AI -> DB : "Fetch stock context"
DB --> AI : "Return context data"
AI -> Gem : "Generate prompt"
Gem --> AI : "Return AI analysis"
AI --> API : "Processed response"
API --> UI : "Chatbot response"
UI --> User : "Display answer"
@enduml"""
    },
    {
        "filename": "6_Methodology_HQ.png",
        "type": "plantuml",
        "text": """@startuml
skinparam dpi 300
skinparam defaultFontSize 24
skinparam backgroundColor white
skinparam nodesep 60
skinparam ranksep 80
skinparam ArrowColor #000080

rectangle "1. Requirement Analysis" as S1
rectangle "2. UI/UX Design (React)" as S2
rectangle "3. Database Schema (MySQL)" as S3
rectangle "4. Backend APIs (Spring Boot)" as S4
rectangle "5. AI Service & Integrations" as S5
rectangle "6. System Testing" as S6
rectangle "7. Final Deployment" as S7

S1 -down-> S2 : " Flow approved "
S2 -down-> S3 : " UI finished "
S3 -down-> S4 : " Schema ready "
S4 -down-> S5 : " Endpoints done "
S5 -down-> S6 : " Integrated "
S6 -down-> S7 : " Tests passed "
@enduml"""
    }
]

for diag in diagrams:
    generate_diagram(diag["text"], diag["type"], diag["filename"])
